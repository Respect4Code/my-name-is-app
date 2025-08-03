import { useState, useRef, useCallback } from 'react';

export interface Recording {
  id: string;
  blob: Blob;
  url: string;
  timestamp: number;
  type: string;
  stage: string;
}

export function useRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentRecording, setCurrentRecording] = useState<Recording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = useCallback(async (id: string, stage: string) => {
    try {
      // Silent fallback - no error thrown for trust
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('Media recording not available, using fallback');
        setError('Microphone not available');
        setIsRecording(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        const url = URL.createObjectURL(blob);
        const recording: Recording = {
          id,
          blob,
          url,
          timestamp: Date.now(),
          type: 'audio/webm;codecs=opus',
          stage
        };
        setCurrentRecording(recording);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.onerror = (event) => {
        console.error('Recording error:', event);
        setError('Recording failed');
        setIsRecording(false);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setError(null);
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Recording unavailable');
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const playRecording = useCallback((recording: Recording) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(recording.url);
    audioRef.current = audio;

    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => {
      setIsPlaying(false);
      setError('Failed to play recording');
    };

    audio.play().catch(() => {
      setIsPlaying(false);
      setError('Failed to play recording');
    });
  }, []);

  const clearRecording = useCallback(() => {
    setCurrentRecording(null);
    setError(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  return {
    isRecording,
    currentRecording,
    isPlaying,
    error,
    startRecording,
    stopRecording,
    playRecording,
    clearRecording,
  };
}