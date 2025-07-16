
import { useState, useCallback, useRef } from "react";

export interface Recording {
  id: string;
  letter: string;
  position: string;
  audioBlob: Blob;
  audioUrl: string;
  duration: number;
  createdAt: string;
}

export function useRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRecording, setCurrentRecording] = useState<Recording | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async (letter: string, position: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const recording: Recording = {
          id: `${letter}-${position}-${Date.now()}`,
          letter,
          position,
          audioBlob,
          audioUrl,
          duration: 0, // Will be calculated when played
          createdAt: new Date().toISOString()
        };
        
        setCurrentRecording(recording);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Could not access microphone. Please check permissions.');
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

    const audio = new Audio(recording.audioUrl);
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      recording.duration = audio.duration;
    };

    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => setIsPlaying(false);

    audio.play().catch(error => {
      console.error('Error playing recording:', error);
      setIsPlaying(false);
    });
  }, []);

  const stopPlaying = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  const deleteRecording = useCallback((recording: Recording) => {
    if (recording.audioUrl) {
      URL.revokeObjectURL(recording.audioUrl);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setCurrentRecording(null);
    setIsPlaying(false);
  }, []);

  return {
    isRecording,
    isPlaying,
    currentRecording,
    startRecording,
    stopRecording,
    playRecording,
    stopPlaying,
    deleteRecording,
    setCurrentRecording
  };
}
