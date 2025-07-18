import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useRecording } from "@/hooks/use-recording";
import { useParentRecordings } from "@/hooks/use-parent-recordings";
import { Mic, Play, Save, Volume2 } from 'lucide-react';

export default function TestRecording() {
  const [testName] = useState('ANNA');
  const [testLetter] = useState('A');
  const [testPosition] = useState('first');
  
  const { 
    isRecording, 
    currentRecording, 
    isPlaying, 
    error, 
    startRecording, 
    stopRecording, 
    playRecording, 
    clearRecording 
  } = useRecording();
  
  const { saveRecording, getRecording } = useParentRecordings();
  
  const handleStartRecording = () => {
    const recordingId = `${testLetter}-${testPosition}`;
    startRecording(recordingId, 'phonetic');
  };
  
  const handleSaveRecording = () => {
    if (currentRecording) {
      saveRecording(testName, currentRecording);
      console.log('Recording saved for', testName);
    }
  };
  
  const handlePlaySaved = () => {
    const saved = getRecording(testName, testLetter, testPosition);
    if (saved) {
      playRecording(saved);
      console.log('Playing saved recording');
    } else {
      console.log('No saved recording found');
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Test Recording Functionality</h2>
      <div className="space-y-4">
        <div>
          <p>Testing with: <strong>{testName}</strong> - Letter <strong>{testLetter}</strong> ({testPosition})</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleStartRecording}
            disabled={isRecording}
            className="flex items-center gap-2"
          >
            <Mic className="w-4 h-4" />
            {isRecording ? 'Recording...' : 'Start Recording'}
          </Button>
          
          <Button
            onClick={stopRecording}
            disabled={!isRecording}
            variant="outline"
          >
            Stop Recording
          </Button>
        </div>
        
        {currentRecording && (
          <div className="flex gap-2">
            <Button
              onClick={() => playRecording(currentRecording)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Play Current
            </Button>
            
            <Button
              onClick={handleSaveRecording}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Recording
            </Button>
          </div>
        )}
        
        <div>
          <Button
            onClick={handlePlaySaved}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Volume2 className="w-4 h-4" />
            Play Saved Recording
          </Button>
        </div>
        
        {error && (
          <div className="text-red-600 p-2 bg-red-50 rounded">
            Error: {error}
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          <p>Status: {isRecording ? 'Recording' : isPlaying ? 'Playing' : 'Ready'}</p>
          <p>Current recording: {currentRecording ? 'Yes' : 'None'}</p>
        </div>
      </div>
    </div>
  );
}