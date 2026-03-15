import { useRef, useCallback, useEffect } from 'react';

interface UseWakeWordOptions {
  onStart: () => void;
  onStop: () => void;
  enabled?: boolean;
}

export function useWakeWord({ onStart, onStop, enabled = true }: UseWakeWordOptions) {
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  
  // Use refs for callbacks to prevent the recognition from restarting when 
  // the parent component's state (like isConnected) changes.
  const onStartRef = useRef(onStart);
  const onStopRef = useRef(onStop);

  useEffect(() => {
    onStartRef.current = onStart;
    onStopRef.current = onStop;
  }, [onStart, onStop]);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('[Wake Word] SpeechRecognition not supported.');
      return;
    }

    if (isListeningRef.current) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true; // Use interim for faster response
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    // Robust Regex Patterns
    const START_RE = /(hey|hi|hello|wake\s+up)\s+clara/i;
    // Captures: "stop clara", "shutdown clara", "goodbye clara", "stop", "shutdown", "exit", "quit"
    const STOP_RE = /(stop|shutdown|shut down|goodbye|bye|terminate|exit|quit)(\s+clara)?/i;

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript.toLowerCase().trim();
        
        // Only trigger on final results or if phrase is very clear
        if (result.isFinal || result[0].confidence > 0.8) {
          console.log(`[Wake Word] Detected: "${transcript}"`);

          if (START_RE.test(transcript)) {
            console.log('[Wake Word] START Triggered');
            onStartRef.current();
          } else if (STOP_RE.test(transcript)) {
            console.log('[Wake Word] STOP Triggered');
            onStopRef.current();
          }
        }
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.warn('[Wake Word] Recognition Error:', event.error);
      }
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      // Auto-restart if still enabled
      if (enabled && recognitionRef.current) {
        setTimeout(() => {
          if (!isListeningRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
              isListeningRef.current = true;
            } catch (e) {
              console.warn('[Wake Word] Restart failed:', e);
            }
          }
        }, 300);
      }
    };

    try {
      recognition.start();
      isListeningRef.current = true;
      console.log('[Wake Word] Active & Listening...');
    } catch (e) {
      console.warn('[Wake Word] Could not start:', e);
    }
  }, [enabled]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null; // Prevent auto-restart loop
      recognitionRef.current.stop();
      recognitionRef.current = null;
      isListeningRef.current = false;
      console.log('[Wake Word] Stopped');
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      startListening();
    } else {
      stopListening();
    }
    return () => stopListening();
  }, [enabled, startListening, stopListening]);
}
