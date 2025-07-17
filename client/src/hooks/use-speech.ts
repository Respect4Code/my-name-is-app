import { useState, useCallback } from "react";

export function useSpeech(rate: number = 0.8) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Ensure rate is a valid number
  const speechRate = typeof rate === 'number' && !isNaN(rate) ? rate : 0.8;

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);

      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Improve performance with preferred voice selection
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        utterance.voice = voices.find(voice => voice.lang.startsWith('en')) || voices[0];
      }

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      speechSynthesis.speak(utterance);
    }
  }, [speechRate]);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, []);

  return { speak, stop, isPlaying };
}