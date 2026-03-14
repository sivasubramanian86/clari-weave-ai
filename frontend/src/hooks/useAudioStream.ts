import { useState, useCallback, useEffect, useRef } from 'react';
import { useLiveSession, type WebSocketMessage } from './useLiveSession';
import { useAudioCapture } from './useAudioCapture';
import { useAudioPlayback } from './useAudioPlayback';
import { useTranscript } from './useTranscript';

export interface SessionMetrics {
  clarity_score: number;
  stress_level: number;
  topic_affinity: Record<string, number>;
  action_readiness: string;
}

export function useAudioStream() {
  const { transcript, addTranscript, clearTranscript } = useTranscript();
  const { playAudio, stopPlayback, clearBuffer } = useAudioPlayback();
  const { isCapturing, permissionError, audioLevel, stream, startCapture, stopCapture } = useAudioCapture();

  const [metrics, setMetrics] = useState<SessionMetrics | null>(null);
  const [clarityMap, setClarityMap] = useState<Record<string, unknown> | null>(null);
  const [ragStatus, setRagStatus] = useState<string | null>(null);
  const videoIntervalRef = useRef<number | null>(null);

  const captureFrame = useCallback(async (videoTrack: MediaStreamTrack) => {
    try {
      const video = document.createElement('video');
      video.srcObject = new MediaStream([videoTrack]);
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      const base64 = canvas.toDataURL('image/jpeg', 0.6).split(',')[1];
      
      await fetch('http://localhost:8082/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 })
      });

      video.srcObject = null;
      video.remove();
    } catch (err) {
      console.error("Frame capture failed", err);
    }
  }, []);

  // Define message handler for WebSocket
  const handleMessage = useCallback((msg: WebSocketMessage) => {
    // console.log("DEBUG: Received WS message", msg.type);
    switch (msg.type) {
        case 'transcript':
            addTranscript(msg.text); // Correct usage: addTranscript takes a string
            break;
        case 'interrupt':
            clearBuffer();
            break;
        case 'clarity_map':
            setClarityMap(msg.data);
            break;
        case 'rag_notification':
            setRagStatus(msg.status);
            setTimeout(() => setRagStatus(null), 3000);
            break;
        case 'session_metrics':
            setMetrics(msg.data);
            break;
        case 'session_ended':
            // Logic handled by useEffect
            break;
    }
  }, [addTranscript, clearBuffer]);

  // Handle incoming audio directly
  const handleAudio = useCallback((data: ArrayBuffer) => {
    playAudio(data);
  }, [playAudio]);

  const { isConnected, connect: wsConnect, disconnect: wsDisconnect, send: wsSend } = useLiveSession(
    'ws://localhost:8082/ws/session',
    {
        onAudio: handleAudio,
        onMessage: handleMessage
    }
  );

  const disconnect = useCallback(() => {
    if (videoIntervalRef.current) {
        clearInterval(videoIntervalRef.current);
        videoIntervalRef.current = null;
    }
    stopCapture();
    stopPlayback();
    wsDisconnect();
    clearTranscript();
  }, [stopCapture, stopPlayback, wsDisconnect, clearTranscript]);

  const connect = useCallback(async (type: 'mic' | 'camera' | 'screen' = 'mic') => {
    wsConnect();
  }, [wsConnect]);

  // Effect to start capture once WS is connected
  useEffect(() => {
    if (isConnected) {
        startCapture((buffer) => {
            wsSend(buffer);
        }).then((mediaStream) => {
            if (mediaStream) {
                const videoTrack = mediaStream.getVideoTracks()[0];
                if (videoTrack) {
                    videoIntervalRef.current = window.setInterval(() => captureFrame(videoTrack), 3000);
                }
            }
        });
    } else {
        // Cleanup if disconnected unexpectedly
        if (isCapturing) {
            disconnect();
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const finishSession = useCallback(() => {
    wsSend(JSON.stringify({ type: 'finalize' }));
    setTimeout(() => {
        disconnect();
    }, 2000);
  }, [wsSend, disconnect]);

  return { 
    isConnected, 
    transcript, 
    clarityMap, 
    metrics, 
    ragStatus, 
    permissionError,
    audioLevel,
    stream, 
    connect, 
    disconnect, 
    finishSession 
  };
}
