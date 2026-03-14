import { useState, useCallback } from 'react';

export function useTranscript() {
  const [transcript, setTranscript] = useState<string[]>([]);
  const [lastTranscript, setLastTranscript] = useState<string>('');

  const addTranscript = useCallback((text: string) => {
    setTranscript(prev => [...prev, text]);
    setLastTranscript(text);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript([]);
    setLastTranscript('');
  }, []);

  return { transcript, lastTranscript, addTranscript, clearTranscript };
}
