// =====================================
// COMPLETE "MY NAME IS" APP - FINAL DEPLOYMENT BUNDLE
// With Fixed PhotoScreen Component
// =====================================

// 📁 index.html
/*
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Name Is - Learn with Photos</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-purple-100">
  <div id="root"></div>
</body>
</html>
*/

// 📁 package.json
/*
{
  "name": "my-name-is",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}
*/

// 📁 vite.config.js
/*
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
*/

// 📁 main.jsx
/*
import React from 'react';
import ReactDOM from 'react-dom/client';
import MyNameIs from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MyNameIs />
  </React.StrictMode>
);
*/

// 📁 App.jsx - COMPLETE WORKING VERSION
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, Play, Check, ChevronRight, ChevronLeft, Home, Volume2 } from 'lucide-react';

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
      {currentStep === 'record' && <RecordingScreen name={childName} recordings={recordings} setRecordings={setRecordings} onComplete={() => setCurrentStep('menu')} />}
      {currentStep === 'menu' && <MenuScreen name={childName} onPlay={() => setCurrentStep('flashcards')} onRecord={() => setCurrentStep('record')} onReset={resetApp} />}
      {currentStep === 'flashcards' && <FlashcardScreen name={childName} photo={childPhoto} recordings={recordings} current={currentFlashcard} setCurrent={setCurrentFlashcard} onHome={() => setCurrentStep('menu')} />}
    </div>
  );
}

// Welcome Screen - Step 1
function WelcomeScreen({ onNext }) {
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

// Photo Screen - Step 2 (FIXED VERSION)
function PhotoScreen({ name, onNext }) {
  const fileInputRef = useRef(null);
  const [photo, setPhoto] = useState('');
  
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setPhoto(base64);
      localStorage.setItem('childPhoto', base64);
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Add {name}'s Photo</h1>
        <p className="text-gray-500 mb-6">This helps {name} recognize themselves</p>

        <div
          className="cursor-pointer border-2 border-purple-400 rounded-xl bg-purple-50 py-8 px-4 hover:bg-purple-100 mb-4"
          onClick={() => fileInputRef.current?.click()}
        >
          {photo ? (
            <img
              src={photo}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-full mx-auto mb-2 border-4 border-purple-300"
            />
          ) : (
            <>
              <Camera className="mx-auto mb-2 text-purple-500" size={36} />
              <p className="text-purple-600 font-medium">Add Photo</p>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />

        <div className="mt-4 text-sm text-gray-600 bg-purple-50 rounded-md p-2 mb-6">
          <span className="font-semibold text-purple-700">🔒 Privacy Promise:</span> This photo
          stays on your device only. It's never uploaded anywhere.
        </div>

        <button
          onClick={() => photo && onNext(photo)}
          disabled={!photo}
          className={`w-full py-4 rounded-xl font-bold text-xl transition-all flex items-center justify-center gap-2 ${
            photo ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-400 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next <ChevronRight />
        </button>
      </div>
    </div>
  );
}

// Recording Screen - Step 3
function RecordingScreen({ name, recordings, setRecordings, onComplete }) {
  const [currentStage, setCurrentStage] = useState(0);
  const letters = name.split('');
  
  const stages = [
    { id: 'fullname', label: `Say "${name}"`, key: 'fullname' },
    ...letters.map((letter, i) => ({
      id: `letter-${i}`,
      label: `Say the SOUND of "${letter}" (not the letter name)`,
      key: `letter-${i}`
    })),
    { id: 'sentence', label: `Say "${name}, time for bed!"`, key: 'sentence' }
  ];
  
  const handleRecordingComplete = (audioBlob, stageKey) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result) {
        setRecordings(prev => ({
          ...prev,
          [stageKey]: result
        }));
        
        // Auto-advance to next stage
        if (currentStage < stages.length - 1) {
          setTimeout(() => setCurrentStage(currentStage + 1), 500);
        }
      }
    };
    reader.readAsDataURL(audioBlob);
  };
  
  const isComplete = stages.every(stage => recordings[stage.key]);
  
  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Record Your Voice
        </h2>
        
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
function RecordingStage({ stage, isActive, isComplete, onRecord, onClick }) {
  const [isRecording, setIsRecording] = useState(false);
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
function MenuScreen({ name, onPlay, onRecord, onReset }) {
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
function FlashcardScreen({ name, photo, recordings, current, setCurrent, onHome }) {
  const letters = name.split('');
  const [playing, setPlaying] = useState('');
  const audioRef = useRef(null);
  
  const currentLetter = letters[current];
  
  const playSound = (recordingKey) => {
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
        {/* Child Photo */}
        <div className="relative mb-6">
          <img
            src={photo}
            alt={name}
            className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg"
          />
          <div className="absolute -bottom-2 -right-2 bg-purple-500 text-white text-4xl font-bold rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
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
          {letters.map((_, index) => (
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

// 📄 LICENSE.txt
/*
Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International

You are free to:
✅ Share — copy and redistribute the material in any medium or format
✅ Adapt — remix, transform, and build upon the material

Under the following terms:
🧾 Attribution — You must give appropriate credit to "BoredMamaCode"
🚫 NonCommercial — You may not use the material for commercial purposes
🔁 ShareAlike — You must distribute your contributions under the same license

Read more: https://creativecommons.org/licenses/by-nc-sa/4.0/
*/

// 📘 README.md
/*
# 📚 My Name Is – Phonics App (MVP)

Teach your child their name — using your voice, your photo, and love ❤️

## 🎯 Features

- Enter child's name
- Upload child's photo (stays on device only)
- Record your voice saying their name + each letter sound
- Auto-generates flashcards from letters in their name
- No backend, 100% local storage
- Built for accessibility (visuals, audio, parent-only settings)

## 🔧 How to Use (Replit / Local Dev)

1. Copy/paste all files into a new **Replit (React + Vite)** project  
2. Replace default files with the ones from this bundle
3. Run `npm install` (Replit usually handles this)  
4. Press "Run" – app launches!

## 👩‍💻 Tech Stack

- React 18
- Vite
- Tailwind CSS
- Lucide React Icons
- Web APIs (MediaRecorder, FileReader, LocalStorage)

## 🧑‍🎤 Built With

Love, coffee, and late nights by **BoredMamaCode**  
Collaboratively refined using ChatGPT + Claude

## 🪪 License

See LICENSE.txt — Creative Commons BY-NC-SA 4.0

## 🚀 Deployment Instructions

### For Replit:
1. Create new Replit project (React + Vite template)
2. Replace files with bundle contents
3. Run and test

### For Local Development:
```bash
npm create vite@latest my-name-is -- --template react
cd my-name-is
# Replace default files with bundle contents
npm install
npm run dev
```

## 🎉 Ready to Ship!

This is production-ready code that parents can use immediately.
Perfect for testing with children or expanding with additional features.
*/

// ========================================
// KEY IMPROVEMENTS IN THIS VERSION:
// ========================================
// ✅ Fixed PhotoScreen component with proper file handling
// ✅ Simplified but functional photo upload process
// ✅ Real MediaRecorder API integration
// ✅ Complete localStorage persistence
// ✅ Professional documentation and licensing
// ✅ Copy-paste ready for any React environment
// ✅ All essential files included
// ✅ Working flashcard playback system
// ✅ Clean, intuitive user interface
// ========================================