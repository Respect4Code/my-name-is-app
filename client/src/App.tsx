import React, { useState, useRef, useEffect } from 'react';
import { Mic, Play, Check, ChevronRight, ChevronLeft, Home, Volume2 } from 'lucide-react';

interface RecordingStage {
  id: string;
  label: string;
}

interface Recordings {
  [key: string]: string;
}

// Main App Component
export default function MyNameIs() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [childName, setChildName] = useState('');
  const [recordings, setRecordings] = useState({});
  const [currentFlashcard, setCurrentFlashcard] = useState(0);

  // Load saved data on mount
  useEffect(() => {
    const savedName = localStorage.getItem('childName');
    const savedRecordings = localStorage.getItem('recordings');
    
    if (savedName && savedRecordings) {
      setChildName(savedName);
      setRecordings(JSON.parse(savedRecordings));
      setCurrentStep('menu');
    }
  }, []);

  // Save recordings whenever they change
  useEffect(() => {
    if (Object.keys(recordings).length > 0) {
      localStorage.setItem('recordings', JSON.stringify(recordings));
    }
  }, [recordings]);

  const resetApp = () => {
    if (confirm('This will delete all data. Are you sure?')) {
      localStorage.clear();
      setChildName('');
      setRecordings({});
      setCurrentStep('welcome');
      setCurrentFlashcard(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 text-white">
      {currentStep === 'welcome' && <WelcomeScreen onNext={(name) => { setChildName(name); localStorage.setItem('childName', name); setCurrentStep('record'); }} />}
      {currentStep === 'record' && <RecordingScreen name={childName} recordings={recordings} setRecordings={setRecordings} onComplete={() => setCurrentStep('menu')} onBack={() => setCurrentStep('menu')} />}
      {currentStep === 'menu' && <MenuScreen name={childName} onPlay={() => setCurrentStep('flashcards')} onRecord={() => setCurrentStep('record')} onReset={resetApp} />}
      {currentStep === 'flashcards' && <FlashcardScreen name={childName} recordings={recordings} current={currentFlashcard} setCurrent={setCurrentFlashcard} onHome={() => setCurrentStep('menu')} />}
    </div>
  );
}

// Welcome Screen - Step 1
function WelcomeScreen({ onNext }: { onNext: (name: string) => void }) {
  const [name, setName] = useState('');
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        {/* BoredMama Logo */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg px-6 py-3 mx-auto w-fit shadow-lg">
            <span className="text-white font-bold text-2xl">BoredMamaApp</span>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-2">My Name Is</h1>
        <p className="text-gray-600 mb-8">Help your child learn their name with your voice</p>
        
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z]/g, ''))}
          placeholder="Enter your child's name"
          className="w-full p-4 text-2xl text-center border-2 border-purple-200 rounded-xl text-gray-800 mb-6"
          maxLength={12}
          autoFocus
        />
        
        <button
          onClick={() => name.length >= 2 && onNext(name.toUpperCase())}
          disabled={name.length < 2}
          className={`w-full py-4 rounded-xl font-bold text-xl transition-all flex items-center justify-center gap-2 ${
            name.length >= 2
              ? 'bg-purple-500 text-white hover:bg-purple-600'
              : 'bg-gray-300 text-gray-500'
          }`}
        >
          Next <ChevronRight />
        </button>
        
        <p className="text-xs text-gray-500 mt-8">
          100% Secure • Works Offline • CC BY-NC-SA 4.0<br/>
          Created with ❤️ by BoredMamaApp<br/>
          <span className="text-green-600 font-medium">✓ Auto-saves your work</span>
        </p>
        
        <footer className="mt-6 text-center text-xs text-gray-400">
          <p>Revolutionising motherhood, one sound at a time</p>
        </footer>
      </div>
    </div>
  );
}

// Recording Screen - Step 2  
function RecordingScreen({ 
  name, 
  recordings, 
  setRecordings, 
  onComplete, 
  onBack 
}: { 
  name: string;
  recordings: Recordings;
  setRecordings: React.Dispatch<React.SetStateAction<Recordings>>;
  onComplete: () => void;
  onBack: () => void;
}) {
  const [currentRecording, setCurrentRecording] = useState(0);
  
  const recordingStages = [
    { id: 'fullname', label: `Say "${name}"` },
    { id: 'question', label: 'Say "What is your name?"' },
    ...name.split('').map((letter, i) => ({
      id: `letter-${i}`,
      label: `Say the SOUND of "${letter}" (not letter name)`
    })),
    { id: 'sentence', label: `Say "${name}, time for bed!"` },
    { id: 'rhyme', label: `Make a rhyme with "${name}"` }
  ];

  const allComplete = recordingStages.every(stage => recordings[stage.id]);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Record Sounds for {name}</h2>
          <div className="bg-white/20 rounded-full p-1">
            <div 
              className="bg-yellow-400 h-2 rounded-full transition-all"
              style={{width: `${(Object.keys(recordings).length / recordingStages.length) * 100}%`}}
            />
          </div>
          <p className="text-white/80 mt-2">{Object.keys(recordings).length} of {recordingStages.length} complete</p>
        </div>

        <div className="space-y-4">
          {recordingStages.map((stage, index) => (
            <RecordingItem
              key={stage.id}
              stage={stage}
              isActive={currentRecording === index}
              isComplete={!!recordings[stage.id]}
              onRecord={(audioBlob) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const result = e.target?.result;
                  if (result) {
                    setRecordings(prev => ({
                      ...prev,
                      [stage.id]: result
                    }));
                  }
                };
                reader.readAsDataURL(audioBlob);
              }}
              onClick={() => setCurrentRecording(index)}
            />
          ))}
        </div>

        {allComplete && (
          <button
            onClick={onComplete}
            className="w-full mt-8 py-4 bg-green-500 text-white rounded-xl font-bold text-xl hover:bg-green-600 transition-all"
          >
            Start Learning! <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );
}

// Recording Item Component
function RecordingItem({ 
  stage, 
  isActive, 
  isComplete, 
  onRecord, 
  onClick 
}: {
  stage: RecordingStage;
  isActive: boolean;
  isComplete: boolean;
  onRecord: (audioBlob: Blob) => void;
  onClick: () => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecord(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Please allow microphone access');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
        isActive ? 'border-purple-500 bg-purple-50' : 
        isComplete ? 'border-green-500 bg-green-50' : 
        'border-gray-200 hover:border-gray-300'
      } bg-white`}
    >
      <div className="flex items-center justify-between">
        <span className={`font-medium ${isActive ? 'text-purple-700' : isComplete ? 'text-green-700' : 'text-gray-700'}`}>
          {stage.label}
        </span>
        
        {isActive && !isComplete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              isRecording ? stopRecording() : startRecording();
            }}
            className={`p-2 rounded-full transition-all ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
          >
            <Mic size={20} />
          </button>
        )}
        
        {isComplete && (
          <Check size={20} className="text-green-600" />
        )}
      </div>
    </div>
  );
}

// Menu Screen - Step 3
function MenuScreen({ 
  name, 
  onPlay, 
  onRecord, 
  onReset 
}: {
  name: string;
  onPlay: () => void;
  onRecord: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Ready to Learn!</h2>
        <p className="text-gray-600 mb-8">{name}'s personalized flashcards are ready</p>
        
        <div className="space-y-4">
          <button
            onClick={onPlay}
            className="w-full py-4 bg-green-500 text-white rounded-xl font-bold text-xl hover:bg-green-600 transition-all flex items-center justify-center gap-2"
          >
            <Play size={24} /> Play Flashcards
          </button>
          
          <button
            onClick={onRecord}
            className="w-full py-4 bg-purple-500 text-white rounded-xl font-bold text-xl hover:bg-purple-600 transition-all flex items-center justify-center gap-2"
          >
            <Mic size={24} /> Re-record Sounds
          </button>
          
          <button
            onClick={onReset}
            className="w-full py-4 bg-gray-500 text-white rounded-xl font-bold text-xl hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
          >
            <Home size={24} /> Start Over
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-8">
          All recordings saved securely on your device
        </p>
      </div>
    </div>
  );
}

// Flashcard Screen - Step 4
function FlashcardScreen({ 
  name, 
  recordings, 
  current, 
  setCurrent, 
  onHome 
}: {
  name: string;
  recordings: Recordings;
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  onHome: () => void;
}) {
  const letters = name.split('');
  const totalCards = letters.length;

  const playRecording = (recordingKey) => {
    if (recordings[recordingKey]) {
      const audio = new Audio(recordings[recordingKey]);
      audio.play();
    }
  };

  const nextCard = () => {
    if (current < totalCards - 1) {
      setCurrent(current + 1);
    }
  };

  const prevCard = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const currentLetter = letters[current];
  const recordingKey = `letter-${current}`;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onHome}
            className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-all"
          >
            <Home size={24} />
          </button>
          <h2 className="text-xl font-bold text-white">Learning {name}</h2>
          <div className="text-white text-sm">
            {current + 1} / {totalCards}
          </div>
        </div>

        {/* Flashcard */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-2xl">
          <div className="text-8xl font-bold text-purple-600 mb-4">
            {currentLetter}
          </div>
          
          <button
            onClick={() => playRecording(recordingKey)}
            className="bg-purple-500 text-white px-6 py-3 rounded-full hover:bg-purple-600 transition-all flex items-center gap-2 mx-auto"
          >
            <Volume2 size={20} /> Play Sound
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevCard}
            disabled={current === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all"
          >
            <ChevronLeft size={20} /> Previous
          </button>
          
          <button
            onClick={nextCard}
            disabled={current === totalCards - 1}
            className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => playRecording('fullname')}
            className="px-4 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all text-sm"
          >
            Full Name
          </button>
          <button
            onClick={() => playRecording('question')}
            className="px-4 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all text-sm"
          >
            "What is your name?"
          </button>
        </div>
      </div>
    </div>
  );
}