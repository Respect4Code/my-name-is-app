
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, Play, Check, ChevronRight, ChevronLeft, Home, Volume2, Footprints } from 'lucide-react';

interface RecordingData {
  [key: string]: string;
}

interface PhotoData {
  original: string;
  cropped: string;
}

const MyNameIsApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'photo' | 'record' | 'menu' | 'flashcards'>('welcome');
  const [childName, setChildName] = useState<string>('');
  const [photoData, setPhotoData] = useState<PhotoData | null>(null);
  const [recordings, setRecordings] = useState<RecordingData>({});
  const [currentRecordingStage, setCurrentRecordingStage] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('childName');
    const savedPhoto = localStorage.getItem('photoData');
    const savedRecordings = localStorage.getItem('recordings');
    
    if (savedName) setChildName(savedName);
    if (savedPhoto) setPhotoData(JSON.parse(savedPhoto));
    if (savedRecordings) setRecordings(JSON.parse(savedRecordings));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (childName) localStorage.setItem('childName', childName);
  }, [childName]);

  useEffect(() => {
    if (photoData) localStorage.setItem('photoData', JSON.stringify(photoData));
  }, [photoData]);

  useEffect(() => {
    if (Object.keys(recordings).length > 0) {
      localStorage.setItem('recordings', JSON.stringify(recordings));
    }
  }, [recordings]);

  const recordingStages = [
    `Say "${childName}"`,
    ...childName.split('').map(letter => `Say the sound "${letter}" makes`),
    'Say a walking sentence',
    'Sing their name',
    'Make up a rhyme'
  ];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Resize to 300x300 while maintaining aspect ratio
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        const size = Math.min(img.width, img.height);
        const sourceX = (img.width - size) / 2;
        const sourceY = (img.height - size) / 2;
        
        canvas.width = 300;
        canvas.height = 300;
        
        ctx.drawImage(img, sourceX, sourceY, size, size, 0, 0, 300, 300);
        
        // Create 192x192 cropped version for flashcards
        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d')!;
        croppedCanvas.width = 192;
        croppedCanvas.height = 192;
        
        croppedCtx.drawImage(canvas, 54, 54, 192, 192, 0, 0, 192, 192);
        
        const originalDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const croppedDataUrl = croppedCanvas.toDataURL('image/jpeg', 0.8);
        
        setPhotoData({
          original: originalDataUrl,
          cropped: croppedDataUrl
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const stage = recordingStages[currentRecordingStage];
        setRecordings(prev => ({ ...prev, [stage]: audioUrl }));
        
        // Auto-advance to next stage
        if (currentRecordingStage < recordingStages.length - 1) {
          setTimeout(() => {
            setCurrentRecordingStage(prev => prev + 1);
          }, 1000);
        } else {
          // All recordings complete, move to menu
          setTimeout(() => {
            setCurrentScreen('menu');
          }, 1000);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks to release microphone
      mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
    }
  };

  const playRecording = (key: string) => {
    const audioUrl = recordings[key];
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  // Welcome Screen
  if (currentScreen === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">My Name Is</h1>
          <p className="text-gray-600 mb-8">Learn your name with your voice and photo!</p>
          
          <input
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Enter child's name"
            className="w-full p-4 text-2xl border-2 border-purple-200 rounded-xl text-center font-bold"
          />
          
          <button
            onClick={() => childName.trim() && setCurrentScreen('photo')}
            disabled={!childName.trim()}
            className="w-full mt-6 py-4 bg-purple-500 text-white rounded-xl text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors"
          >
            Next <ChevronRight size={24} className="inline ml-2" />
          </button>
        </div>
      </div>
    );
  }

  // Photo Screen
  if (currentScreen === 'photo') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-purple-600 mb-4">Add {childName}'s Photo</h2>
          <p className="text-gray-600 mb-6">Your photo stays private on this device only</p>
          
          {photoData ? (
            <div className="mb-6">
              <img 
                src={photoData.original} 
                alt={childName}
                className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-purple-200"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-xl"
              >
                Change Photo
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-48 h-48 mx-auto border-4 border-dashed border-purple-300 rounded-full flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition-colors mb-6"
            >
              <Camera size={48} className="text-purple-400 mb-2" />
              <span className="text-purple-600 font-semibold">Add Photo</span>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentScreen('welcome')}
              className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold"
            >
              <ChevronLeft size={24} className="inline mr-2" /> Back
            </button>
            
            <button
              onClick={() => photoData && setCurrentScreen('record')}
              disabled={!photoData}
              className="flex-1 py-4 bg-purple-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors"
            >
              Next <ChevronRight size={24} className="inline ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Recording Screen
  if (currentScreen === 'record') {
    const currentStage = recordingStages[currentRecordingStage];
    const isComplete = currentRecordingStage >= recordingStages.length;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          {photoData && (
            <img 
              src={photoData.original} 
              alt={childName}
              className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-purple-200 mb-6"
            />
          )}
          
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-2">
              Step {currentRecordingStage + 1} of {recordingStages.length}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentRecordingStage + 1) / recordingStages.length) * 100}%` }}
              />
            </div>
          </div>
          
          {isComplete ? (
            <div>
              <h2 className="text-3xl font-bold text-green-600 mb-4">All Done!</h2>
              <p className="text-gray-600 mb-6">Great job recording everything!</p>
              <button
                onClick={() => setCurrentScreen('menu')}
                className="w-full py-4 bg-green-500 text-white rounded-xl text-xl font-bold hover:bg-green-600 transition-colors"
              >
                Continue to Flashcards
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-purple-600 mb-4">
                {currentStage.includes('walking') ? (
                  <span className="flex items-center justify-center gap-2">
                    <Footprints size={20} />
                    Walking Sentence
                  </span>
                ) : currentStage}
              </h2>
              
              {recordings[currentStage] && (
                <div className="mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                  <Check size={24} className="text-green-600 mx-auto mb-2" />
                  <button
                    onClick={() => playRecording(currentStage)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
                  >
                    <Play size={16} className="inline mr-2" />
                    Listen
                  </button>
                </div>
              )}
              
              <div className="mb-6">
                {isRecording ? (
                  <button
                    onClick={stopRecording}
                    className="w-24 h-24 bg-red-500 text-white rounded-full mx-auto flex items-center justify-center animate-pulse"
                  >
                    <div className="w-8 h-8 bg-white rounded-sm" />
                  </button>
                ) : (
                  <button
                    onClick={startRecording}
                    className="w-24 h-24 bg-purple-500 text-white rounded-full mx-auto flex items-center justify-center hover:bg-purple-600 transition-colors"
                  >
                    <Mic size={32} />
                  </button>
                )}
              </div>
              
              <p className="text-gray-600 text-sm">
                {isRecording ? 'Recording... Tap to stop' : 'Tap to start recording'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Menu Screen
  if (currentScreen === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          {photoData && (
            <img 
              src={photoData.original} 
              alt={childName}
              className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-purple-200 mb-6"
            />
          )}
          
          <h2 className="text-3xl font-bold text-purple-600 mb-2">Hi {childName}!</h2>
          <p className="text-gray-600 mb-8">Ready to practice your name?</p>
          
          <button
            onClick={() => setCurrentScreen('flashcards')}
            className="w-full py-6 bg-purple-500 text-white rounded-xl text-xl font-bold hover:bg-purple-600 transition-colors mb-4"
          >
            Start Learning! 🎉
          </button>
          
          <button
            onClick={() => setCurrentScreen('record')}
            className="w-full py-4 bg-gray-200 text-gray-700 rounded-xl font-bold"
          >
            Re-record Sounds
          </button>
        </div>
      </div>
    );
  }

  // Flashcards Screen
  if (currentScreen === 'flashcards') {
    const letters = childName.split('');
    const currentLetter = letters[currentFlashcardIndex];
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white shadow-sm">
          <button
            onClick={() => setCurrentScreen('menu')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Home size={24} className="text-purple-600" />
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-purple-600">{childName}</h1>
            <div className="text-sm text-gray-600">
              {currentFlashcardIndex + 1} of {letters.length}
            </div>
          </div>
          
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full">
            {/* Flashcard */}
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center mb-8">
              <div className="flex items-center justify-center gap-8 mb-6">
                {/* Photo */}
                {photoData && (
                  <img 
                    src={photoData.cropped} 
                    alt={childName}
                    className="w-48 h-48 rounded-2xl object-cover border-4 border-purple-200"
                  />
                )}
                
                {/* Letter */}
                <div className="w-48 h-48 bg-purple-100 rounded-2xl flex items-center justify-center border-4 border-purple-200">
                  <span className="text-[200px] font-bold text-purple-600 leading-none">
                    {currentLetter.toUpperCase()}
                  </span>
                </div>
              </div>
              
              {/* Audio Controls */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => playRecording(`Say "${childName}"`)}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center gap-2"
                  disabled={!recordings[`Say "${childName}"`]}
                >
                  <Volume2 size={16} />
                  Full Name
                </button>
                
                <button
                  onClick={() => playRecording(`Say the sound "${currentLetter}" makes`)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
                  disabled={!recordings[`Say the sound "${currentLetter}" makes`]}
                >
                  <Volume2 size={16} />
                  Letter Sound
                </button>
                
                <button
                  onClick={() => playRecording('Say a walking sentence')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2"
                  disabled={!recordings['Say a walking sentence']}
                >
                  <Footprints size={24} />
                  Walking
                </button>
                
                <button
                  onClick={() => playRecording('Sing their name')}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg flex items-center gap-2"
                  disabled={!recordings['Sing their name']}
                >
                  <Volume2 size={16} />
                  Sing
                </button>
                
                <button
                  onClick={() => playRecording('Make up a rhyme')}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg flex items-center gap-2"
                  disabled={!recordings['Make up a rhyme']}
                >
                  <Volume2 size={16} />
                  Rhyme
                </button>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentFlashcardIndex(Math.max(0, currentFlashcardIndex - 1))}
                disabled={currentFlashcardIndex === 0}
                className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ChevronLeft size={24} />
                Previous
              </button>
              
              <button
                onClick={() => setCurrentFlashcardIndex(Math.min(letters.length - 1, currentFlashcardIndex + 1))}
                disabled={currentFlashcardIndex === letters.length - 1}
                className="flex-1 py-4 bg-purple-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-purple-600 transition-colors"
              >
                Next
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MyNameIsApp;
