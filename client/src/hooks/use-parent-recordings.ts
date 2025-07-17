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

  const saveRecording = async (key: string, recording: Recording) => {
    try {
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

      setRecordings(prev => ({
        ...prev,
        [key]: storedRecording
      }));
    } catch (error) {
      console.error('Error saving recording:', error);
    }
  };

  const getRecording = (key: string): Recording | null => {
    const stored = recordings[key];
    if (!stored) return null;

    try {
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
    return nameKeys.map(key => ({
      key,
      recording: getRecording(key)
    })).filter(item => item.recording !== null);
  };

  const hasRecordingsForName = (name: string) => {
    return Object.keys(recordings).some(key => key.startsWith(`${name}-`));
  };

  return {
    saveRecording,
    getRecording,
    deleteRecording,
    getNameRecordings,
    hasRecordingsForName,
    recordings
  };
}