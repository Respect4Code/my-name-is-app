
import { useState, useEffect, useCallback } from "react";
import { Recording } from "./use-recording";

interface ParentRecordings {
  [nameKey: string]: {
    [letterPosition: string]: Recording;
  };
}

export function useParentRecordings() {
  const [recordings, setRecordings] = useState<ParentRecordings>({});
  const [isLoading, setIsLoading] = useState(false);

  // Create a key for storing recordings by name
  const getNameKey = useCallback((name: string) => {
    return name.toLowerCase().replace(/[^a-z]/g, '');
  }, []);

  // Create a key for letter position
  const getLetterKey = useCallback((letter: string, position: string) => {
    return `${letter}-${position}`;
  }, []);

  // Load recordings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mynameIs_parentRecordings');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert stored blob URLs back to recordings
        const restoredRecordings: ParentRecordings = {};
        
        Object.entries(parsed).forEach(([nameKey, nameRecordings]) => {
          restoredRecordings[nameKey] = {};
          Object.entries(nameRecordings as any).forEach(([letterKey, recording]: [string, any]) => {
            // Note: We'll need to re-record these as blob URLs don't persist
            // This is intentional for privacy - recordings don't persist across sessions
            if (recording && recording.id) {
              restoredRecordings[nameKey][letterKey] = {
                ...recording,
                audioUrl: '', // Will need to be re-recorded
                audioBlob: new Blob()
              };
            }
          });
        });
        
        setRecordings(restoredRecordings);
      }
    } catch (error) {
      console.error('Error loading parent recordings:', error);
    }
  }, []);

  // Save recordings to localStorage
  const saveToStorage = useCallback((updatedRecordings: ParentRecordings) => {
    try {
      // Convert recordings for storage (excluding blob data for privacy)
      const toStore: any = {};
      Object.entries(updatedRecordings).forEach(([nameKey, nameRecordings]) => {
        toStore[nameKey] = {};
        Object.entries(nameRecordings).forEach(([letterKey, recording]) => {
          toStore[nameKey][letterKey] = {
            id: recording.id,
            letter: recording.letter,
            position: recording.position,
            duration: recording.duration,
            createdAt: recording.createdAt,
            // Don't store audioBlob or audioUrl for privacy
          };
        });
      });
      
      localStorage.setItem('mynameIs_parentRecordings', JSON.stringify(toStore));
    } catch (error) {
      console.error('Error saving parent recordings:', error);
    }
  }, []);

  // Add or update a recording
  const saveRecording = useCallback((name: string, recording: Recording) => {
    const nameKey = getNameKey(name);
    const letterKey = getLetterKey(recording.letter, recording.position);
    
    setRecordings(prev => {
      const updated = {
        ...prev,
        [nameKey]: {
          ...prev[nameKey],
          [letterKey]: recording
        }
      };
      saveToStorage(updated);
      return updated;
    });
  }, [getNameKey, getLetterKey, saveToStorage]);

  // Get recording for specific letter/position in a name
  const getRecording = useCallback((name: string, letter: string, position: string): Recording | null => {
    const nameKey = getNameKey(name);
    const letterKey = getLetterKey(letter, position);
    return recordings[nameKey]?.[letterKey] || null;
  }, [recordings, getNameKey, getLetterKey]);

  // Get all recordings for a name
  const getNameRecordings = useCallback((name: string): Recording[] => {
    const nameKey = getNameKey(name);
    const nameRecordings = recordings[nameKey] || {};
    return Object.values(nameRecordings);
  }, [recordings, getNameKey]);

  // Delete a specific recording
  const deleteRecording = useCallback((name: string, letter: string, position: string) => {
    const nameKey = getNameKey(name);
    const letterKey = getLetterKey(letter, position);
    
    setRecordings(prev => {
      const updated = { ...prev };
      if (updated[nameKey]) {
        const { [letterKey]: deleted, ...rest } = updated[nameKey];
        updated[nameKey] = rest;
        
        // Clean up the name entry if it's empty
        if (Object.keys(updated[nameKey]).length === 0) {
          delete updated[nameKey];
        }
      }
      saveToStorage(updated);
      return updated;
    });
  }, [getNameKey, getLetterKey, saveToStorage]);

  // Check if we have recordings for a name
  const hasRecordings = useCallback((name: string): boolean => {
    const nameKey = getNameKey(name);
    return Object.keys(recordings[nameKey] || {}).length > 0;
  }, [recordings, getNameKey]);

  // Get recording completion status for a name
  const getCompletionStatus = useCallback((name: string) => {
    const letters = name.split('');
    const nameRecordings = getNameRecordings(name);
    const recordedCount = nameRecordings.length;
    const totalCount = letters.length;
    
    return {
      recorded: recordedCount,
      total: totalCount,
      percentage: totalCount > 0 ? Math.round((recordedCount / totalCount) * 100) : 0,
      isComplete: recordedCount === totalCount
    };
  }, [getNameRecordings]);

  return {
    recordings,
    isLoading,
    saveRecording,
    getRecording,
    getNameRecordings,
    deleteRecording,
    hasRecordings,
    getCompletionStatus
  };
}
