import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, Play, Check, ChevronRight, ChevronLeft, RefreshCw, Home, Volume2 } from 'lucide-react';

// Main App Component
export default function MyNameIs() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [childName, setChildName] = useState('');
  const [childPhoto, setChildPhoto] = useState('');
  const [recordings, setRecordings] = useState({});
  const [currentFlashcard, setCurrentFlashcard] = useState(0);

  // Load saved data on mount
  useEffect(() => {
    const savedName = localStorage.getItem('childName');
    const savedPhoto = localStorage.getItem('childPhoto');
    const savedRecordings = localStorage.getItem('recordings');
    
    if (savedName && savedPhoto && savedRecordings) {
      setChildName(savedName);
      setChildPhoto(savedPhoto);
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
      setChildPhoto('');
      setRecordings({});
      setCurrentStep('welcome');
      setCurrentFlashcard(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 text-white">
      {currentStep === 'welcome' && <WelcomeScreen onNext={(name) => { setChildName(name); localStorage.setItem('childName', name); setCurrentStep('photo'); }} />}
      {currentStep === 'photo' && <PhotoScreen name={childName} onNext={(photo) => { setChildPhoto(photo); setCurrentStep('record'); }} />}
      {currentStep === 'record' && <RecordingScreen name={childName} recordings={recordings} setRecordings={setRecordings} onComplete={() => setCurrentStep('menu')} onBack={() => setCurrentStep('menu')} />}
      {currentStep === 'menu' && <MenuScreen name={childName} onPlay={() => setCurrentStep('flashcards')} onRecord={() => setCurrentStep('record')} onReset={resetApp} />}
      {currentStep === 'flashcards' && <FlashcardScreen name={childName} photo={childPhoto} recordings={recordings} current={currentFlashcard} setCurrent={setCurrentFlashcard} onHome={() => setCurrentStep('menu')} />}
    </div>
  );
}

// Welcome Screen - Step 1
function WelcomeScreen({ onNext }: { onNext: (name: string) => void }) {
  const [name, setName] = useState('');
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
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
          Your data never leaves your device • CC BY-NC-SA 4.0
        </p>
      </div>
    </div>
  );
}

// Photo Screen - Step 2
function PhotoScreen({ name, onNext }: { name: string; onNext: (photo: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPhotoPreview(base64);
      localStorage.setItem('childPhoto', base64);
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Add {name}'s Photo</h2>
        <p className="text-gray-600 mb-6">This helps {name} recognize themselves</p>
        
        {!photoPreview ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-48 h-48 mx-auto bg-purple-100 rounded-2xl flex flex-col items-center justify-center hover:bg-purple-200 transition-colors mb-6"
          >
            <Camera size={48} className="text-purple-500 mb-2" />
            <span className="text-purple-600 font-medium">Add Photo</span>
          </button>
        ) : (
          <div className="relative w-48 h-48 mx-auto mb-6">
            <img
              src={photoPreview}
              alt={name}
              className="w-full h-full object-cover rounded-2xl"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
            >
              <RefreshCw size={16} className="text-gray-600" />
            </button>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
          <p className="text-sm text-blue-800">
            🔒 <strong>Privacy Promise:</strong> This photo stays on your device only. 
            It's never uploaded anywhere.
          </p>
        </div>
        
        <button
          onClick={() => photoPreview && onNext(photoPreview)}
          disabled={!photoPreview}
          className={`w-full py-4 rounded-xl font-bold text-xl transition-all flex items-center justify-center gap-2 ${
            photoPreview
              ? 'bg-purple-500 text-white hover:bg-purple-600'
              : 'bg-gray-300 text-gray-500'
          }`}
        >
          Next <ChevronRight />
        </button>
      </div>
    </div>
  );
}

// Recording Screen - Step 3
function RecordingScreen({ name, recordings, setRecordings, onComplete, onBack }: { 
  name: string; 
  recordings: Record<string, string>; 
  setRecordings: React.Dispatch<React.SetStateAction<Record<string, string>>>; 
  onComplete: () => void; 
  onBack: () => void;
}) {
  const [currentStage, setCurrentStage] = useState(0);
  const letters = name.split('');
  
  const stages = [
    { id: 'fullname', label: `Say "${name}"`, key: 'fullname' },
    ...letters.map((letter: string, i: number) => ({
      id: `letter-${i}`,
      label: `Say the SOUND of "${letter}" (not the letter name)`,
      key: `letter-${i}`
    })),
    { id: 'sentence', label: `Say "${name}, time for bed!"`, key: 'sentence' },
    { id: 'rhyme', label: `Put "${name}" in a rhyme or song`, key: 'rhyme' }
  ];
  
  const handleRecordingComplete = (audioBlob: Blob, stageKey: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setRecordings(prev => ({
          ...prev,
          [stageKey]: result
        }));
      }
      
      // Auto-advance to next stage
      if (currentStage < stages.length - 1) {
        setTimeout(() => setCurrentStage(currentStage + 1), 500);
      }
    };
    reader.readAsDataURL(audioBlob);
  };
  
  const isComplete = stages.every(stage => recordings[stage.key]);
  
  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <h2 className="text-3xl font-bold text-gray-800 text-center flex-1">
            Record Your Voice
          </h2>
          <div className="w-10" /> {/* Spacer */}
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm text-gray-600">
              {Object.keys(recordings).length} / {stages.length}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${(Object.keys(recordings).length / stages.length) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          {stages.map((stage, index) => (
            <RecordingStage
              key={stage.id}
              stage={stage}
              isActive={index === currentStage}
              isComplete={!!recordings[stage.key]}
              onRecord={(blob: Blob) => handleRecordingComplete(blob, stage.key)}
              onClick={() => setCurrentStage(index)}
            />
          ))}
        </div>
        
        <button
          onClick={onComplete}
          disabled={!isComplete}
          className={`w-full py-4 rounded-xl font-bold text-xl transition-all ${
            isComplete
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-300 text-gray-500'
          }`}
        >
          {isComplete ? 'Create Flashcards!' : `Record ${stages.length - Object.keys(recordings).length} more`}
        </button>
      </div>
    </div>
  );
}

// Individual Recording Stage
function RecordingStage({ stage, isActive, isComplete, onRecord, onClick }: {
  stage: { id: string; label: string; key: string };
  isActive: boolean;
  isComplete: boolean;
  onRecord: (blob: Blob) => void;
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
      }`}
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

// Menu Screen
function MenuScreen({ name, onPlay, onRecord, onReset }: {
  name: string;
  onPlay: () => void;
  onRecord: () => void;
  onReset: () => void;
}) {
  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">{name}'s Learning</h2>
        
        <div className="space-y-4">
          <button
            onClick={onPlay}
            className="w-full py-6 bg-green-500 text-white rounded-xl font-bold text-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-3"
          >
            <Play size={28} />
            Start Learning
          </button>
          
          <button
            onClick={onRecord}
            className="w-full py-4 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors"
          >
            Re-record Voice
          </button>
          
          <button
            onClick={onReset}
            className="w-full py-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
          >
            Start Over
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-8">
          Built with ❤️ by BoredMamaCode | CC BY-NC-SA 4.0
        </p>
      </div>
    </div>
  );
}

// Flashcard Screen
function FlashcardScreen({ name, photo, recordings, current, setCurrent, onHome }: {
  name: string;
  photo: string;
  recordings: Record<string, string>;
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  onHome: () => void;
}) {
  const letters = name.split('');
  const [playing, setPlaying] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentLetter = letters[current];
  
  const playSound = (recordingKey: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    const audio = recordings[recordingKey];
    if (audio) {
      setPlaying(recordingKey);
      audioRef.current = new Audio(audio);
      audioRef.current.play();
      audioRef.current.onended = () => setPlaying('');
    }
  };
  
  const nextCard = () => {
    setCurrent((current + 1) % letters.length);
  };
  
  const prevCard = () => {
    setCurrent(current === 0 ? letters.length - 1 : current - 1);
  };
  
  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center">
      {/* Header */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <button
          onClick={onHome}
          className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
        >
          <Home size={24} />
        </button>
        <h1 className="text-2xl font-bold">{name}</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>
      
      {/* Flashcard */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center mb-6">
        {/* Child Photo with Large Letter */}
        <div className="relative mb-6 flex flex-col items-center">
          <img
            src={photo}
            alt={name}
            className="w-32 h-32 rounded-full object-cover shadow-lg mb-4"
          />
          <div className="bg-purple-500 text-white text-8xl font-bold rounded-3xl w-40 h-40 flex items-center justify-center shadow-2xl">
            {currentLetter}
          </div>
        </div>
        
        {/* Play Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => playSound(`letter-${current}`)}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
              playing === `letter-${current}`
                ? 'bg-purple-600 text-white animate-pulse'
                : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
          >
            <Volume2 size={24} />
            Play Letter Sound
          </button>
          
          <button
            onClick={() => playSound('fullname')}
            className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              playing === 'fullname'
                ? 'bg-green-600 text-white animate-pulse'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            <Play size={20} />
            Play Full Name
          </button>

          <button
            onClick={() => playSound('sentence')}
            className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              playing === 'sentence'
                ? 'bg-blue-600 text-white animate-pulse'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <Volume2 size={20} />
            Play Bedtime Sentence
          </button>

          {recordings['rhyme'] && (
            <button
              onClick={() => playSound('rhyme')}
              className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                playing === 'rhyme'
                  ? 'bg-pink-600 text-white animate-pulse'
                  : 'bg-pink-500 text-white hover:bg-pink-600'
              }`}
            >
              <Play size={20} />
              Play Rhyme
            </button>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={prevCard}
          className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex gap-2">
          {letters.map((_: string, index: number) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === current ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={nextCard}
          className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      {/* Letter counter */}
      <p className="text-white/80 mt-4">
        Letter {current + 1} of {letters.length}
      </p>
    </div>
  );
}