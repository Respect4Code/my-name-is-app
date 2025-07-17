
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mic, MicOff, Play, Pause, Trash2, Save, RotateCcw, ArrowRight, ArrowLeft } from "lucide-react";
import { useRecording, type Recording } from "@/hooks/use-recording";
import { PhonicsData } from "@/lib/phonics";

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  phonicsData: PhonicsData;
  existingRecording?: Recording;
  onSave: (recording: Recording) => void;
}

type RecordingStage = 'full-name' | 'phonetic' | 'singing';

const stageConfig = {
  'full-name': {
    title: 'Say Your Child\'s Name',
    description: 'Say your child\'s name naturally, the way you normally pronounce it',
    instructions: [
      '• Say the full name in one go',
      '• Use your normal, everyday pronunciation',
      '• Keep it natural - like calling them for dinner',
      '• 2-3 seconds maximum'
    ],
    buttonColor: 'bg-blue-500 hover:bg-blue-600'
  },
  'phonetic': {
    title: 'Say This Letter Sound',
    description: 'How does this letter sound when YOU say your child\'s name?',
    instructions: [
      '• Say how this letter sounds when YOU say your child\'s name',
      '• Don\'t worry about "correct" phonetics - use YOUR pronunciation',
      '• Keep it short - 1-2 seconds maximum',
      '• Record in a quiet environment'
    ],
    buttonColor: 'bg-purple-500 hover:bg-purple-600'
  },
  'singing': {
    title: 'Sing Your Child\'s Name',
    description: 'Sing or chant your child\'s name in a fun, memorable way',
    instructions: [
      '• Make it musical and fun!',
      '• Use any melody or rhythm you like',
      '• Could be like a lullaby or playful chant',
      '• 3-5 seconds is perfect'
    ],
    buttonColor: 'bg-green-500 hover:bg-green-600'
  }
};

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
  const [currentStage, setCurrentStage] = useState<RecordingStage>('full-name');
  const [stageRecordings, setStageRecordings] = useState<Partial<Record<RecordingStage, Recording>>>({});

  const stages: RecordingStage[] = ['full-name', 'phonetic', 'singing'];
  const currentStageIndex = stages.indexOf(currentStage);
  const config = stageConfig[currentStage];

  useEffect(() => {
    if (existingRecording) {
      // For now, treat existing recordings as phonetic stage
      setStageRecordings({ phonetic: existingRecording });
      setCurrentRecording(existingRecording);
    }
  }, [existingRecording, setCurrentRecording]);

  const handleStartRecording = async () => {
    try {
      setError(null);
      await startRecording(phonicsData.letter, `${phonicsData.position}-${currentStage}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Recording failed');
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    if (currentRecording) {
      setStageRecordings(prev => ({
        ...prev,
        [currentStage]: currentRecording
      }));
    }
  };

  const handleNextStage = () => {
    if (currentStageIndex < stages.length - 1) {
      setCurrentStage(stages[currentStageIndex + 1]);
      setCurrentRecording(null);
    }
  };

  const handlePrevStage = () => {
    if (currentStageIndex > 0) {
      setCurrentStage(stages[currentStageIndex - 1]);
      const prevStageRecording = stageRecordings[stages[currentStageIndex - 1]];
      setCurrentRecording(prevStageRecording || null);
    }
  };

  const handleSave = () => {
    // For now, save the phonetic recording as the main recording
    const phoneticRecording = stageRecordings.phonetic;
    if (phoneticRecording) {
      onSave(phoneticRecording);
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
    setCurrentStage('full-name');
    setStageRecordings({});
    setCurrentRecording(null);
    onClose();
  };

  const handleRetry = () => {
    if (currentRecording) {
      deleteRecording(currentRecording);
    }
    setStageRecordings(prev => {
      const updated = { ...prev };
      delete updated[currentStage];
      return updated;
    });
    setCurrentRecording(null);
    setError(null);
  };

  const canProceed = !!stageRecordings[currentStage];
  const isLastStage = currentStageIndex === stages.length - 1;
  const hasPhoneticRecording = !!stageRecordings.phonetic;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-purple-600">
            {config.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Stage Progress */}
          <div className="flex justify-center space-x-2 mb-4">
            {stages.map((stage, index) => (
              <div
                key={stage}
                className={`w-3 h-3 rounded-full ${
                  index === currentStageIndex 
                    ? 'bg-purple-600' 
                    : stageRecordings[stage] 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Letter Display (only for phonetic stage) */}
          {currentStage === 'phonetic' && (
            <div className="text-center">
              <div className="text-6xl font-bold text-purple-600 mb-2">
                {phonicsData.letter}
              </div>
              <div className="text-lg text-gray-600">
                The <span className="font-semibold">{phonicsData.position}</span> letter
              </div>
            </div>
          )}

          {/* Stage Description */}
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">
              Step {currentStageIndex + 1} of {stages.length}
            </div>
            <div className="text-lg text-gray-700 mb-4">
              {config.description}
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
            <div className="font-semibold text-blue-800 mb-2">Recording Tips:</div>
            <ul className="text-blue-700 space-y-1">
              {config.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>

          {/* Recording Controls */}
          <div className="flex flex-col items-center space-y-4">
            {!currentRecording && !isRecording && (
              <Button
                onClick={handleStartRecording}
                className={`w-24 h-24 rounded-full ${config.buttonColor} text-white shadow-lg transform hover:scale-105 transition-all duration-200`}
                disabled={!!error}
              >
                <Mic className="w-8 h-8" />
              </Button>
            )}

            {isRecording && (
              <div className="text-center">
                <Button
                  onClick={handleStopRecording}
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

                <div className="text-sm text-green-600 font-medium">
                  ✓ Recording complete! Play to review.
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={currentStageIndex > 0 ? handlePrevStage : handleClose}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              {currentStageIndex > 0 ? (
                <>
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </>
              ) : (
                <span>Cancel</span>
              )}
            </Button>
            
            {!isLastStage ? (
              <Button
                onClick={handleNextStage}
                disabled={!canProceed}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={!hasPhoneticRecording}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
