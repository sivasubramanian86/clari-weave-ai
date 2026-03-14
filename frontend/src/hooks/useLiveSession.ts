import { useState, useRef, useCallback, useEffect } from 'react';

export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface UseLiveSessionOptions {
  onAudio?: (data: ArrayBuffer) => void;
  onMessage?: (msg: WebSocketMessage) => void;
}

export function useLiveSession(url: string, options: UseLiveSessionOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const optionsRef = useRef(options);

  // Keep options ref in sync to avoid stale closures in callbacks
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    
    console.log(`DEBUG: Connecting to WebSocket at ${url}`);
    wsRef.current = new WebSocket(url);
    wsRef.current.binaryType = 'arraybuffer';

    wsRef.current.onopen = () => {
      console.log("DEBUG: WebSocket opened");
      setIsConnected(true);
      optionsRef.current.onMessage?.({ type: 'session_started' });
    };

    wsRef.current.onmessage = (event) => {
      if (typeof event.data === 'string') {
        try {
          const msg = JSON.parse(event.data);
          optionsRef.current.onMessage?.(msg);
        } catch (e) {
          console.error("Failed to parse WS message", e);
        }
      } else if (event.data instanceof ArrayBuffer) {
        optionsRef.current.onAudio?.(event.data);
      }
    };

    wsRef.current.onclose = () => {
      console.log("DEBUG: WebSocket closed");
      setIsConnected(false);
      optionsRef.current.onMessage?.({ type: 'session_ended' });
    };

    wsRef.current.onerror = (err) => {
      console.error("WebSocket error", err);
    };
  }, [url]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const send = useCallback((data: string | ArrayBuffer) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return { isConnected, connect, disconnect, send };
}
