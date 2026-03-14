import { useState, useRef, useCallback } from 'react';

export function useAudioCapture() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0); // For local visual feedback

  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | AudioWorkletNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCapture = useCallback(async (type: 'mic' | 'camera' | 'screen', onAudioProcess: (buffer: ArrayBuffer) => void) => {
    try {
      console.log(`DEBUG: Requesting ${type} permission...`);
      let stream;
      if (type === 'screen') {
          const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream = new MediaStream([...displayStream.getVideoTracks(), ...audioStream.getAudioTracks()]);
      } else if (type === 'camera') {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } else {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      streamRef.current = stream;
      
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // @ts-ignore - 'closed' is a valid state in modern browsers but missing in some TS typings
      if (audioContext.state === 'closed') {
        console.warn("DEBUG: AudioContext is closed, aborting capture setup");
        return null;
      }

      await audioContext.audioWorklet.addModule('/pcm-worker.js');
      
      // @ts-ignore - 'closed' is a valid state in modern browsers but missing in some TS typings
      if (audioContext.state === 'closed') {
        console.warn("DEBUG: AudioContext was closed during module loading");
        return null;
      }

      const source = audioContext.createMediaStreamSource(stream);
      const processor = new AudioWorkletNode(audioContext, 'pcm-processor');
      processorRef.current = processor; // No cast needed if ref type is updated

      processor.port.onmessage = (e) => {
        const buffer = e.data;
        const inputData = new Int16Array(buffer);
        
        let sumSquares = 0;
        for (let i = 0; i < inputData.length; i++) {
          let val = inputData[i] / 0x8000;
          sumSquares += val * val;
        }
        
        const rms = Math.sqrt(sumSquares / inputData.length);
        if (rms > 0.01) {
            // console.log(`DEBUG: Audio capture active (RMS: ${rms.toFixed(4)})`);
        }
        setAudioLevel(Math.floor(rms * 100));

        onAudioProcess(buffer);
      };

      source.connect(processor);
      processor.connect(audioContext.destination); // Keep this if you want the audio to also play through speakers
      
      setIsCapturing(true);
      setPermissionError(false);
      console.log("DEBUG: Audio capture started at 16kHz");
      return stream;
    } catch (err: any) {
      console.error("Audio capture failed", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError(true);
      }
      return null;
    }
  }, []);

  const stopCapture = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
    setAudioLevel(0);
    console.log("DEBUG: Audio capture stopped");
  }, []);

  return { isCapturing, permissionError, audioLevel, stream: streamRef.current, startCapture, stopCapture };
}
