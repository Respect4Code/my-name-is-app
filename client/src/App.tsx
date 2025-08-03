import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Play, Check, ChevronRight, ChevronLeft, 
  RefreshCw, Home, Volume2, Square, ArrowLeft, Info,
  Music, BookOpen, Footprints, X, CheckCircle
} from 'lucide-react';

// ====== DATABASE HELPER ======
const dbPromise = typeof window !== 'undefined' && 'indexedDB' in window
  ? import('idb').then(({ openDB }) => 
      openDB('MyNameIsDB', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('recordings')) {
            db.createObjectStore('recordings');
          }
        },
      })
    )
  : null;

async function saveToIndexedDB(key: string, value: string) {
  if (!dbPromise) {
    localStorage.setItem(key, value);
    return;
  }
  try {
    const db = await dbPromise;
    await db.put('recordings', value, key);
  } catch (err) {
    console.error('IndexedDB save failed, falling back to localStorage:', err);
    localStorage.setItem(key, value);
  }
}

async function loadFromIndexedDB(key: string) {
  if (!dbPromise) {
    return localStorage.getItem(key);
  }
  try {
    const db = await dbPromise;
    const value = await db.get('recordings', key);
    return value || localStorage.getItem(key);
  } catch (err) {
    console.error('IndexedDB load failed, falling back to localStorage:', err);
    return localStorage.getItem(key);
  }
}

// ====== PARENT GUIDE COMPONENT ======
function ParentGuide({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-labelledby="parent-guide-title">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 id="parent-guide-title" className="text-2xl font-bold mb-4">👨‍👩‍👧 Quick Parent Guide</h2>
        <div className="space-y-4 text-sm">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-bold mb-2">💡 Why I Made This App</h3>
            <p className="text-gray-600 mb-3">
              As parents, we wanted our toddler to learn their own name with our voices sounding it out, not generic videos or cartoons. Inspired by phonics and early speech science, I created MyNameIsApp so parents can record their voices, helping toddlers connect the sounds in a fun, personal way. There's nothing more personal than parents' voices—after all, they have been hearing them since they were in the womb.
            </p>
            <p className="text-sm text-gray-500">⏱️ Total Setup Time: 4 Minutes</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">2️⃣ Record Sounds (~3–4 minutes)</h3>
            <div className="space-y-1 text-sm">
              <div>• Their full name</div>
              <div>• "What is your name?" ✨ (New!)</div>
              <div>• Each phoneme (letter sound) — A = "ahh", B = "buh" (not "ay" or "bee")</div>
              <div>• A sentence with their name</div>
              <div>• A rhyme with their name</div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              📢 To re-record: Tap the blue refresh icon beside any item<br/>
              👂 Preview: Listen before saving to ensure it's perfect
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">🎙️ Recording Tips</h3>
            <ul className="text-gray-700 space-y-1 text-xs">
              <li>• 🔴 Red mic = Start/stop recording</li>
              <li>• ▶️ Play button = Preview your voice</li>
              <li>• ✅ Green check = Save</li>
              <li>• 🔄 Blue refresh = Re-record</li>
              <li>• Record phoneme sounds, not alphabet names (e.g. B = "buh", not "bee")</li>
              <li>• 🧠 Check the on-screen tooltips for help!</li>
            </ul>
          </div>
          
          <div className="bg-orange-50 p-3 rounded-lg">
            <h3 className="font-bold mb-1 text-sm">⚠️ Important Notes</h3>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• ✅ All recordings are auto-saved</li>
              <li>• ❌ Avoid using your browser's back button (use in-app navigation)</li>
              <li>• 📵 If sound doesn't play: check volume, silent mode, and permissions</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg">
            <h3 className="font-bold mb-1 text-sm">🎯 Pro Tip</h3>
            <p className="text-xs text-gray-700">
              Set up solo while your toddler naps — quick and quiet. Or make it playtime! Recording together can be magical — you might catch them giggling, joining in with their own sounds like "buh" or "mmmm," or hearing their voice played back for the first time.
            </p>
            <p className="text-xs text-gray-700 mt-1">
              Whether you go solo or team up, keep it light and playful — that's how they learn best. 😄
            </p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors"
        >
          Got it! Let's start
        </button>
      </div>
    </div>
  );
}

// ====== WELCOME SCREEN ======
function WelcomeScreen({ onNext, onGuide }: { onNext: (name: string) => void; onGuide: () => void }) {
  const [name, setName] = useState('');
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && name.length >= 1) {
      e.preventDefault();
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
          <Info size={20} />
        </button>
        
        {/* BoredMama Logo */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex flex-col items-center justify-center shadow-lg">
            <div className="text-4xl font-bold text-white">B</div>
            <div className="text-red-500 text-2xl">👄</div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-2">My Name Is</h1>
        <p className="text-gray-600 mb-2">Teach your child their name with YOUR voice</p>
        <p className="text-purple-600 text-sm font-medium mb-6">
          ⭐ Use YOUR voice for personal phonics—read our story!
        </p>
        
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z]/g, ''))}
          onKeyDown={handleKeyDown}
          placeholder="Enter your child's name"
          className="w-full p-4 text-2xl text-center border-2 border-purple-200 rounded-xl text-gray-800 mb-6"
          maxLength={20}
          autoFocus
        />
        
        {name.length === 1 && (
          <p className="text-xs text-blue-600 -mt-4 mb-4 text-center">
            💡 Tip: Single letter names work too!
          </p>
        )}
        
        {name.length >= 15 && (
          <p className="text-xs text-orange-600 -mt-4 mb-4 text-center">
            {20 - name.length} characters left
          </p>
        )}
        
        <button
          onClick={() => name.length >= 1 && onNext(name.toUpperCase())}
          disabled={name.length < 1}
          className={`w-full py-4 rounded-xl font-bold text-xl transition-all flex items-center justify-center gap-2 ${
            name.length >= 1
              ? 'bg-purple-500 text-white hover:bg-purple-600'
              : 'bg-gray-300 text-gray-500'
          }`}
        >
          Start Recording <ChevronRight />
        </button>
        
        <button
          onClick={onGuide}
          className="mt-4 text-purple-600 underline text-sm"
        >
          Need help? Read 5-minute guide
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

// ====== RECORDING COMPONENT ======
function RecordingItem({ 
  stage, 
  isActive, 
  isComplete, 
  onRecord 
}: { 
  stage: any; 
  isActive: boolean; 
  isComplete: boolean; 
  onRecord: (audioBlob: Blob) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/mpeg'
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
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: selectedMimeType });
        onRecord(blob);
        stream.getTracks().forEach(track => track.stop());
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Please allow microphone access to record your voice');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const onClick = () => {
    if (isActive && !isRecording) {
      // Allow clicking to focus/select this item
    }
  };
  
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, [isRecording]);
  
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
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
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
        
        {isComplete && !isActive && (
          <div className="flex items-center gap-2">
            {showSuccess && <span className="text-sm font-medium text-green-600">Saved!</span>}
            <div className="p-2 bg-green-500 text-white rounded-full">
              <Check size={20} />
            </div>
          </div>
        )}
      </div>
      
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

// ====== RECORDING SCREEN ======
function RecordingScreen({ 
  name, 
  recordings, 
  saveRecording, 
  onComplete, 
  onBack 
}: { 
  name: string; 
  recordings: Record<string, string>; 
  saveRecording: (key: string, value: string) => Promise<void>;
  onComplete: () => void;
  onBack: () => void;
}) {
  const [currentStage, setCurrentStage] = useState(0);
  const letters = name.split('');
  
  // Your exact 5-stage recording flow
  const stages = [
    { 
      id: 'fullname', 
      label: `1️⃣ Full Name: "${name}"`, 
      key: 'fullname',
      instruction: `Record their full name clearly: "${name}"`,
      icon: <Volume2 size={20} />
    },
    { 
      id: 'question', 
      label: `2️⃣ "What is your name?" ✨`, 
      key: 'question',
      instruction: `Record "What is your name?" - This is your KEY feature inspired by the train moment!`,
      icon: <BookOpen size={20} />
    },
    ...letters.map((letter: string, i: number) => ({
      id: `letter-${i}`,
      label: `3️⃣ Letter Sound: "${letter}"`,
      key: `letter-${i}`,
      instruction: `Record the SOUND of "${letter}" (not the letter name)\nExample: B = "buh" not "bee"`,
      icon: <BookOpen size={20} />
    })),
    { 
      id: 'sentence', 
      label: `4️⃣ Sentence with Name`, 
      key: 'sentence',
      instruction: `Record a sentence with their name\nExample: "${name} loves to play"`,
      icon: <Footprints size={20} />
    },
    { 
      id: 'rhyme', 
      label: `5️⃣ Rhyme with Name`, 
      key: 'rhyme',
      instruction: `Record a fun rhyme with "${name}"\nExample: "${name}, ${name}, like a zebra!"`,
      icon: <Music size={20} />
    }
  ];
  
  const handleRecordingComplete = async (audioBlob: Blob, stageKey: string) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const audioData = e.target?.result as string;
      console.log('Recording saved for:', stageKey, 'Size:', (audioData.length / 1024).toFixed(1) + 'KB');
      
      await saveRecording(stageKey, audioData);
      
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
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Record Your Voice for {name}
        </h2>
        
        <div className="space-y-4 mb-6">
          {stages.map((stage, index) => (
            <RecordingItem
              key={stage.id}
              stage={stage}
              isActive={index === currentStage}
              isComplete={!!recordings[stage.key]}
              onRecord={(audioBlob) => handleRecordingComplete(audioBlob, stage.key)}
            />
          ))}
        </div>
        
        {isComplete && (
          <button
            onClick={onComplete}
            className="w-full py-4 bg-green-500 text-white rounded-xl font-bold text-xl hover:bg-green-600 transition-all flex items-center justify-center gap-2"
          >
            <Play size={24} />
            Start Learning!
          </button>
        )}
        
        {Object.keys(recordings).length > 0 && Object.keys(recordings).length < stages.length && (
          <div className="bg-purple-50 border border-purple-200 p-2 rounded-lg mt-3 text-center">
            <p className="text-xs text-purple-700">
              💜 Even partial recordings help! You can always add more later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ====== FLASHCARD SCREEN ======
function FlashcardScreen({ 
  name, 
  recordings, 
  current, 
  setCurrent, 
  onHome 
}: { 
  name: string; 
  recordings: Record<string, string>;
  current: number;
  setCurrent: (current: number) => void;
  onHome: () => void;
}) {
  const letters = name.split('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState('');
  const [audioError, setAudioError] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const playSound = (recordingKey: string, label = '') => {
    const audio = recordings[recordingKey];
    if (audio) {
      console.log('Playing audio for:', recordingKey);
      setIsLoading(true);
      setIsPlaying(label);
      setAudioError(false);
      setHasInteracted(true);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio(audio);
      
      audioRef.current.onloadeddata = () => {
        setIsLoading(false);
        console.log('Audio loaded and ready');
      };
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Audio playing successfully');
          setIsLoading(false);
        }).catch(err => {
          console.error('Audio playback failed:', err);
          setAudioError(true);
          setIsPlaying('');
          setIsLoading(false);
          if (!hasInteracted) {
            console.error('Please tap any sound button to enable audio playback');
          }
        });
      }
      
      audioRef.current.onended = () => {
        setIsPlaying('');
        console.log('Audio ended');
      };
    } else {
      console.error('No audio found for:', recordingKey);
    }
  };
  
  const next = () => {
    if (current < letters.length - 1) {
      setCurrent(current + 1);
    }
  };
  
  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };
  
  const currentLetter = letters[current];
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onHome}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Go to menu"
          >
            <Home size={20} />
          </button>
          <h1 className="text-xl font-bold">{name}'s Learning</h1>
          <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
            {current + 1} of {letters.length}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-lg w-full">
          {/* Giant Letter */}
          <div 
            className="text-[200px] font-bold text-purple-600 leading-none cursor-pointer hover:scale-105 transition-transform mb-8"
            onClick={() => playSound(`letter-${current}`, currentLetter)}
          >
            {currentLetter}
          </div>
          
          {/* Audio Controls */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => playSound('fullname', name)}
              className={`p-6 rounded-2xl font-bold text-lg transition-all ${
                isPlaying === name 
                  ? 'bg-purple-600 text-white scale-105' 
                  : 'bg-purple-500 text-white hover:bg-purple-600 hover:scale-105'
              } ${isLoading && isPlaying === name ? 'animate-pulse' : ''}`}
              disabled={isLoading}
            >
              {isLoading && isPlaying === name ? 'Loading...' : `🎵 ${name}`}
            </button>
            
            <button
              onClick={() => playSound(`letter-${current}`, currentLetter)}
              className={`p-6 rounded-2xl font-bold text-lg transition-all ${
                isPlaying === currentLetter 
                  ? 'bg-green-600 text-white scale-105' 
                  : 'bg-green-500 text-white hover:bg-green-600 hover:scale-105'
              } ${isLoading && isPlaying === currentLetter ? 'animate-pulse' : ''}`}
              disabled={isLoading}
            >
              {isLoading && isPlaying === currentLetter ? 'Loading...' : `🔤 ${currentLetter}`}
            </button>
          </div>
          
          {/* Special Recordings */}
          <div className="grid grid-cols-1 gap-3 mb-8">
            {recordings['question'] && (
              <button
                onClick={() => playSound('question', 'Question')}
                className={`p-4 rounded-xl font-medium text-lg transition-all ${
                  isPlaying === 'Question' 
                    ? 'bg-blue-600 text-white scale-105' 
                    : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                }`}
              >
                ❓ "What is your name?"
              </button>
            )}
            
            {recordings['sentence'] && (
              <button
                onClick={() => playSound('sentence', 'Sentence')}
                className={`p-4 rounded-xl font-medium text-lg transition-all ${
                  isPlaying === 'Sentence' 
                    ? 'bg-orange-600 text-white scale-105' 
                    : 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105'
                }`}
              >
                📝 Sentence
              </button>
            )}
            
            {recordings['rhyme'] && (
              <button
                onClick={() => playSound('rhyme', 'Rhyme')}
                className={`p-4 rounded-xl font-medium text-lg transition-all ${
                  isPlaying === 'Rhyme' 
                    ? 'bg-pink-600 text-white scale-105' 
                    : 'bg-pink-500 text-white hover:bg-pink-600 hover:scale-105'
                }`}
              >
                🎵 Fun Rhyme
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="p-4 flex justify-between items-center bg-gray-50">
        <button
          onClick={prev}
          disabled={current === 0}
          className={`p-3 rounded-full ${
            current === 0 
              ? 'bg-gray-300 text-gray-500' 
              : 'bg-purple-500 text-white hover:bg-purple-600'
          } transition-colors`}
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="text-center">
          <p className="text-gray-600 text-sm">Letter {current + 1} of {letters.length}</p>
        </div>
        
        <button
          onClick={next}
          disabled={current === letters.length - 1}
          className={`p-3 rounded-full ${
            current === letters.length - 1 
              ? 'bg-gray-300 text-gray-500' 
              : 'bg-purple-500 text-white hover:bg-purple-600'
          } transition-colors`}
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      {/* Error Message */}
      {audioError && (
        <div className="fixed bottom-4 left-4 right-4 bg-red-100 border border-red-300 p-3 rounded-lg">
          <p className="text-red-800 text-sm text-center">
            Tap any button to enable sound playback
          </p>
        </div>
      )}
    </div>
  );
}

// ====== MAIN APP ======
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [name, setName] = useState('');
  const [recordings, setRecordings] = useState<Record<string, string>>({});
  const [showGuide, setShowGuide] = useState(false);
  const [currentLetter, setCurrentLetter] = useState(0);
  
  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      const savedName = await loadFromIndexedDB('name');
      const savedScreen = await loadFromIndexedDB('currentScreen');
      
      if (savedName) {
        setName(savedName);
        const letters = savedName.split('');
        
        // Load all recordings
        const recordingKeys = ['fullname', 'question', 'sentence', 'rhyme'];
        const letterKeys = letters.map((_: string, i: number) => `letter-${i}`);
        const allKeys = [...recordingKeys, ...letterKeys];
        
        const savedRecordings: Record<string, string> = {};
        for (const key of allKeys) {
          const recording = await loadFromIndexedDB(`recording-${key}`);
          if (recording) {
            savedRecordings[key] = recording;
          }
        }
        setRecordings(savedRecordings);
        
        // Restore screen if recordings exist
        if (savedScreen && Object.keys(savedRecordings).length > 0) {
          setCurrentScreen(savedScreen);
        } else if (Object.keys(savedRecordings).length > 0) {
          setCurrentScreen('flashcards');
        } else {
          setCurrentScreen('recording');
        }
      }
    };
    
    loadSavedData();
  }, []);
  
  const saveRecording = async (key: string, value: string) => {
    await saveToIndexedDB(`recording-${key}`, value);
    setRecordings(prev => ({ ...prev, [key]: value }));
  };
  
  const startRecording = (name: string) => {
    setName(name);
    saveToIndexedDB('name', name);
    setCurrentScreen('recording');
    saveToIndexedDB('currentScreen', 'recording');
  };
  
  const completeRecording = () => {
    setCurrentScreen('flashcards');
    saveToIndexedDB('currentScreen', 'flashcards');
  };
  
  const goHome = () => {
    setCurrentScreen('flashcards');
    saveToIndexedDB('currentScreen', 'flashcards');
  };
  
  const resetApp = async () => {
    setCurrentScreen('welcome');
    setName('');
    setRecordings({});
    setCurrentLetter(0);
    
    // Clear all stored data
    if (dbPromise) {
      try {
        const db = await dbPromise;
        await db.clear('recordings');
      } catch (err) {
        console.error('Error clearing IndexedDB:', err);
      }
    }
    
    // Clear localStorage as backup
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('recording-') || key === 'name' || key === 'currentScreen') {
        localStorage.removeItem(key);
      }
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100">
      {showGuide && <ParentGuide onClose={() => setShowGuide(false)} />}
      
      {currentScreen === 'welcome' && (
        <WelcomeScreen 
          onNext={startRecording}
          onGuide={() => setShowGuide(true)}
        />
      )}
      
      {currentScreen === 'recording' && (
        <RecordingScreen
          name={name}
          recordings={recordings}
          saveRecording={saveRecording}
          onComplete={completeRecording}
          onBack={() => setCurrentScreen('welcome')}
        />
      )}
      
      {currentScreen === 'flashcards' && (
        <FlashcardScreen
          name={name}
          recordings={recordings}
          current={currentLetter}
          setCurrent={setCurrentLetter}
          onHome={goHome}
        />
      )}
    </div>
  );
}