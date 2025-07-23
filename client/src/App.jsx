
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
              <p className="text-gray-600 mt-1"><strong>To re-record:</strong> Just tap any item again!</p>
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
              <li>• Orange mic = re-recording</li>
              <li>• Record letter SOUNDS not names (B = "buh" not "bee")</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-bold mb-1">⚠️ Important:</h3>
            <ul className="text-gray-700 space-y-1">
              <li>• <strong>Your work is auto-saved!</strong></li>
              <li>• Use back buttons (not browser back)</li>
              <li>• Works best without toddler present 😅</li>
              <li>• If audio doesn't play, check volume/silent mode</li>
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

  // Protect against accidental navigation
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (childName || childPhoto || Object.keys(recordings).length > 0) {
        e.preventDefault();
        e.returnValue = 'You have unsaved work. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [childName, childPhoto, recordings]);

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

// ====== WELCOME SCREEN (FIXED PARENT GUIDE BUTTON) ======
function WelcomeScreen({ onNext, onGuide }) {
  const [name, setName] = useState('');
  
  // Prevent Enter key from submitting form accidentally
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && name.length >= 2) {
      onNext(name.toUpperCase());
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative">
        {/* Fixed Parent Guide Button */}
        <button
          onClick={onGuide}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full"
        >
          <Info size={20} />
        </button>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-2">My Name Is</h1>
        <p className="text-gray-600 mb-2">Teach your child their name with YOUR voice</p>
        <p className="text-purple-600 text-sm font-medium mb-6">
          ⭐ "My 18-month-old learned all letters phonetically!" - Real parent
        </p>
        
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z]/g, ''))}
          onKeyPress={handleKeyPress}
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
          Created with ❤️ by BoredMamaApp<br/>
          <span className="text-green-600 font-medium">✓ Auto-saves your work</span>
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
      const audioData = e.target.result;
      console.log('Recording saved for:', stageKey, 'Size:', audioData.length);
      setRecordings(prev => ({
        ...prev,
        [stageKey]: audioData
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
        
        {/* Encouragement for partial completion */}
        {Object.keys(recordings).length > 0 && Object.keys(recordings).length < stages.length && (
          <div className="bg-purple-50 border border-purple-200 p-2 rounded-lg mb-3 text-center">
            <p className="text-xs text-purple-700">
              💜 Even partial recordings help! You can always add more later.
            </p>
          </div>
        )}
        
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4">
          <div className="flex items-center gap-2 text-blue-800">
            <Info size={16} />
            <p className="text-sm font-medium">How to Record:</p>
          </div>
          <ol className="text-sm text-blue-700 mt-1 ml-6">
            <li>1. Tap any item to select it</li>
            <li>2. Tap the RED microphone to START recording</li>
            <li>3. Say the word/sound clearly</li>
            <li>4. Tap the SQUARE to STOP</li>
            <li>5. Green check = Saved!</li>
            <li>6. <strong>To re-record: Tap the item again and record</strong></li>
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
        
        {isComplete && (
          <p className="text-xs text-gray-500 text-center mt-2">
            💡 Tip: Test audio playback in flashcards. If no sound, check volume/silent mode.
          </p>
        )}
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
        
        {/* FIXED: Always show record button when active */}
        {isActive && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              isRecording ? stopRecording() : startRecording();
            }}
            className={`p-4 rounded-full transition-all ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse scale-110' 
                : isComplete
                  ? 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105'
                  : 'bg-purple-500 text-white hover:bg-purple-600 hover:scale-105'
            }`}
          >
            {isRecording ? (
              <Square size={28} />
            ) : (
              <div className="relative">
                <Mic size={28} />
                {isComplete && (
                  <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-0.5">
                    <RefreshCw size={12} className="text-white" />
                  </div>
                )}
              </div>
            )}
          </button>
        )}
        
        {/* Only show check when NOT active */}
        {isComplete && !isActive && (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-500 text-white rounded-full">
              <Check size={20} />
            </div>
          </div>
        )}
      </div>
      
      {/* FIXED: Clear re-record hint */}
      {isComplete && isActive && (
        <div className="bg-orange-100 border border-orange-300 rounded-lg p-2 mt-2">
          <p className="text-xs text-orange-700 font-medium text-center">
            🎤 Tap the microphone to re-record this sound
          </p>
        </div>
      )}
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
          Created with ❤️ by BoredMamaApp<br/>
          <span className="text-green-600 font-medium">💡 Tip: Use app buttons, not browser back</span>
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
  const [audioError, setAudioError] = useState(false);
  
  const playSound = (recordingKey, label = '') => {
    const audio = recordings[recordingKey];
    if (audio) {
      console.log('Playing audio for:', recordingKey);
      setIsPlaying(label);
      setAudioError(false);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio(audio);
      
      // Mobile audio fix - require user interaction first
      audioRef.current.play().then(() => {
        console.log('Audio playing successfully');
      }).catch(err => {
        console.error('Audio playback failed:', err);
        setAudioError(true);
        setIsPlaying('');
      });
      
      audioRef.current.onended = () => {
        setIsPlaying('');
        console.log('Audio ended');
      };
    } else {
      console.error('No audio found for:', recordingKey);
      alert('No recording found. Please go back and record this sound.');
    }
  };
  
  const next = React.useCallback(() => {
    if (current < letters.length - 1) {
      setCurrent(current + 1);
      setTimeout(() => playSound(`letter-${current + 1}`), 300);
    }
  }, [current, letters.length, playSound]);
  
  const prev = React.useCallback(() => {
    if (current > 0) {
      setCurrent(current - 1);
      setTimeout(() => playSound(`letter-${current - 1}`), 300);
    }
  }, [current, playSound]);
  
  // Auto-play current letter with mobile fix
  useEffect(() => {
    // Small delay to ensure audio context is ready on mobile
    const timer = setTimeout(() => {
      playSound(`letter-${current}`);
    }, 100);
    return () => clearTimeout(timer);
  }, [current]);
  
  // Prevent keyboard navigation that could leave the page
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Block browser back/forward shortcuts
      if ((e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) ||
          e.key === 'Backspace' && !e.target.matches('input, textarea')) {
        e.preventDefault();
      }
      // Add arrow key navigation for flashcards
      if (e.key === 'ArrowLeft' && current > 0) {
        prev();
      } else if (e.key === 'ArrowRight' && current < letters.length - 1) {
        next();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [current, letters.length]);
  
  return (
    <div className="min-h-screen p-4 flex flex-col">
      <header className="flex justify-between items-center mb-6 max-w-4xl mx-auto w-full">
        <button
          onClick={onHome}
          className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
        >
          <Home size={28} className="text-gray-800" />
        </button>
        
        <h2 className="text-2xl font-bold text-white drop-shadow-lg">Learning: {name}</h2>
        
        <div className="w-14" />
      </header>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-5xl w-full">
          {/* FIXED: True 50/50 side-by-side layout */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-8">
            {/* Photo - 50% width */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={photo}
                alt={name}
                className="w-80 h-80 lg:w-96 lg:h-96 rounded-3xl object-cover shadow-lg"
              />
            </div>
            
            {/* Letter - 50% width */}
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-12 shadow-xl">
                <span 
                  className="font-black text-purple-600 select-none block"
                  style={{ fontSize: '200px', lineHeight: '1' }}
                >
                  {letters[current]}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <p className="text-gray-800 text-xl font-bold">
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
          
          {/* FIXED: High contrast instruction text */}
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 mb-6 max-w-2xl mx-auto">
            <p className="text-gray-800 text-lg font-semibold flex items-center justify-center gap-2">
              <span className="text-2xl">👆</span>
              Tap buttons below to hear sounds
            </p>
          </div>
          
          {/* Audio error message */}
          {audioError && (
            <div className="bg-red-100 border-2 border-red-400 rounded-lg p-3 mb-4 max-w-2xl mx-auto">
              <p className="text-red-800 text-sm font-medium text-center">
                ⚠️ Audio playback issue. Please tap the button again or check your volume.
              </p>
            </div>
          )}
          
          {/* Audio debug info for parents */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-center mb-4 text-xs text-gray-500">
              Audio status: {isPlaying ? `Playing ${isPlaying}` : 'Ready'} | 
              Recordings loaded: {Object.keys(recordings).length}
            </div>
          )}
          
          {/* All 4 playback options */}
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => playSound(`letter-${current}`, 'letter')}
              className={`px-6 py-5 rounded-xl font-medium transition-all flex items-center justify-center gap-3 text-lg shadow-lg ${
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
              className={`px-6 py-5 rounded-xl font-medium transition-all flex items-center justify-center gap-3 text-lg shadow-lg ${
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
              className={`px-6 py-5 rounded-xl font-medium transition-all flex items-center justify-center gap-3 text-lg shadow-lg ${
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
              className={`px-6 py-5 rounded-xl font-medium transition-all flex items-center justify-center gap-3 text-lg shadow-lg ${
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
      
      {/* FIXED: High contrast navigation buttons */}
      <footer className="flex justify-between items-center max-w-4xl mx-auto w-full mt-6">
        <button
          onClick={prev}
          disabled={current === 0}
          data-action="prev"
          className={`px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 text-lg shadow-lg ${
            current > 0 
              ? 'bg-white text-purple-600 hover:bg-gray-100 hover:scale-105' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ChevronLeft size={24} /> Previous
        </button>
        
        <div className="text-center">
          <button
            onClick={() => {
              setCurrent(0);
              playSound('letter-0');
            }}
            className="px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
          >
            Start Over
          </button>
          <p className="text-xs text-white/80 mt-1">Use ← → arrow keys!</p>
        </div>
        
        <button
          onClick={next}
          disabled={current === letters.length - 1}
          data-action="next"
          className={`px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 text-lg shadow-lg ${
            current < letters.length - 1 
              ? 'bg-white text-purple-600 hover:bg-gray-100 hover:scale-105' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next <ChevronRight size={24} />
        </button>
      </footer>
    </div>
  );
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: .8; transform: scale(1.05); }
  }
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`;
document.head.appendChild(style);
