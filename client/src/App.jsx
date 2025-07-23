
import React, { useState, useEffect, useRef, memo } from 'react';
import { 
  Camera, Mic, Play, Check, ChevronRight, ChevronLeft, 
  RefreshCw, Home, Volume2, Square, ArrowLeft, Info,
  Music, BookOpen, Moon, Loader2
} from 'lucide-react';
import { openDB } from 'idb';

// ====== INDEXEDDB SETUP ======
const DB_NAME = 'ChildLearningApp';
const STORE_NAME = 'recordings';

async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    },
  });
}

// ====== PARENT GUIDE COMPONENT ======
const ParentGuide = memo(({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-labelledby="parent-guide-title">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 id="parent-guide-title" className="text-2xl font-bold mb-4">Quick Parent Guide</h2>
        
        <div className="space-y-4 text-sm">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">⏱️ Total Setup Time: 5 minutes</h3>
            <p>We respect your time. Here's exactly what to do:</p>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-bold">1️⃣ Enter Name (10 seconds)</h4>
              <p className="text-gray-600">Type your child's name (up to 20 letters).</p>
            </div>
            
            <div>
              <h4 className="font-bold">2️⃣ Add Photo (20 seconds)</h4>
              <p className="text-gray-600">Take or choose a photo (under 2MB). It stays on your device - 100% private.</p>
            </div>
            
            <div>
              <h4 className="font-bold">3️⃣ Record Sounds (3-4 minutes)</h4>
              <p className="text-gray-600">Record 4 types of sounds:</p>
              <ul className="ml-4 mt-1 text-gray-600 list-disc">
                <li>Their full name</li>
                <li>Each letter SOUND (not name!)</li>
                <li>Bedtime sentence</li>
                <li>Fun rhyme</li>
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
            <ul className="text-gray-700 space-y-1 list-disc ml-4">
              <li>Red mic = recording</li>
              <li>Tap once to start, tap again to stop</li>
              <li>Green check = saved</li>
              <li>Orange mic = re-recording</li>
              <li>Record letter SOUNDS not names (B = "buh" not "bee")</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-bold mb-1">⚠️ Important:</h3>
            <ul className="text-gray-700 space-y-1 list-disc ml-4">
              <li><strong>Your work is auto-saved!</strong></li>
              <li>Use app buttons (not browser back)</li>
              <li>Works best without toddler present 😅</li>
              <li>If audio doesn't play, check volume/silent mode</li>
              <li>First audio requires a tap (mobile safety)</li>
            </ul>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600"
          aria-label="Close parent guide and start setup"
        >
          Got it! Let's start
        </button>
      </div>
    </div>
  );
});

// ====== MAIN APP COMPONENT ======
export default function App() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [childName, setChildName] = useState('');
  const [childPhoto, setChildPhoto] = useState('');
  const [recordings, setRecordings] = useState({});
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Prevent accidental navigation
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isResetting && (childName || childPhoto || Object.keys(recordings).length > 0)) {
        e.preventDefault();
        e.returnValue = 'You have unsaved work. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [childName, childPhoto, recordings, isResetting]);

  // Load saved data
  useEffect(() => {
    async function loadData() {
      try {
        const savedName = localStorage.getItem('childName');
        const savedPhoto = localStorage.getItem('childPhoto');
        const db = await initDB();
        const savedRecordings = await db.get(STORE_NAME, 'recordings');
        
        if (savedName && savedPhoto && savedRecordings) {
          setChildName(savedName);
          setChildPhoto(savedPhoto);
          setRecordings(savedRecordings);
          setCurrentStep('menu');
        }
      } catch (err) {
        console.error('Failed to load saved data:', err);
        alert('Unable to load saved data. Your browser may be in private mode or storage is full.');
      }
    }
    loadData();
  }, []);

  // Save recordings
  useEffect(() => {
    async function saveRecordings() {
      if (Object.keys(recordings).length > 0) {
        try {
          const db = await initDB();
          await db.put(STORE_NAME, recordings, 'recordings');
        } catch (err) {
          console.error('Failed to save recordings:', err);
          alert('Storage is full or disabled. Please clear some data or try a different browser.');
        }
      }
    }
    saveRecordings();
  }, [recordings]);

  const resetApp = async () => {
    if (window.confirm('Delete everything and start over?')) {
      setIsResetting(true);
      try {
        localStorage.clear();
        const db = await initDB();
        await db.clear(STORE_NAME);
        setChildName('');
        setChildPhoto('');
        setRecordings({});
        setCurrentStep('welcome');
        setCurrentFlashcard(0);
      } catch (err) {
        console.error('Error clearing data:', err);
        alert('Unable to clear data. Please try again.');
      } finally {
        setIsResetting(false);
      }
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
            localStorage.setItem('childPhoto', photo);
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
const WelcomeScreen = memo(({ onNext, onGuide }) => {
  const [name, setName] = useState('');
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && name.length >= 2) {
      onNext(name.toUpperCase());
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative">
        <button
          onClick={onGuide}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full"
          aria-label="Open parent guide"
        >
          <Info size={20} aria-hidden="true" />
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
          maxLength={20}
          autoFocus
          aria-label="Child's name"
        />
        
        {name.length >= 15 && (
          <p className="text-xs text-orange-600 -mt-4 mb-4 text-center">
            {20 - name.length} characters left
          </p>
        )}
        
        <button
          onClick={() => name.length >= 2 && onNext(name.toUpperCase())}
          disabled={name.length < 2}
          className={`w-full py-4 rounded-xl font-bold text-xl transition-all flex items-center justify-center gap-2 ${
            name.length >= 2
              ? 'bg-purple-500 text-white hover:bg-purple-600'
              : 'bg-gray-300 text-gray-500'
          }`}
          aria-label="Proceed to photo upload"
        >
          Next <ChevronRight />
        </button>
        
        <button
          onClick={onGuide}
          className="mt-4 text-purple-600 underline text-sm"
          aria-label="View parent guide"
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
});

// ====== PHOTO SCREEN ======
const PhotoScreen = memo(({ name, onNext, onBack }) => {
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState('');
  
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Photo is too large. Please choose a smaller image (under 2MB).');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          setPhotoPreview(e.target.result);
        } catch (err) {
          console.error('Error saving photo:', err);
          alert('Unable to save photo. Try a smaller image or clear browser data.');
        }
      };
      reader.onerror = () => {
        alert('Error reading photo. Please try again.');
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file.');
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          aria-label="Go back to name entry"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Add {name}'s Photo</h2>
        <p className="text-gray-600 mb-6">Helps {name} recognize themselves while learning</p>
        
        {!photoPreview ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-64 h-64 mx-auto bg-purple-100 rounded-2xl flex flex-col items-center justify-center hover:bg-purple-200 transition-colors mb-6"
            aria-label="Select child's photo"
          >
            <Camera size={64} className="text-purple-500 mb-4" aria-hidden="true" />
            <span className="text-purple-600 font-medium text-lg">Tap to Add Photo</span>
          </button>
        ) : (
          <div className="relative w-64 h-64 mx-auto mb-6">
            <img
              src={photoPreview}
              alt={`${name}'s photo`}
              className="w-full h-full object-cover rounded-2xl"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100"
              aria-label="Change photo"
            >
              <RefreshCw size={20} className="text-gray-600" aria-hidden="true" />
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
          aria-label="Proceed to voice recording"
        >
          Next: Record Your Voice <ChevronRight />
        </button>
      </div>
    </div>
  );
});

// ====== RECORDING SCREEN ======
const RecordingScreen = memo(({ name, recordings, setRecordings, onComplete, onBack }) => {
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
  
  const isComplete = stages.every(stage => recordings[stage.key]);
  
  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          aria-label="Go back to photo selection"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Record Your Voice
        </h2>
        
        {Object.keys(recordings).length > 0 && Object.keys(recordings).length < stages.length && (
          <div className="bg-purple-50 border border-purple-200 p-2 rounded-lg mb-3 text-center">
            <p className="text-xs text-purple-700">
              💜 Even partial recordings help! You can always add more later.
            </p>
          </div>
        )}
        
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4">
          <div className="flex items-center gap-2 text-blue-800">
            <Info size={16} aria-hidden="true" />
            <p className="text-sm font-medium">How to Record:</p>
          </div>
          <ol className="text-sm text-blue-700 mt-1 ml-6 list-decimal">
            <li>Tap any item to select it</li>
            <li>Tap the RED microphone to START recording</li>
            <li>Say the word/sound clearly</li>
            <li>Tap the SQUARE to STOP</li>
            <li>Green check = Saved!</li>
            <li><strong>To re-record: Tap the item again and record</strong></li>
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
          {Object.keys(recordings).length > 0 && (
            <p className="text-xs text-gray-500 mt-1 text-center">
              Storage used: ~{((JSON.stringify(recordings).length / 1024 / 1024) * 2).toFixed(1)}MB
            </p>
          )}
        </div>
        
        <div className="space-y-2 mb-6 max-h-80 overflow-y-auto">
          {stages.map((stage, index) => (
            <RecordingStage
              key={stage.id}
              stage={stage}
              isActive={index === currentStage}
              isComplete={!!recordings[stage.key]}
              onRecord={(audioData) => {
                setRecordings(prev => ({
                  ...prev,
                  [stage.key]: audioData
                }));
                if (index < stages.length - 1) {
                  setTimeout(() => setCurrentStage(index + 1), 1000);
                }
              }}
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
          aria-label={isComplete ? "Create flashcards" : "Complete all recordings to proceed"}
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
});

// ====== RECORDING STAGE COMPONENT ======
const RecordingStage = memo(({ stage, isActive, isComplete, onRecord, onClick }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/mpeg',
        'audio/wav'
      ];
      
      let selectedMimeType = 'audio/webm';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }
      
      console.log('Using audio format:', selectedMimeType);
      const mediaRecorder = new MediaRecorder(stream, { mimeType: selectedMimeType });
      const chunks = [];
      
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: selectedMimeType });
        const reader = new FileReader();
        reader.onload = (e) => {
          console.log('Recording saved for:', stage.key, 'Size:', (e.target.result.length / 1024).toFixed(1) + 'KB');
          onRecord(e.target.result);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Please allow microphone access to record your voice');
      console.error('Microphone access error:', err);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);
  
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
        isActive ? 'border-purple-500 bg-purple-50 shadow-lg scale-[1.02]' : 
        isComplete ? 'border-green-500 bg-green-50' : 
        'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick()}
      aria-label={`Record ${stage.label}`}
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
            aria-label={isRecording ? 'Stop recording' : isComplete ? 'Re-record sound' : 'Start recording'}
          >
            {isRecording ? (
              <Square size={28} aria-hidden="true" />
            ) : (
              <div className="relative">
                <Mic size={28} aria-hidden="true" />
                {isComplete && (
                  <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-0.5">
                    <RefreshCw size={12} className="text-white" aria-hidden="true" />
                  </div>
                )}
              </div>
            )}
          </button>
        )}
        
        {isComplete && !isActive && (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-500 text-white rounded-full">
              <Check size={20} aria-hidden="true" />
            </div>
          </div>
        )}
      </div>
      
      {showSuccess && (
        <div className="bg-green-100 border border-green-300 rounded-lg p-2 mt-2">
          <p className="text-xs text-green-700 font-medium text-center">
            ✅ Recording saved!
          </p>
        </div>
      )}
      
      {isComplete && isActive && (
        <div className="bg-orange-100 border border-orange-300 rounded-lg p-2 mt-2">
          <p className="text-xs text-orange-700 font-medium text-center">
            🎤 Tap the microphone to re-record this sound
          </p>
        </div>
      )}
    </div>
  );
});

// ====== MENU SCREEN ======
const MenuScreen = memo(({ name, onPlay, onRecord, onReset, onBack }) => {
  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          aria-label="Go back to start"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{name}'s Learning</h2>
        <p className="text-gray-600 mb-8">Everything is ready!</p>
        
        <div className="space-y-4">
          <button
            onClick={onPlay}
            className="w-full py-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
            aria-label="Start learning flashcards"
          >
            <Play size={32} aria-hidden="true" />
            Start Learning!
          </button>
          
          <button
            onClick={onRecord}
            className="w-full py-4 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
            aria-label="Re-record voice"
          >
            <Mic size={20} aria-hidden="true" />
            Re-record Voice
          </button>
          
          <button
            onClick={onReset}
            className="w-full py-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
            aria-label="Reset all data"
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
});

// ====== FLASHCARD SCREEN ======
const FlashcardScreen = memo(({ name, photo, recordings, current, setCurrent, onHome }) => {
  const letters = name.split('');
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState('');
  const [audioError, setAudioError] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const playSound = (recordingKey, label = '') => {
    const audio = recordings[recordingKey];
    if (audio) {
      setIsLoading(true);
      setIsPlaying(label);
      setAudioError(false);
      setHasPlayed(true);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      audioRef.current = new Audio(audio);
      
      audioRef.current.onloadeddata = () => {
        setIsLoading(false);
      };
      
      audioRef.current.play().then(() => {
        console.log('Audio playing successfully');
      }).catch(err => {
        console.error('Audio playback failed:', err);
        setAudioError(true);
        setIsPlaying('');
        setIsLoading(false);
        alert('Audio playback failed. Please check your device volume or re-record the sound.');
      });
      
      audioRef.current.onended = () => {
        setIsPlaying('');
      };
    } else {
      alert('No recording found. Please go back and record this sound.');
    }
  };
  
  const next = () => {
    if (current < letters.length - 1) {
      setCurrent(current + 1);
      if (hasPlayed) {
        setTimeout(() => playSound(`letter-${current + 1}`, 'letter'), 300);
      }
    }
  };
  
  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      if (hasPlayed) {
        setTimeout(() => playSound(`letter-${current - 1}`, 'letter'), 300);
      }
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) ||
          (e.key === 'Backspace' && !e.target.matches('input, textarea'))) {
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft') {
        document.querySelector('[data-action="prev"]')?.click();
      } else if (e.key === 'ArrowRight') {
        document.querySelector('[data-action="next"]')?.click();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <div className="min-h-screen p-4 flex flex-col">
      <header className="flex justify-between items-center mb-6 max-w-4xl mx-auto w-full">
        <button
          onClick={onHome}
          className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          aria-label="Return to main menu"
        >
          <Home size={28} className="text-gray-800" aria-hidden="true" />
        </button>
        
        <h2 className="text-2xl font-bold text-white drop-shadow-lg">Learning: {name}</h2>
        
        <div className="w-14" />
      </header>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-5xl w-full">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-8">
            <div className="flex-1 flex items-center justify-center">
              <img
                src={photo}
                alt={`${name}'s photo`}
                className="w-80 h-80 lg:w-96 lg:h-96 rounded-3xl object-cover shadow-lg"
              />
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-12 shadow-xl">
                <span 
                  className="font-black text-purple-600 select-none block animate-pulse"
                  style={{ fontSize: '200px', lineHeight: '1' }}
                  role="heading"
                  aria-level="2"
                  aria-label={`Letter ${letters[current]}`}
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
          
          {!hasPlayed && (
            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 mb-6 max-w-2xl mx-auto">
              <p className="text-gray-800 text-lg font-semibold flex items-center justify-center gap-2">
                <span className="text-2xl">👆</span>
                Tap to hear the letter sound
              </p>
              <button
                onClick={() => playSound(`letter-${current}`, 'letter')}
                className="mt-4 px-6 py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-all animate-pulse"
                aria-label={`Play sound for letter ${letters[current]}`}
              >
                🔊 Play Letter Sound
              </button>
            </div>
          )}
          
          {audioError && (
            <div className="bg-red-100 border-2 border-red-400 rounded-lg p-3 mb-4 max-w-2xl mx-auto">
              <p className="text-red-800 text-sm font-medium text-center">
                ⚠️ Audio playback issue. Please tap the button again or check your volume.
              </p>
            </div>
          )}
          
          {isLoading && (
            <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-3 mb-4 max-w-2xl mx-auto">
              <p className="text-blue-800 text-sm font-medium text-center flex items-center justify-center gap-2">
                <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                Loading audio...
              </p>
            </div>
          )}
          
          {hasPlayed && (
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              <button
                onClick={() => playSound(`letter-${current}`, 'letter')}
                className={`px-6 py-5 rounded-xl font-medium transition-all flex items-center justify-center gap-3 text-lg shadow-lg ${
                  isPlaying === 'letter' 
                    ? 'bg-purple-600 text-white scale-95' 
                    : 'bg-purple-500 text-white hover:bg-purple-600 hover:scale-[1.02]'
                }`}
                aria-label={`Play letter sound for ${letters[current]}`}
              >
                {isPlaying === 'letter' ? (
                  <Loader2 size={24} className="animate-spin" aria-hidden="true" />
                ) : (
                  <BookOpen size={24} aria-hidden="true" />
                )}
                Letter Sound
              </button>
              
              <button
                onClick={() => playSound('fullname', 'name')}
                className={`px-6 py-5 rounded-xl font-medium transition-all flex items-center justify-center gap-3 text-lg shadow-lg ${
                  isPlaying === 'name' 
                    ? 'bg-pink-600 text-white scale-95' 
                    : 'bg-pink-500 text-white hover:bg-pink-600 hover:scale-[1.02]'
                }`}
                aria-label="Play full name"
              >
                {isPlaying === 'name' ? (
                  <Loader2 size={24} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Volume2 size={24} aria-hidden="true" />
                )}
                Full Name
              </button>
              
              <button
                onClick={() => playSound('sentence', 'sentence')}
                className={`px-6 py-5 rounded-xl font-medium transition-all flex items-center justify-center gap-3 text-lg shadow-lg ${
                  isPlaying === 'sentence' 
                    ? 'bg-blue-600 text-white scale-95' 
                    : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-[1.02]'
                }`}
                aria-label="Play bedtime sentence"
              >
                {isPlaying === 'sentence' ? (
                  <Loader2 size={24} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Moon size={24} aria-hidden="true" />
                )}
                Bedtime
              </button>
              
              <button
                onClick={() => playSound('rhyme', 'rhyme')}
                className={`px-6 py-5 rounded-xl font-medium transition-all flex items-center justify-center gap-3 text-lg shadow-lg ${
                  isPlaying === 'rhyme' 
                    ? 'bg-green-600 text-white scale-95' 
                    : 'bg-green-500 text-white hover:bg-green-600 hover:scale-[1.02]'
                }`}
                aria-label="Play fun rhyme"
              >
                {isPlaying === 'rhyme' ? (
                  <Loader2 size={24} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Music size={24} aria-hidden="true" />
                )}
                Fun Rhyme
              </button>
            </div>
          )}
        </div>
      </div>
      
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
          aria-label="Previous letter"
        >
          <ChevronLeft size={24} aria-hidden="true" /> Previous
        </button>
        
        <div className="text-center">
          <button
            onClick={() => {
              setCurrent(0);
              setHasPlayed(false);
            }}
            className="px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
            aria-label="Restart flashcards"
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
          aria-label="Next letter"
        >
          Next <ChevronRight size={24} aria-hidden="true" />
        </button>
      </footer>
    </div>
  );
});

// ====== STYLES ======
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
