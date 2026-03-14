import { useRef, useCallback } from 'react';

/**
 * useAudioPlayback handles receiving and playing PCM audio packets.
 * It uses a look-ahead scheduling mechanism to ensure smooth playback
 * even with minor network or processing jitter.
 */
export function useAudioPlayback() {
  const playbackContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const BUFFER_GAP = 0.05; // 50ms safety gap for jitter

  const playAudio = useCallback(async (buffer: ArrayBuffer) => {
    if (!playbackContextRef.current || playbackContextRef.current.state === 'closed') {
      console.log("DEBUG: Creating fresh AudioContext for playback (24kHz)");
      playbackContextRef.current = new AudioContext({ sampleRate: 24000 });
      nextStartTimeRef.current = 0;
    }

    const audioCtx = playbackContextRef.current;
    
    // Resume context if suspended (common browser requirement)
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    try {
      const pcm16 = new Int16Array(buffer);
      const audioBuffer = audioCtx.createBuffer(1, pcm16.length, 24000);
      const channelData = audioBuffer.getChannelData(0);
      
      // Normalize Int16 to Float32
      for (let i = 0; i < pcm16.length; i++) {
        channelData[i] = pcm16[i] / 32768.0;
      }

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      
      const currentTime = audioCtx.currentTime;
      
      // If we've fallen behind, catch up with a small gap
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime + BUFFER_GAP;
      }
      
      source.start(nextStartTimeRef.current);
      // Increment next start time by the exact duration of the buffer
      nextStartTimeRef.current += audioBuffer.duration;
      
    } catch (e) {
      console.error("Playback error", e);
    }
  }, []);

  const stopPlayback = useCallback(() => {
    if (playbackContextRef.current) {
      playbackContextRef.current.close().catch(console.error);
      playbackContextRef.current = null;
      nextStartTimeRef.current = 0;
    }
  }, []);

  const clearBuffer = useCallback(() => {
    // Quickly reset the context to clear all pending/jittery audio
    if (playbackContextRef.current) {
        playbackContextRef.current.close().then(() => {
            playbackContextRef.current = new AudioContext({ sampleRate: 24000 });
            nextStartTimeRef.current = 0;
        }).catch(console.error);
    }
  }, []);

  return { playAudio, stopPlayback, clearBuffer };
}
