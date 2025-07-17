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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async (id: string, stage: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        const url = URL.createObjectURL(blob);

        const recording: Recording = {
          id,
          blob,
          url,
          timestamp: Date.now(),
          type: 'audio/webm',
          stage
        };

        setCurrentRecording(recording);

        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Failed to start recording. Please check microphone permissions.');
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
    audio.onerror = () => setIsPlaying(false);

    audio.play().catch(error => {
      console.error('Error playing recording:', error);
      setIsPlaying(false);
    });
  }, []);

  const clearRecording = useCallback(() => {
    if (currentRecording) {
      URL.revokeObjectURL(currentRecording.url);
      setCurrentRecording(null);
    }
  }, [currentRecording]);

  return {
    isRecording,
    currentRecording,
    isPlaying,
    startRecording,
    stopRecording,
    playRecording,
    clearRecording
  };
}