import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Mic, Play, Check, ChevronRight, ChevronLeft, 
  RefreshCw, Home, Volume2, Square, ArrowLeft, Info,
  Music, BookOpen, Moon
} from 'lucide-react';

// ====== PARENT GUIDE COMPONENT ======
function ParentGuide({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Quick Parent Guide</h2>
        
        <div className="space-y-4 text-sm">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">⏱️ Total Setup Time: 5 minutes</h3>
            <p>We respect your time. Here's exactly what to do:</p>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-bold">1️⃣ Enter Name (10 seconds)</h4>
              <p className="text-gray-600">Type your child's name. That's it.</p>
            </div>
            
            <div>
              <h4 className="font-bold">2️⃣ Add Photo (20 seconds)</h4>
              <p className="text-gray-600">Take or choose a photo. It stays on your device - 100% private.</p>
            </div>
            
            <div>
              <h4 className="font-bold">3️⃣ Record Sounds (3-4 minutes)</h4>
              <p className="text-gray-600">Record 4 types of sounds:</p>
              <ul className="ml-4 mt-1 text-gray-600">
                <li>• Their full name</li>
                <li>• Each letter SOUND (not name!)</li>
                <li>• Bedtime sentence</li>
                <li>• Fun rhyme</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold">4️⃣ Done! Give to child</h4>
              <p className="text-gray-600">They tap the big letters and hear YOUR voice.</p>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold mb-1">💡 Recording Tips:</h3>
            <ul className="text-gray-700 space-y-1">
              <li>• Red mic = recording</li>
              <li>• Tap once to start, tap again to stop</li>
              <li>• Green check = saved</li>
              <li>• Record letter SOUNDS not names (B = "buh" not "bee")</li>
            </ul>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-purple-500 text-white rounded-xl font-bold"
        >
          Got it! Let's start
        </button>
      </div>
    </div>
  );
}

// ====== MAIN APP COMPONENT ======
export default function App() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [childName, setChildName] = useState('');
  const [childPhoto, setChildPhoto] = useState('');
  const [recordings, setRecordings] = useState({});
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [showGuide, setShowGuide] = useState(false);

  // Load saved data
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

  // Save recordings
  useEffect(() => {
    if (Object.keys(recordings).length > 0) {
      localStorage.setItem('recordings', JSON.stringify(recordings));
    }
  }, [recordings]);

  const resetApp = () => {
    if (confirm('Delete everything and start over?')) {
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
      {showGuide && <ParentGuide onClose={() => setShowGuide(false)} />}
      
      {currentStep === 'welcome' && (
        <WelcomeScreen 
          onNext={(name) => {
            setChildName(name);
            localStorage.setItem('childName', name);
            setCurrentStep('photo');
          }}
          onGuide={() => setShowGuide(true)}
        />
      )}
      
      {currentStep === 'photo' && (
        <PhotoScreen 
          name={childName} 
          onNext={(photo) => {
            setChildPhoto(photo);
            setCurrentStep('record');
          }}
          onBack={() => setCurrentStep('welcome')}
        />
      )}
      
      {currentStep === 'record' && (
        <RecordingScreen 
          name={childName}
          recordings={recordings}
          setRecordings={setRecordings}
          onComplete={() => setCurrentStep('menu')}
          onBack={() => setCurrentStep('photo')}
        />
      )}
      
      {currentStep === 'menu' && (
        <MenuScreen 
          name={childName}
          onPlay={() => {
            setCurrentFlashcard(0);
            setCurrentStep('flashcards');
          }}
          onRecord={() => setCurrentStep('record')}
          onReset={resetApp}
          onBack={() => setCurrentStep('welcome')}
        />
      )}
      
      {currentStep === 'flashcards' && (
        <FlashcardScreen 
          name={childName}
          photo={childPhoto}
          recordings={recordings}
          current={currentFlashcard}
          setCurrent={setCurrentFlashcard}
          onHome={() => setCurrentStep('menu')}
        />
      )}
    </div>
  );
}

// ====== WELCOME SCREEN ======
function WelcomeScreen({ onNext, onGuide }) {
  const [name, setName] = useState('');
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative">
        {/* PARENT GUIDE BUTTON - TOP RIGHT */}
        <button
          onClick={onGuide}
          className="absolute top-2 right-2 p-4 text-white bg-purple-600 hover:bg-purple-700 rounded-full shadow-xl z-50 border-4 border-white"
          title="Parent Guide - 5 minute setup"
          style={{ fontSize: '24px', minWidth: '60px', minHeight: '60px' }}
        >
          <Info size={28} className="text-white" />
        </button>
        
        {/* BACKUP GUIDE BUTTON - VERY OBVIOUS */}
        <div className="mb-4">
          <button
            onClick={onGuide}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-bold shadow-lg hover:bg-orange-600 text-lg"
          >
            📖 PARENT GUIDE (5 min setup)
          </button>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-2">My Name Is</h1>
        <p className="text-gray-600 mb-8">Teach your child their name with YOUR voice</p>
        
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
        
        <button
          onClick={onGuide}
          className="mt-4 text-purple-600 underline text-sm"
        >
          Need help? Read 5-minute guide
        </button>
        
        <p className="text-xs text-gray-500 mt-8">
          100% Private • Works Offline • CC BY-NC-SA 4.0<br/>
          Created with ❤️ by BoredMamaApp
        </p>
      </div>
    </div>
  );
}

// ====== PHOTO SCREEN ======
function PhotoScreen({ name, onNext, onBack }) {
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState('');
  
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
        localStorage.setItem('childPhoto', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 text-gray-600 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={20} />
        </button>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Add {name}'s Photo</h2>
        <p className="text-gray-600 mb-6">Helps {name} recognize themselves while learning</p>
        
        {!photoPreview ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-64 h-64 mx-auto bg-purple-100 rounded-2xl flex flex-col items-center justify-center hover:bg-purple-200 transition-colors mb-6"
          >
            <Camera size={64} className="text-purple-500 mb-4" />
            <span className="text-purple-600 font-medium text-lg">Tap to Add Photo</span>
          </button>
        ) : (
          <div className="relative w-64 h-64 mx-auto mb-6">
            <img
              src={photoPreview}
              alt={name}
              className="w-full h-full object-cover rounded-2xl"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100"
            >
              <RefreshCw size={20} className="text-gray-600" />
            </button>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoSelect}
          className="hidden"
        />
        
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6 text-left">
          <p className="text-sm text-green-800">
            🔒 <strong>100% Private:</strong> This photo stays on YOUR device only. 
            Never uploaded. No internet needed. Works offline forever.
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
          Next: Record Your Voice <ChevronRight />
        </button>
      </div>
    </div>
  );
}

// ====== RECORDING SCREEN ======
function RecordingScreen({ name, recordings, setRecordings, onComplete, onBack }) {
  const [currentStage, setCurrentStage] = useState(0);
  const letters = name.split('');
  
  const stages = [
    { 
      id: 'fullname', 
      label: `Full Name: "${name}"`, 
      key: 'fullname',
      instruction: `Say their name clearly: "${name}"`,
      icon: <Volume2 size={20} />
    },
    ...letters.map((letter, i) => ({
      id: `letter-${i}`,
      label: `Letter ${i + 1}: "${letter}"`,
      key: `letter-${i}`,
      instruction: `Say the SOUND of "${letter}" (not the letter name)\nExample: B = "buh" not "bee"`,
      icon: <BookOpen size={20} />
    })),
    { 
      id: 'sentence', 
      label: 'Bedtime Sentence', 
      key: 'sentence',
      instruction: `Say: "${name}, it's time for bed!"`,
      icon: <Moon size={20} />
    },
    { 
      id: 'rhyme', 
      label: `Fun Rhyme`, 
      key: 'rhyme',
      instruction: `Make a fun rhyme with "${name}"\nExample: "${name} is sweet, from head to feet!"`,
      icon: <Music size={20} />
    }
  ];
  
  const handleRecordingComplete = (audioBlob, stageKey) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setRecordings(prev => ({
        ...prev,
        [stageKey]: e.target.result
      }));
      
      // Auto-advance after short delay
      if (currentStage < stages.length - 1) {
        setTimeout(() => setCurrentStage(currentStage + 1), 1000);
      }
    };
    reader.readAsDataURL(audioBlob);
  };
  
  const isComplete = stages.every(stage => recordings[stage.key]);
  
  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 text-gray-600 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={20} />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Record Your Voice
        </h2>
        
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4">
          <div className="flex items-center gap-2 text-blue-800">
            <Info size={16} />
            <p className="text-sm font-medium">How to Record:</p>
          </div>
          <ol className="text-sm text-blue-700 mt-1 ml-6">
            <li>1. Tap the RED microphone to START</li>
            <li>2. Say the word/sound clearly</li>
            <li>3. Tap the SQUARE to STOP</li>
            <li>4. Green check = Saved!</li>
          </ol>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 font-medium">Your Progress</span>
            <span className="text-sm text-gray-600 font-medium">
              {Object.keys(recordings).length} of {stages.length} done
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${(Object.keys(recordings).length / stages.length) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="space-y-2 mb-6 max-h-80 overflow-y-auto">
          {stages.map((stage, index) => (
            <RecordingStage
              key={stage.id}
              stage={stage}
              isActive={index === currentStage}
              isComplete={!!recordings[stage.key]}
              onRecord={(blob) => handleRecordingComplete(blob, stage.key)}
              onClick={() => setCurrentStage(index)}
            />
          ))}
        </div>
        
        <button
          onClick={onComplete}
          disabled={!isComplete}
          className={`w-full py-4 rounded-xl font-bold text-xl transition-all ${
            isComplete
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
              : 'bg-gray-300 text-gray-500'
          }`}
        >
          {isComplete ? '🎉 All Done! Create Flashcards' : `📝 ${stages.length - Object.keys(recordings).length} recordings left`}
        </button>
      </div>
    </div>
  );
}

// ====== RECORDING STAGE COMPONENT ======
function RecordingStage({ stage, isActive, isComplete, onRecord, onClick }) {
  const [isRecording, setIsRecording] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  
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
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Please allow microphone access to record your voice');
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
      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
        isActive ? 'border-purple-500 bg-purple-50 shadow-lg scale-[1.02]' : 
        isComplete ? 'border-green-500 bg-green-50' : 
        'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className={`${isComplete ? 'text-green-600' : isActive ? 'text-purple-600' : 'text-gray-400'}`}>
            {stage.icon}
          </div>
          <div className="flex-1">
            <span className={`font-medium ${isActive ? 'text-purple-700' : isComplete ? 'text-green-700' : 'text-gray-700'}`}>
              {stage.label}
            </span>
            {isActive && (
              <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">
                {stage.instruction}
              </p>
            )}
          </div>
        </div>
        
        {isActive && !isComplete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              isRecording ? stopRecording() : startRecording();
            }}
            className={`p-4 rounded-full transition-all ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse scale-110' 
                : 'bg-purple-500 text-white hover:bg-purple-600 hover:scale-105'
            }`}
          >
            {isRecording ? <Square size={28} /> : <Mic size={28} />}
          </button>
        )}
        
        {isComplete && (
          <div className="flex items-center gap-2">
            {showSuccess && <span className="text-sm font-medium text-green-600">Saved!</span>}
            <div className="p-2 bg-green-500 text-white rounded-full">
              <Check size={20} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ====== MENU SCREEN ======
function MenuScreen({ name, onPlay, onRecord, onReset, onBack }) {
  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 text-gray-600 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={20} />
        </button>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{name}'s Learning</h2>
        <p className="text-gray-600 mb-8">Everything is ready!</p>
        
        <div className="space-y-4">
          <button
            onClick={onPlay}
            className="w-full py-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            <Play size={32} />
            Start Learning!
          </button>
          
          <button
            onClick={onRecord}
            className="w-full py-4 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
          >
            <Mic size={20} />
            Re-record Voice
          </button>
          
          <button
            onClick={onReset}
            className="w-full py-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
          >
            Start Over (Delete Everything)
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-8">
          Created with ❤️ by BoredMamaApp
        </p>
      </div>
    </div>
  );
}

// ====== FLASHCARD SCREEN ======
function FlashcardScreen({ name, photo, recordings, current, setCurrent, onHome }) {
  const letters = name.split('');
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState('');
  
  const playSound = (recordingKey, label = '') => {
    const audio = recordings[recordingKey];
    if (audio) {
      setIsPlaying(label);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audio);
      audioRef.current.play();
      audioRef.current.onended = () => setIsPlaying('');
    }
  };
  
  const next = () => {
    if (current < letters.length - 1) {
      setCurrent(current + 1);
      setTimeout(() => playSound(`letter-${current + 1}`), 300);
    }
  };
  
  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setTimeout(() => playSound(`letter-${current - 1}`), 300);
    }
  };
  
  // Auto-play current letter
  useEffect(() => {
    playSound(`letter-${current}`);
  }, [current]);
  
  return (
    <div className="min-h-screen p-4 flex flex-col">
      <header className="flex justify-between items-center mb-6 max-w-4xl mx-auto w-full">
        <button
          onClick={onHome}
          className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
        >
          <Home size={28} />
        </button>
        
        <h2 className="text-2xl font-bold">Learning: {name}</h2>
        
        <div className="w-14" />
      </header>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-4xl w-full">
          {/* Photo with HUGE letter overlay */}
          <div className="relative mb-8 mx-auto" style={{ width: '320px', height: '320px' }}>
            <img
              src={photo}
              alt={name}
              className="w-full h-full rounded-3xl object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/95 rounded-[40px] shadow-2xl px-16 py-12">
                <span 
                  className="font-black text-purple-600 leading-none select-none"
                  style={{ fontSize: '200px' }}
                >
                  {letters[current]}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <p className="text-gray-600 text-xl font-medium">
              Letter {current + 1} of {letters.length}
            </p>
            <div className="flex justify-center gap-2 mt-3">
              {letters.map((_, i) => (
                <div
                  key={i}
                  className={`h-3 rounded-full transition-all ${
                    i === current ? 'bg-purple-500 w-16' : 'bg-gray-300 w-3'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="text-center text-gray-500 text-base mb-6">
            👆 Tap buttons below to hear sounds
          </div>
          
          {/* All 4 playback options */}
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => playSound(`letter-${current}`, 'letter')}
              className={`px-6 py-5 rounded-xl font-medium transition-all flex items-center justify-center gap-3 text-lg ${
                isPlaying === 'letter' 
                  ? 'bg-purple-600 text-white scale-95' 
                  : 'bg-purple-500 text-white hover:bg-purple-600 hover:scale-[1.02]'
              }`}
            >
              <BookOpen size={24} />
              Letter Sound
            </button>
            
            <button
              onClick={() => playSound('fullname', 'name')}
              className={`px-6 py-5 rounded-xl font-medium transition-all flex items-center justify-center gap-3 text-lg ${
                isPlaying === 'name' 
                  ? 'bg-pink-600 text-white scale-95' 
                  : 'bg-pink-500 text-white hover:bg-pink-600 hover:scale-[1.02]'
              }`}
            >
              <Volume2 size={24} />
              Full Name
            </button>
            
            <button
              onClick={() => playSound('sentence', 'sentence')}
              className={`px-6 py-5 rounded-xl font-medium transition-all flex items-center justify-center gap-3 text-lg ${
                isPlaying === 'sentence' 
                  ? 'bg-blue-600 text-white scale-95' 
                  : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-[1.02]'
              }`}
            >
              <Moon size={24} />
              Bedtime
            </button>
            
            <button
              onClick={() => playSound('rhyme', 'rhyme')}
              className={`px-6 py-5 rounded-xl font-medium transition-all flex items-center justify-center gap-3 text-lg ${
                isPlaying === 'rhyme' 
                  ? 'bg-green-600 text-white scale-95' 
                  : 'bg-green-500 text-white hover:bg-green-600 hover:scale-[1.02]'
              }`}
            >
              <Music size={24} />
              Fun Rhyme
            </button>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <footer className="flex justify-between items-center max-w-4xl mx-auto w-full mt-6">
        <button
          onClick={prev}
          disabled={current === 0}
          className={`px-8 py-4 rounded-xl font-medium transition-all flex items-center gap-2 text-lg ${
            current > 0 
              ? 'bg-white/20 text-white hover:bg-white/30 hover:scale-105' 
              : 'bg-white/10 text-white/50 cursor-not-allowed'
          }`}
        >
          <ChevronLeft size={24} /> Previous
        </button>
        
        <button
          onClick={() => {
            setCurrent(0);
            playSound('letter-0');
          }}
          className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all hover:scale-105"
        >
          Start Over
        </button>
        
        <button
          onClick={next}
          disabled={current === letters.length - 1}
          className={`px-8 py-4 rounded-xl font-medium transition-all flex items-center gap-2 text-lg ${
            current < letters.length - 1 
              ? 'bg-white/20 text-white hover:bg-white/30 hover:scale-105' 
              : 'bg-white/10 text-white/50 cursor-not-allowed'
          }`}
        >
          Next <ChevronRight size={24} />
        </button>
      </footer>
    </div>
  );
}
