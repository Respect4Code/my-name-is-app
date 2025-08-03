import { useLocalStorage } from './use-local-storage';
import type { Recording } from './use-recording';

interface StoredRecording {
  id: string;
  blob: string; // base64 encoded
  timestamp: number;
  type: string;
  stage: string;
}

export function useParentRecordings() {
  const [recordings, setRecordings] = useLocalStorage<Record<string, StoredRecording>>('mynameIs_parentRecordings', {});

  const saveRecording = async (name: string, recording: Recording) => {
    try {
      // Check if browser APIs are available
      if (typeof window === 'undefined' || !window.btoa || !recording.blob?.arrayBuffer) {
        // Browser APIs not available - silent fallback
        return;
      }
      
      // Convert blob to base64
      const arrayBuffer = await recording.blob.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      const storedRecording: StoredRecording = {
        id: recording.id,
        blob: base64,
        timestamp: recording.timestamp,
        type: recording.type,
        stage: recording.stage
      };

      const key = `${name}-${recording.id}`;
      console.log('🎵 Saving recording with key:', key);
      setRecordings(prev => ({
        ...prev,
        [key]: storedRecording
      }));
    } catch (error) {
      console.error('Error saving recording:', error);
    }
  };

  const getRecording = (name: string, letter: string, position: string): Recording | null => {
    const key = `${name}-${letter}-${position}`;
    console.log('🎵 Getting recording with key:', key, 'Available keys:', Object.keys(recordings));
    const stored = recordings[key];
    if (!stored) return null;

    try {
      // Check if browser APIs are available
      if (typeof window === 'undefined' || !window.atob || !window.URL?.createObjectURL) {
        // Browser APIs not available - silent fallback
        return null;
      }
      
      // Convert base64 back to blob
      const binaryString = atob(stored.blob);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: stored.type });
      const url = URL.createObjectURL(blob);

      return {
        id: stored.id,
        blob,
        url,
        timestamp: stored.timestamp,
        type: stored.type,
        stage: stored.stage
      };
    } catch (error) {
      console.error('Error loading recording:', error);
      return null;
    }
  };

  const deleteRecording = (key: string) => {
    setRecordings(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const getNameRecordings = (name: string) => {
    const nameKeys = Object.keys(recordings).filter(key => key.startsWith(`${name}-`));
    return nameKeys.map(key => {
      const parts = key.split('-');
      const name = parts[0];
      const letter = parts[1];
      const position = parts[2];
      return {
        key,
        recording: getRecording(name, letter, position)
      };
    }).filter(item => item.recording !== null);
  };

  const hasRecordingsForName = (name: string) => {
    return Object.keys(recordings).some(key => key.startsWith(`${name}-`));
  };

  const getCompletionStatus = (name: string) => {
    const nameKeys = Object.keys(recordings).filter(key => key.startsWith(`${name}-`));
    const recorded = nameKeys.length;
    const total = 4; // full-name, phonetic, singing, sentence
    return { recorded, total, percentage: total > 0 ? (recorded / total) * 100 : 0 };
  };

  return {
    saveRecording,
    getRecording,
    deleteRecording,
    getNameRecordings,
    hasRecordingsForName,
    getCompletionStatus,
    recordings
  };
}