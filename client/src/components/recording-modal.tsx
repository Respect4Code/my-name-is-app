import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mic, MicOff, Play, Pause, RotateCcw, Check, X, Volume2 } from "lucide-react";
import { useRecording, type Recording } from "@/hooks/use-recording";
import { useParentRecordings } from "@/hooks/use-parent-recordings";
import { useSpeech } from "@/hooks/use-speech";
import type { PhonicsData } from "@/lib/phonics";
import type { Settings } from "@/pages/home";

type RecordingStage = 'full-name' | 'phonetic' | 'singing' | 'sentence';

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  phonics: PhonicsData;
  name: string;
  settings?: Settings;
}

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
  },
  'sentence': {
    title: 'Say Your Child\'s Name in a Sentence',
    description: 'Use your child\'s name naturally in an everyday sentence',
    instructions: [
      '• Say something like "Come here [name]" or "[name], time for lunch"',
      '• Use your natural tone and rhythm',
      '• This captures how your child actually hears their name',
      '• 3-5 seconds is perfect'
    ],
    buttonColor: 'bg-orange-500 hover:bg-orange-600'
  }
};

export default function RecordingModal({ 
  isOpen, 
  onClose, 
  phonics, 
  name, 
  settings = { speechRate: 0.8, speechMode: true, visualMode: false, animations: true, highContrast: false, deafMode: false }
}: RecordingModalProps) {
  const [currentStage, setCurrentStage] = useState<RecordingStage>('full-name');
  const [stageRecordings, setStageRecordings] = useState<Partial<Record<RecordingStage, Recording>>>({});
  const [completedStages, setCompletedStages] = useState<Set<RecordingStage>>(new Set());

  const { speak } = useSpeech(settings.speechRate);
  const {
    isRecording,
    currentRecording,
    startRecording,
    stopRecording,
    playRecording,
    isPlaying: isPlayingRecording
  } = useRecording();

  const { saveRecording, getRecording } = useParentRecordings();

  const currentConfig = stageConfig[currentStage];
  const currentStageRecording = stageRecordings[currentStage];
  const allStagesComplete = completedStages.size === 4;

  // Load existing recordings when modal opens
  useEffect(() => {
    if (isOpen) {
      const stages: RecordingStage[] = ['full-name', 'phonetic', 'singing', 'sentence'];
      const recordings: Partial<Record<RecordingStage, Recording>> = {};
      const completed = new Set<RecordingStage>();

      stages.forEach(stage => {
        const key = stage === 'phonetic' 
          ? `${name}-${phonics.letter}-${phonics.position}-${stage}`
          : `${name}-${stage}`;

        const recording = getRecording(key);
        if (recording) {
          recordings[stage] = recording;
          completed.add(stage);
        }
      });

      setStageRecordings(recordings);
      setCompletedStages(completed);
    }
  }, [isOpen, name, phonics.letter, phonics.position]);

  const handleStartRecording = async () => {
    try {
      const recordingKey = currentStage === 'phonetic' 
        ? `${name}-${phonics.letter}-${phonics.position}-${currentStage}`
        : `${name}-${currentStage}`;

      await startRecording(recordingKey, currentStage);
    } catch (error) {
      console.error('Recording failed:', error);
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

  const handlePlayRecording = () => {
    if (currentStageRecording) {
      playRecording(currentStageRecording);
    }
  };

  const handleSaveRecording = () => {
    if (currentStageRecording) {
      const recordingKey = currentStage === 'phonetic' 
        ? `${name}-${phonics.letter}-${phonics.position}-${currentStage}`
        : `${name}-${currentStage}`;

      saveRecording(recordingKey, currentStageRecording);
      setCompletedStages(prev => new Set([...prev, currentStage]));

      // Auto-advance to next stage if not on last stage
      const stages: RecordingStage[] = ['full-name', 'phonetic', 'singing', 'sentence'];
      const currentIndex = stages.indexOf(currentStage);
      if (currentIndex < stages.length - 1) {
        setCurrentStage(stages[currentIndex + 1]);
      }
    }
  };

  const handleSkipStage = () => {
    const stages: RecordingStage[] = ['full-name', 'phonetic', 'singing', 'sentence'];
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1]);
    }
  };

  const handleDiscardRecording = () => {
    setStageRecordings(prev => {
      const updated = { ...prev };
      delete updated[currentStage];
      return updated;
    });
    setCompletedStages(prev => {
      const updated = new Set(prev);
      updated.delete(currentStage);
      return updated;
    });
  };

  const playInstructions = () => {
    if (settings.speechMode) {
      const instructionText = `${currentConfig.title}. ${currentConfig.description}`;
      speak(instructionText);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-600">
            {currentConfig.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stage Progress */}
          <div className="flex space-x-2">
            {(['full-name', 'phonetic', 'singing', 'sentence'] as RecordingStage[]).map((stage, index) => (
              <div
                key={stage}
                className={`flex-1 h-2 rounded-full ${
                  completedStages.has(stage)
                    ? 'bg-green-500'
                    : stage === currentStage
                    ? 'bg-blue-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Context for phonetic stage */}
          {currentStage === 'phonetic' && (
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">
                Letter: {phonics.letter}
              </h3>
              <p className="text-gray-600">
                Position: {phonics.position} in "{name}"
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Standard sound: "{phonics.sound}" - but record YOUR pronunciation!
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">{currentConfig.description}</h3>
              <Button
                variant="ghost"
                onClick={playInstructions}
                className="p-2"
                aria-label="Play instructions"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              {currentConfig.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>

          {/* Recording Controls */}
          <div className="space-y-4">
            {!currentStageRecording ? (
              <div className="text-center space-y-4">
                <Button
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`w-32 h-32 rounded-full ${currentConfig.buttonColor} text-white shadow-lg ${
                    isRecording ? 'animate-pulse' : ''
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="w-12 h-12" />
                  ) : (
                    <Mic className="w-12 h-12" />
                  )}
                </Button>
                <p className="text-sm text-gray-600">
                  {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    onClick={handlePlayRecording}
                    disabled={isPlayingRecording}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>{isPlayingRecording ? 'Playing...' : 'Play'}</span>
                  </Button>

                  <Button
                    onClick={handleDiscardRecording}
                    variant="outline"
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                    <span>Discard</span>
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={handleSaveRecording}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Save & Continue
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Stage Navigation */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex space-x-2">
              {(['full-name', 'phonetic', 'singing', 'sentence'] as RecordingStage[]).map((stage) => (
                <Button
                  key={stage}
                  variant={stage === currentStage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentStage(stage)}
                  className={completedStages.has(stage) ? "bg-green-100" : ""}
                >
                  {completedStages.has(stage) && <Check className="w-3 h-3 mr-1" />}
                  {stage === 'full-name' ? 'Name' : 
                   stage === 'phonetic' ? 'Letter' :
                   stage === 'singing' ? 'Song' : 'Sentence'}
                </Button>
              ))}
            </div>

            <div className="flex space-x-2">
              <Button variant="ghost" onClick={handleSkipStage}>
                Skip Stage
              </Button>
              {allStagesComplete && (
                <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700 text-white">
                  All Done!
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}