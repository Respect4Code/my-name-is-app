
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Play, Volume2, ArrowLeft, ArrowRight } from "lucide-react";
import { useRecording, type Recording } from "@/hooks/use-recording";
import { useParentRecordings } from "@/hooks/use-parent-recordings";
import { useSpeech } from "@/hooks/use-speech";
import type { Settings } from "@/pages/home";

interface ChildInteractionScreenProps {
  name: string;
  onComplete: () => void;
  onGoBack: () => void;
  settings: Settings;
}

export default function ChildInteractionScreen({ 
  name, 
  onComplete, 
  onGoBack, 
  settings 
}: ChildInteractionScreenProps) {
  const [currentStep, setCurrentStep] = useState<'question' | 'listening' | 'response'>('question');
  const [childResponse, setChildResponse] = useState<Recording | null>(null);
  const [showEncouragement, setShowEncouragement] = useState(false);
  
  const { getNameRecordings } = useParentRecordings();
  const { speak, isPlaying } = useSpeech(settings.speechRate);
  const {
    isRecording,
    currentRecording,
    startRecording,
    stopRecording,
    playRecording,
    isPlaying: isPlayingRecording
  } = useRecording();

  const parentRecordings = getNameRecordings(name);
  const hasParentRecordings = parentRecordings.length > 0;

  const askQuestion = () => {
    if (settings.speechMode) {
      speak("Hello! What is your name?");
    }
    setCurrentStep('question');
  };

  const startListening = async () => {
    setCurrentStep('listening');
    try {
      await startRecording('child-response', 'name-response');
    } catch (error) {
      console.error('Recording failed:', error);
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    if (currentRecording) {
      setChildResponse(currentRecording);
      setCurrentStep('response');
      setShowEncouragement(true);
    }
  };

  const handlePlayResponse = () => {
    if (childResponse) {
      playRecording(childResponse);
    }
  };

  const handleTryAgain = () => {
    setChildResponse(null);
    setShowEncouragement(false);
    setCurrentStep('question');
  };

  const handleContinue = () => {
    onComplete();
  };

  useEffect(() => {
    // Auto-ask question when component mounts
    const timer = setTimeout(() => {
      askQuestion();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const encouragementMessages = [
    "Great job saying your name!",
    "Perfect! You said your name beautifully!",
    "Wonderful! I love how you said your name!",
    "Excellent! You're doing so well!",
    "Amazing! Your name sounds wonderful!"
  ];

  const randomEncouragement = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onGoBack}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          
          <h1 className="text-2xl font-bold text-white text-center">
            Let's Practice!
          </h1>
          
          <div className="w-20"></div> {/* Spacer */}
        </div>

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center">
          {/* Question Step */}
          {currentStep === 'question' && (
            <div className="space-y-8">
              <div className="text-4xl mb-4">👋</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Hello!
              </h2>
              <p className="text-xl text-white/90 mb-8">
                What is your name?
              </p>
              
              <div className="space-y-4">
                <Button
                  onClick={askQuestion}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium flex items-center space-x-2 mx-auto"
                >
                  <Volume2 className="w-6 h-6" />
                  <span>Ask Question Again</span>
                </Button>
                
                <Button
                  onClick={startListening}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-medium flex items-center space-x-2 mx-auto"
                >
                  <Mic className="w-6 h-6" />
                  <span>I'm Ready to Answer!</span>
                </Button>
              </div>
            </div>
          )}

          {/* Listening Step */}
          {currentStep === 'listening' && (
            <div className="space-y-8">
              <div className="text-4xl mb-4">👂</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                I'm Listening...
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Say your name now!
              </p>
              
              <Button
                onClick={handleStopRecording}
                className="w-32 h-32 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-2xl animate-pulse mx-auto flex items-center justify-center"
              >
                <MicOff className="w-12 h-12" />
              </Button>
              
              <p className="text-white/80 text-lg">
                Click the button when you're done speaking
              </p>
            </div>
          )}

          {/* Response Step */}
          {currentStep === 'response' && (
            <div className="space-y-8">
              {showEncouragement && (
                <div className="text-4xl mb-4">🎉</div>
              )}
              
              <h2 className="text-3xl font-bold text-white mb-4">
                {showEncouragement ? randomEncouragement : "Let's Listen!"}
              </h2>
              
              {childResponse && (
                <div className="space-y-4">
                  <p className="text-xl text-white/90 mb-6">
                    Here's how you said your name:
                  </p>
                  
                  <Button
                    onClick={handlePlayResponse}
                    disabled={isPlayingRecording}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-xl text-lg font-medium flex items-center space-x-2 mx-auto"
                  >
                    <Play className="w-6 h-6" />
                    <span>{isPlayingRecording ? 'Playing...' : 'Play My Voice'}</span>
                  </Button>
                </div>
              )}
              
              <div className="flex space-x-4 justify-center pt-4">
                <Button
                  onClick={handleTryAgain}
                  variant="outline"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/30 px-6 py-3 rounded-xl font-medium"
                >
                  Try Again
                </Button>
                
                <Button
                  onClick={handleContinue}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-medium flex items-center space-x-2"
                >
                  <span>Continue Learning</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Helper Text */}
        <div className="mt-8 text-center">
          <p className="text-white/70 text-sm">
            This helps us learn how you say your name!
          </p>
        </div>
      </div>
    </div>
  );
}
