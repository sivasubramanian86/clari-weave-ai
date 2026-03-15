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
  const [connectionType, setConnectionType] = useState<'mic' | 'camera' | 'screen'>('mic');
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
      
      await fetch('http://localhost:8082/api/analyze-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            data: base64,
            mime_type: 'image/jpeg',
            session_id: 'default_session'
        })
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
    if (msg.error) {
        console.error("DEBUG: Backend WebSocket Error:", msg.error);
        addTranscript(`[System Error]: ${msg.error}`);
        return;
    }

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
        case 'metrics':
        case 'session_metrics':
            setMetrics(msg.data);
            break;
        case 'session_ended':
            // Logic handled by useEffect
            break;
    }
  }, [addTranscript, clearBuffer]);

  // const [metrics, setMetrics] = useState<AnalysisMetrics | null>(null); // Keeping existing SessionMetrics type
  // Dynamic URL resolution for Cloud Deployment
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  const isDev = host.includes('localhost') || host.includes('127.0.0.1');
  
  // In production, we serve from the same origin on port 8080/Cloud Run default
  // In development, the backend is usually on 8082
  const defaultWsUrl = isDev ? `${protocol}//${window.location.hostname}:8082/ws/session` : `${protocol}//${host}/ws/session`;
  const [currentWsUrl, setCurrentWsUrl] = useState(defaultWsUrl);
  const baseUrl = isDev ? `http://${window.location.hostname}:8082` : ``;

  // Handle incoming audio directly
  const handleAudio = useCallback((data: ArrayBuffer) => {
    playAudio(data);
  }, [playAudio]);

  const { isConnected, connect: wsConnect, disconnect: wsDisconnect, send: wsSend } = useLiveSession(currentWsUrl, {
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

  const connect = useCallback(async (type: 'mic' | 'camera' | 'screen' = 'mic', isDemo = false) => {
    setConnectionType(type);
    const targetUrl = isDemo 
        ? (isDev ? `${protocol}//${window.location.hostname}:8082/ws/demo` : `${protocol}//${host}/ws/demo`)
        : defaultWsUrl;
    
    setCurrentWsUrl(targetUrl);
    // Use a small timeout to ensure the state update for URL propagates if needed, 
    // though useLiveSession uses the latest url from its props/args on connect()
    wsConnect();
  }, [wsConnect, defaultWsUrl, protocol, host, isDev]);

  // Effect to start capture once WS is connected
  useEffect(() => {
    if (isConnected) {
        startCapture(connectionType, (buffer) => {
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

  // Hackathon Debug Trigger: Force render mock data if live analysis hangs
  useEffect(() => {
    const handleForceMock = () => {
      console.log("DEBUG: Forcing Mock Data for Nano Banana Demo");
      setMetrics({
        clarity_score: 92,
        stress_level: 8,
        topic_affinity: { "Nano Banana": 100, "Innovation": 85, "Visual Synthesis": 95 },
        action_readiness: "Peak Performance"
      });
    };
    window.addEventListener('force-mock-data', handleForceMock);
    return () => window.removeEventListener('force-mock-data', handleForceMock);
  }, []);

  const finishSession = useCallback(() => {
    wsSend(JSON.stringify({ type: 'finalize' }));
    setTimeout(() => {
        disconnect();
    }, 2000);
  }, [wsSend, disconnect]);

  const sendMedia = useCallback(async (base64: string, mimeType: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/analyze-media`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: base64,
                mime_type: mimeType,
                session_id: 'default_session'
            })
        });
        
        const result = await response.json();
        if (result.status === 'success') {
            console.log("DEBUG: Hybrid Analysis Success", result.analysis);
            if (result.metrics) {
                console.log("DEBUG: Setting Metrics from REST", result.metrics);
                setMetrics(result.metrics);
            }
            
            // Add to UI transcript
            addTranscript(`[Visual Intelligence]: ${result.analysis}`);

            // Forward analysis to Clara via WebSocket so she narrates it aloud
            if (result.analysis) {
                wsSend(JSON.stringify({
                    type: 'text',
                    text: `[Media Analysis Complete] Here is what I observed from the uploaded media:\n\n${result.analysis}\n\nMetrics: Clarity ${result.metrics?.clarity_score ?? 'N/A'}/100, Stress ${result.metrics?.stress_level ?? 'N/A'}/100. Please summarize this for the user and offer guidance.`
                }));
            }
        } else {
            console.error("DEBUG: Hybrid Analysis returned error", result.message);
        }
    } catch (err) {
        console.error("Hybrid Analysis Failed:", err);
    }
  }, [addTranscript]);

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
    finishSession,
    sendMedia
  };
}
