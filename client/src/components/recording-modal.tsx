
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mic, MicOff, Play, Pause, Trash2, Save, RotateCcw } from "lucide-react";
import { useRecording, type Recording } from "@/hooks/use-recording";
import { PhonicsData } from "@/lib/phonics";

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  phonicsData: PhonicsData;
  existingRecording?: Recording;
  onSave: (recording: Recording) => void;
}

export default function RecordingModal({ 
  isOpen, 
  onClose, 
  phonicsData, 
  existingRecording,
  onSave 
}: RecordingModalProps) {
  const {
    isRecording,
    isPlaying,
    currentRecording,
    startRecording,
    stopRecording,
    playRecording,
    stopPlaying,
    deleteRecording,
    setCurrentRecording
  } = useRecording();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingRecording) {
      setCurrentRecording(existingRecording);
    }
  }, [existingRecording, setCurrentRecording]);

  const handleStartRecording = async () => {
    try {
      setError(null);
      await startRecording(phonicsData.letter, phonicsData.position);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Recording failed');
    }
  };

  const handleSave = () => {
    if (currentRecording) {
      onSave(currentRecording);
      onClose();
    }
  };

  const handleClose = () => {
    if (isRecording) {
      stopRecording();
    }
    if (isPlaying) {
      stopPlaying();
    }
    onClose();
  };

  const handleRetry = () => {
    if (currentRecording) {
      deleteRecording(currentRecording);
    }
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-purple-600">
            Record Sound for "{phonicsData.letter}"
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Letter Display */}
          <div className="text-center">
            <div className="text-6xl font-bold text-purple-600 mb-2">
              {phonicsData.letter}
            </div>
            <div className="text-lg text-gray-600">
              The <span className="font-semibold">{phonicsData.position}</span> letter
            </div>
            <div className="text-sm text-gray-500 mt-1">
              How does this letter sound when YOU say your child's name?
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          {/* Recording Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <div className="font-semibold text-blue-800 mb-2">What to Record:</div>
            <ul className="text-blue-700 space-y-1">
              <li>• Say how this letter sounds when YOU say your child's name</li>
              <li>• Don't worry about "correct" phonetics - use YOUR pronunciation</li>
              <li>• Keep it short - 1-2 seconds maximum</li>
              <li>• Record in a quiet environment</li>
            </ul>
          </div>

          {/* Recording Controls */}
          <div className="flex flex-col items-center space-y-4">
            {!currentRecording && !isRecording && (
              <Button
                onClick={handleStartRecording}
                className="w-24 h-24 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
                disabled={!!error}
              >
                <Mic className="w-8 h-8" />
              </Button>
            )}

            {isRecording && (
              <div className="text-center">
                <Button
                  onClick={stopRecording}
                  className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg animate-pulse"
                >
                  <MicOff className="w-8 h-8" />
                </Button>
                <div className="text-sm text-red-600 mt-2 font-medium">
                  Recording... Click to stop
                </div>
              </div>
            )}

            {currentRecording && !isRecording && (
              <div className="text-center space-y-3">
                <div className="flex justify-center space-x-3">
                  <Button
                    onClick={() => playRecording(currentRecording)}
                    disabled={isPlaying}
                    className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'Playing...' : 'Play'}</span>
                  </Button>

                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retry</span>
                  </Button>
                </div>

                <div className="text-sm text-gray-600">
                  Recording ready! Play to review.
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={!currentRecording || isRecording}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Recording
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
