import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Mic, Play, Check, ChevronRight, ChevronLeft, 
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
        <h2 id="parent-guide-title" className="text-2xl font-bold mb-4">Quick Parent Guide</h2>
        <div className="space-y-4 text-sm">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-bold mb-2">Why I Made This App</h3>
            <p className="text-gray-600">
              As a parent, I wanted my toddler to learn their name with our voices, not generic videos. 
              Inspired by phonemes, I created this app to let parents record their voice and upload photos, 
              helping toddlers connect letters to sounds in a fun, personal way! And there is nothing more 
              personal than parents’ voices, after all they have been hearing them since they were in the womb.
            </p>
          </div>
          
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
              <p className="text-gray-600">
                Upload a photo of your child (under 2MB). It’s automatically resized to 300x300 pixels, 
                then drag to reposition and confirm with the green checkmark. Cancel with the red X if needed. 
                Stays private on your device, with smaller file sizes (~100KB).
              </p>
            </div>
            
            <div>
              <h4 className="font-bold">3️⃣ Record Sounds (3-4 minutes)</h4>
              <p className="text-gray-600">Record 4 types of sounds:</p>
              <ul className="ml-4 mt-1 text-gray-600">
                <li>• Their full name</li>
                <li>• Each letter SOUND (not name!)</li>
                <li>• Walking sentence</li>
                <li>• Fun rhyme</li>
              </ul>
              <p className="text-gray-600 mt-1"><strong>To re-record:</strong> Just tap any item again!</p>
            </div>
            
            <div>
              <h4 className="font-bold">4️⃣ Done! Give to child</h4>
              <p className="text-gray-600">They tap the GIANT letters and hear YOUR voice.</p>
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
              <li>• <strong>First audio requires a tap</strong> (mobile safety)</li>
              <li>• No storage limits with new system!</li>
            </ul>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600"
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedName = localStorage.getItem('childName');
        const savedPhoto = localStorage.getItem('childPhoto');
        
        if (savedName && savedPhoto) {
          setChildName(savedName);
          setChildPhoto(savedPhoto);
          
          const recordingKeys = ['fullname', 'sentence', 'rhyme'];
          const letterKeys = savedName.split('').map((_, i) => `letter-${i}`);
          const allKeys = [...recordingKeys, ...letterKeys];
          
          const loadedRecordings: { [key: string]: string } = {};
          for (const key of allKeys) {
            const value = await loadFromIndexedDB(key);
            if (value) loadedRecordings[key] = value;
          }
          
          if (Object.keys(loadedRecordings).length > 0) {
            setRecordings(loadedRecordings);
            setCurrentStep('menu');
          }
        }
      } catch (err) {
        console.error('Error loading saved data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const saveRecording = async (key: string, value: string) => {
    await saveToIndexedDB(key, value);
    setRecordings(prev => ({ ...prev, [key]: value }));
  };

  const resetApp = async () => {
    // Direct reset - no confirmation modal needed
    localStorage.clear();
    if (dbPromise) {
        try {
          const db = await dbPromise;
          const tx = db.transaction('recordings', 'readwrite');
          await tx.objectStore('recordings').clear();
        } catch (err) {
          console.error('Error clearing IndexedDB:', err);
        }
    }
    setChildName('');
    setChildPhoto('');
    setRecordings({});
    setCurrentStep('welcome');
    setCurrentFlashcard(0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 text-white">
      {showGuide && <ParentGuide onClose={() => setShowGuide(false)} />}
      
      {currentStep === 'welcome' && (
        <WelcomeScreen 
          onNext={(name: string) => {
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
          onNext={(photo: string) => {
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
          saveRecording={saveRecording}
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
function PhotoScreen({ name, onNext, onBack }: { name: string; onNext: (photo: string) => void; onBack: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 2 * 1024 * 1024) {
        console.error('Photo is too large. Please choose a smaller image (under 2MB).');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          const maxSize = 300;
          
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxSize) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setTempImage(resizedDataUrl);
          setPosition({ x: 0, y: 0 });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !imageRef.current || !containerRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    
    const container = containerRef.current.getBoundingClientRect();
    const img = imageRef.current.getBoundingClientRect();
    const maxX = Math.max(0, (img.width - container.width) / 2);
    const maxY = Math.max(0, (img.height - container.height) / 2);
    
    const newX = Math.max(-maxX, Math.min(maxX, position.x + deltaX));
    const newY = Math.max(-maxY, Math.min(maxY, position.y + deltaY));
    
    setPosition({ x: newX, y: newY });
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleConfirmCrop = () => {
    if (!tempImage || !imageRef.current || !containerRef.current) return;
    
    const img = imageRef.current;
    const container = containerRef.current.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    canvas.width = 192;
    canvas.height = 192;
    const ctx = canvas.getContext('2d')!;
    
    const scale = img.naturalWidth / img.width;
    const sourceWidth = container.width * scale;
    const sourceHeight = container.height * scale;
    const sourceX = (img.naturalWidth - sourceWidth) / 2 - position.x * scale;
    const sourceY = (img.naturalHeight - sourceHeight) / 2 - position.y * scale;
    
    ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, 192, 192);
    
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setPhotoPreview(croppedDataUrl);
    setTempImage(null);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Add {name}'s Photo</h2>
        <p className="text-gray-600 mb-6">Helps {name} recognize themselves while learning</p>
        
        <div
          ref={containerRef}
          className="relative w-48 h-48 mx-auto mb-6 border-4 border-purple-200 rounded-2xl overflow-hidden bg-purple-50"
        >
          {tempImage ? (
            <>
              <img
                ref={imageRef}
                src={tempImage}
                alt="Photo preview"
                className="w-auto h-auto max-w-none cursor-move"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  cursor: isDragging ? 'grabbing' : 'grab',
                }}
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
              />
              <button
                onClick={handleConfirmCrop}
                className="absolute bottom-2 right-2 p-3 bg-green-500 text-white rounded-full hover:bg-green-600 shadow-lg"
                aria-label="Confirm cropped photo"
              >
                <CheckCircle size={24} />
              </button>
              <button
                onClick={() => {
                  setTempImage(null);
                  setPosition({ x: 0, y: 0 });
                }}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                aria-label="Cancel photo preview"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                Drag to reposition
              </div>
            </>
          ) : photoPreview ? (
            <>
              <img
                src={photoPreview}
                alt={name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => {
                  setPhotoPreview('');
                  fileInputRef.current?.click();
                }}
                className="absolute bottom-2 right-2 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100"
                aria-label="Replace photo"
              >
                <RefreshCw size={20} className="text-gray-600" />
              </button>
            </>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full flex flex-col items-center justify-center hover:bg-purple-100 transition-colors"
              aria-label="Upload child's photo"
            >
              <Camera size={64} className="text-purple-500 mb-4" />
              <span className="text-purple-600 font-medium text-lg">Tap to Add Photo</span>
            </button>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoSelect}
          className="hidden"
        />
        
        {!tempImage && (
          <>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6 text-left">
              <p className="text-sm text-green-800">
                🔒 <strong>100% Private:</strong> This photo stays on YOUR device only. 
                Never uploaded. Works offline forever.
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
          </>
        )}
      </div>
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
      label: 'Walking Sentence', 
      key: 'sentence',
      instruction: `Say: "${name}, do you want to go for a walk?"`,
      icon: <Footprints size={20} />
    },
    { 
      id: 'rhyme', 
      label: `Fun Rhyme`, 
      key: 'rhyme',
      instruction: `Make a fun rhyme with "${name}"\nExample: "${name} is sweet, from head to feet!"`,
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
function RecordingStage({ 
  stage, 
  isActive, 
  isComplete, 
  onRecord, 
  onClick 
}: { 
  stage: { id: string; label: string; key: string; instruction: string; icon: React.ReactNode };
  isActive: boolean;
  isComplete: boolean;
  onRecord: (blob: Blob) => void;
  onClick: () => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
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

// ====== MENU SCREEN ======
function MenuScreen({ 
  name, 
  onPlay, 
  onRecord, 
  onReset 
}: { 
  name: string; 
  onPlay: () => void; 
  onRecord: () => void; 
  onReset: () => void 
}) {
  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
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
function FlashcardScreen({ 
  name, 
  photo, 
  recordings, 
  current, 
  setCurrent, 
  onHome 
}: { 
  name: string; 
  photo: string; 
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
      console.error('No recording found. Please go back and record this sound.');
    }
  };
  
  const next = () => {
    if (current < letters.length - 1) {
      setCurrent(current + 1);
      if (hasInteracted) {
        setTimeout(() => playSound(`letter-${current + 1}`), 300);
      }
    }
  };
  
  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      if (hasInteracted) {
        setTimeout(() => playSound(`letter-${current - 1}`), 300);
      }
    }
  };
  
  useEffect(() => {
    if (hasInteracted) {
      const timer = setTimeout(() => {
        playSound(`letter-${current}`);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [current, hasInteracted]);
  
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  return (
    <div className="min-h-screen p-4 flex flex-col">
      <header className="flex justify-between items-center mb-6 max-w-6xl mx-auto w-full">
        <button
          onClick={onHome}
          className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          aria-label="Go back to menu"
        >
          <Home size={28} className="text-gray-800" />
        </button>
        
        <h2 className="text-2xl font-bold text-white drop-shadow-lg">Learning: {name}</h2>
        
        <div className="w-14" />
      </header>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-6xl w-full">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-8">
            <div className="flex-1 flex items-center justify-center">
              <img
                src={photo}
                alt={`Photo of ${name}`}
                className="w-48 h-48 rounded-3xl object-cover shadow-lg"
              />
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-12 shadow-xl">
                <span 
                  className="font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 select-none block animate-pulse"
                  style={{ fontSize: '200px', lineHeight: '1' }}
                  role="heading"
                  aria-level={2}
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
          
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 mb-6 max-w-2xl mx-auto">
            <p className="text-gray-800 text-lg font-semibold flex items-center justify-center gap-2">
              <span className="text-2xl">👆</span>
              Tap buttons below to hear sounds
            </p>
            {!hasInteracted && (
              <button
                onClick={() => playSound(`letter-${current}`, 'letter')}
                className="mt-3 px-6 py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-all animate-pulse"
              >
                🔊 Tap to Start Audio
              </button>
            )}
          </div>
          
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
                <span className="animate-spin">⏳</span> Loading audio...
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => playSound(`letter-${current}`, 'letter')}
              aria-label={`Play the sound of letter ${letters[current]}`}
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
              aria-label={`Play the full name ${name}`}
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
              aria-label="Play walking sentence"
              className={`px-6 py-5 rounded-xl font-medium transition-all flex items-center justify-center gap-3 text-lg shadow-lg ${
                isPlaying === 'sentence' 
                  ? 'bg-blue-600 text-white scale-95' 
                  : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-[1.02]'
              }`}
            >
              <Footprints size={24} />
              Walking
            </button>
            
            <button
              onClick={() => playSound('rhyme', 'rhyme')}
              aria-label="Play fun rhyme"
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
      
      <footer className="flex justify-between items-center max-w-6xl mx-auto w-full mt-6">
        <button
          onClick={prev}
          disabled={current === 0}
          data-action="prev"
          aria-label="Go to previous letter"
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
              if (hasInteracted) {
                playSound('letter-0');
              }
            }}
            aria-label="Start over from first letter"
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
          aria-label="Go to next letter"
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
if (typeof document !== 'undefined') {
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
}
