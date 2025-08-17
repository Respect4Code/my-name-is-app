import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import {
  Info, ChevronRight, ArrowLeft, Volume2, BookOpen, Moon, Music, Loader2, ArrowRight, ChevronLeft,
  CheckCircle, Mic, Square, RefreshCw, Play, Share2, HelpCircle, X, ChevronDown
} from 'lucide-react';
import { openDB } from 'idb';

// BoredMama logo - exact match from marketing materials
const BoredMamaLogo = () => {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="flex items-center justify-center mb-2">
      {!logoError && (
        <img
          src="/boredmama-logo.svg"
          alt="BoredMama - Revolutionising Motherhood"
          className="h-12 w-auto object-contain"
          onLoad={() => setLogoLoaded(true)}
          onError={() => setLogoError(true)}
          style={{ display: logoLoaded ? 'block' : 'none' }}
        />
      )}
      {(logoError || !logoLoaded) && (
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-600 rounded-2xl shadow-lg">
          <span className="text-white font-bold text-lg tracking-wide">BoredMama</span>
        </div>
      )}
    </div>
  );
};

// TypeScript interfaces
interface Stage {
  id: string;
  label: string;
  key: string;
  instruction: string;
  icon: React.ReactNode;
}

interface ParentGuideProps {
  onClose: () => void;
}

interface WelcomeScreenProps {
  onNext: (name: string) => void;
  onGuide: () => void;
}

interface ShareButtonProps {
  className?: string;
}

interface RecordingScreenProps {
  name: string;
  recordings: Record<string, string>;
  setRecordings: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onComplete: () => void;
  onBack: () => void;
}

interface FlashcardScreenProps {
  name: string;
  recordings: Record<string, string>;
  onReset: () => void;
}

interface RecordingStageProps {
  stage: Stage;
  isActive: boolean;
  isComplete: boolean;
  isNext: boolean;
  onRecord: (audioData: string) => void;
  onClick: () => void;
  onReRecord: () => void;
  recordings: { [key: string]: string };
}

// RecordWord Component for Action Words mode
const RecordWord: React.FC<{
  word: string;
  onNext: () => void;
  onBack: () => void;
  recorderRef: React.MutableRefObject<MediaRecorder | null>;
}> = memo(({ word, onNext, onBack, recorderRef }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert('getUserMedia not supported on your browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4';

      recorderRef.current = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      recorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorderRef.current.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.onload = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(audioBlob);
        setIsRecording(false);
        setIsStopping(false);
      };

      recorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Recording error:', err);
      alert('Failed to start recording. Please check microphone permissions.');
      setIsRecording(false);
      setIsStopping(false);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      setIsStopping(true);
      recorderRef.current.stop();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const playPreview = () => {
    if (previewUrl && audioRef.current) {
      audioRef.current.src = previewUrl;
      audioRef.current.play().catch(err => {
        console.error('Preview playback failed:', err);
        alert('Unable to play preview. Check your device volume or silent mode.');
      });
    }
  };

  const saveRecording = () => {
    if (previewUrl) {
      onNext();
      // In a real app, you'd pass this data up to the parent component
      // For now, we assume the parent handles saving the previewUrl with the word
    }
  };

  return (
    <div style={{ padding: '30px', background: '#fff0ff', borderRadius: '15px', textAlign: 'center' }}>
      <h3 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '15px', color: '#ff00ff' }}>
        Record: {word}
      </h3>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
        Tap the mic to start, tap the square to stop.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
        {previewUrl ? (
          <>
            <button
              onClick={playPreview}
              style={{ padding: '15px', background: '#ff00ff', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer' }}
            >
              <Play size={24} />
            </button>
            <button
              onClick={saveRecording}
              style={{ padding: '15px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer' }}
            >
              <CheckCircle size={24} />
            </button>
            <button
              onClick={() => { setPreviewUrl(null); setIsRecording(false); stopRecording(); }}
              style={{ padding: '15px', background: '#f44336', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer' }}
            >
              <RefreshCw size={24} />
            </button>
            <audio ref={audioRef} />
          </>
        ) : (
          <button
            onClick={toggleRecording}
            style={{
              padding: '20px',
              background: isRecording ? '#f44336' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isRecording ? <Square size={30} /> : <Mic size={30} />}
          </button>
        )}
      </div>
      <div style={{ marginTop: '20px' }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#999', cursor: 'pointer', fontSize: '16px' }}>
          ← Back to Categories
        </button>
      </div>
    </div>
  );
});

// ParentGuide Component
const ParentGuide: React.FC<ParentGuideProps> = memo(({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-labelledby="parent-guide-title">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 id="parent-guide-title" className="text-2xl font-bold mb-4">Quick Parent Guide</h2>

        <div className="space-y-4 text-sm">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-bold mb-2">💡 Why I Made This App</h3>
            <p className="text-gray-600">
              As parents, we wanted our toddler to learn their own name with our voices sounding it out, not generic videos or cartoons. Inspired by phonics and early speech science, I created <em>MyNameIsApp</em> so parents can record their voices, helping toddlers connect the sounds in a fun, personal way. There is nothing more personal than parents' voices—after all, they have been hearing them since they were in the womb.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">⏱️ Total Setup Time: 4 minutes</h3>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-bold">1️⃣ Enter Their Name (~15 seconds)</h4>
              <p className="text-gray-600">Type your child's name (up to 26 letters).</p>
            </div>

            <div>
              <h4 className="font-bold">2️⃣ Record Sounds (~3–4 minutes)</h4>
              <p className="text-gray-600 mb-2">You'll be prompted to record:</p>
              <ul className="ml-4 mt-1 text-gray-600 list-disc">
                <li>Their full name</li>
                <li><strong>"What is your name?"</strong> ✨ <em>(New feature!)</em></li>
                <li>Each phoneme (letter sound) — A = "ahh", B = "buh" <em>(not "ay" or "bee")</em></li>
                <li>Sentence with name</li>
                <li>Rhyme with name</li>
              </ul>
              <p className="text-gray-600 mt-1">📢 <strong>Recordings auto-save instantly!</strong></p>
              <p className="text-gray-600 mt-1"><strong>Don't like it?</strong> Tap the blue refresh icon to re-record any item</p>
            </div>

            <div>
              <h4 className="font-bold">3️⃣ Done! Time to Play Together</h4>
              <p className="text-gray-600">Tap the colourful flashcards together to hear your voice. Watch their face light up!</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">🎙️ Recording Tips</h3>
            <ul className="text-gray-700 space-y-1 list-disc ml-4">
              <li>🔴 Red mic = Start/stop recording</li>
              <li>▶️ Play button = Listen to what you just recorded</li>
              <li>✅ Recordings save automatically</li>
              <li>🔄 Blue refresh = Re-record if needed</li>
              <li>Record <strong>phoneme</strong> sounds, not alphabet names</li>
              <li><em>(e.g. B = "buh", not "bee")</em></li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">⚠️ Important Notes</h3>
            <ul className="text-gray-700 space-y-1 list-disc ml-4">
              <li>✅ All recordings auto-save instantly (no save button needed!)</li>
              <li>❌ Avoid using your browser's back button (use in-app navigation)</li>
              <li>⛔ Going back clears recordings — you'll be asked to confirm</li>
              <li>📵 If sound doesn't play: check volume, silent mode, and permissions</li>
              <li><em>(Most browsers require user interaction before audio plays)</em></li>
            </ul>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h3 className="font-bold mb-2">🎯 Pro Tip</h3>
            <p className="text-gray-700">
              🎯 Set up solo while your toddler naps — quick and quiet.<br/>
              <strong>Or make it playtime!</strong> Recording together can be magical — you might catch them giggling, joining in with their own sounds like "buh" or "mmmm," or hearing their voice played back for the first time.<br/><br/>
              Whether you do it solo or as a team, keep it light and playful — that's how they learn best. 😄
            </p>
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

// ShareButton Component
const ShareButton: React.FC<ShareButtonProps> = memo(({ className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const shareUrl = window.location.href;
  const shareText = "Check out this amazing phonics app! Help your child learn letters with your own voice 🎵";

  const handleShare = async (platform: string) => {
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      snapchat: `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(shareUrl)}`
    };

    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
    setIsExpanded(false);
  };

  const handleNativeShare = async () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleNativeShare}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          w-full py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2
          ${isHovered
            ? 'bg-orange-400 text-white shadow-lg transform scale-105'
            : 'bg-transparent text-purple-600 border-2 border-purple-200 hover:border-purple-300'
          }
        `}
        aria-label="Share this app with friends and family"
      >
        {isHovered ? 'SHARE THIS APP' : 'Share with friends & family'}
        <Share2 size={16} />
      </button>

      {isExpanded && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border-2 border-gray-100 p-4 z-50">
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            aria-label="Close sharing options"
          >
            <X size={16} />
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleShare('whatsapp')}
              className="flex items-center gap-2 p-3 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.886 3.488"/>
              </svg>
              WhatsApp
            </button>
            <button
              onClick={() => handleShare('snapchat')}
              className="flex items-center gap-2 p-3 rounded-lg bg-yellow-400 text-black hover:bg-yellow-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.162-1.499-.69-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12.013C24.007 5.367 18.641.001.017 0"/>
              </svg>
              Snapchat
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="flex items-center gap-2 p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="flex items-center gap-2 p-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
              </svg>
              X (Twitter)
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

// WelcomeScreen Component
const WelcomeScreen: React.FC<WelcomeScreenProps> = memo(({ onNext, onGuide }) => {
  const [name, setName] = useState('');
  const [infoPressing, setInfoPressing] = useState(false);
  const [infoPressTimer, setInfoPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [showSecretMenu, setShowSecretMenu] = useState(false);
  const [currentMode, setCurrentMode] = useState<'standard' | 'alphabet' | 'numbers' | 'actions' | 'grandparent' | 'vip'>(
    (sessionStorage.getItem('mode') as any) || 'standard'
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLongPress, setIsLongPress] = useState(false);
  const [ingView, setIngView] = useState<'grid' | 'words' | 'record'>('grid');
  const [ingCategory, setIngCategory] = useState<keyof typeof ING | null>(null);
  const [ingQueue, setIngQueue] = useState<string[]>([]);
  const [ingIndex, setIngIndex] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);

  // Load saved mode on component mount
  useEffect(() => {
    const savedMode = localStorage.getItem('selectedMode');
    if (savedMode && ['standard', 'alphabet', 'numbers', 'actions', 'grandparent', 'vip'].includes(savedMode)) {
      setCurrentMode(savedMode as typeof currentMode);
    }
  }, []);

  // Toast notification
  const showToastNotification = useCallback((message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  // Info button handlers with proper long-press detection
  const handleInfoMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsLongPress(false);
    setInfoPressing(true);

    const timer = setTimeout(() => {
      setIsLongPress(true);
      setShowSecretMenu(true);
      setInfoPressing(false);
      showToastNotification('🎯 Secret menu activated!');
    }, 600);
    setInfoPressTimer(timer);
  }, [showToastNotification]);

  const handleInfoMouseUp = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setInfoPressing(false);

    if (infoPressTimer) {
      clearTimeout(infoPressTimer);
      setInfoPressTimer(null);
    }

    if (!isLongPress && !showSecretMenu) {
      onGuide();
    }

    setTimeout(() => setIsLongPress(false), 100);
  }, [infoPressTimer, isLongPress, showSecretMenu, onGuide]);

  const handleInfoMouseLeave = useCallback(() => {
    if (infoPressTimer) {
      clearTimeout(infoPressTimer);
      setInfoPressTimer(null);
    }
    setInfoPressing(false);
    setIsLongPress(false);
  }, [infoPressTimer]);

  const handleInfoTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleInfoMouseDown(e as any);
  }, [handleInfoMouseDown]);

  const handleInfoTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleInfoMouseUp(e as any);
  }, [handleInfoMouseUp]);

  // Enhanced mode selection with immediate feedback
  const handleModeChange = (mode: typeof currentMode) => {
    setCurrentMode(mode);
    setShowSecretMenu(false);
    setIsLongPress(false);

    // Store the selected mode in localStorage for persistence (except VIP)
    if (mode === 'vip') {
      sessionStorage.clear();
      localStorage.clear();
    } else {
      localStorage.setItem('selectedMode', mode);
      sessionStorage.setItem('mode', mode);
    }

    // Mode-specific immediate feedback
    const modeMessages = {
      actions: '🎬 Action Words Mode - Categories ready!',
      alphabet: '🔤 Alphabet Mode - Ready to learn A-Z!',
      numbers: '🔢 Numbers Mode - Ready to learn 0-9!',
      grandparent: '👴 Grandparent Mode - Simplified interface active',
      vip: '🔒 VIP Mode - Maximum privacy enabled',
      standard: '🏠 Standard Mode - Name recording ready'
    };

    showToastNotification(modeMessages[mode] || 'Mode changed');

    // Mode-specific state reset and initial setup
    if (mode === 'actions') {
      setIngView('grid');
      setIngCategory(null);
      setIngQueue([]);
      setIngIndex(0);
      setName('');
      // Stop any active recording
      if (recorderRef.current?.state === 'recording') {
        recorderRef.current.stop();
      }
    } else {
      setIngView('grid');
      setIngCategory(null);
      setIngQueue([]);
      setIngIndex(0);
      if (mode === 'alphabet') {
        setName('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
      } else if (mode === 'numbers') {
        setName('0123456789');
      } else {
        setName('');
      }
    }
  };

  // Magic word detection
  useEffect(() => {
    const value = name.trim().toUpperCase();
    if (value === 'ING' || value === 'ACTIONS') {
      handleModeChange('actions');
    } else if (value === 'ALPHABET' || value === 'ABC') {
      handleModeChange('alphabet');
    } else if (value === 'NUMBERS' || value === '123') {
      handleModeChange('numbers');
    }
  }, [name]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNextClick();
    }
  };

  const handleNextClick = () => {
    const value = name.trim();
    const canRecordTypedWord = currentMode === 'actions' && value.length > 0 && /ing$/i.test(value);

    if (!value && currentMode !== 'actions') {
      alert('Please enter a name or word first');
      return;
    }

    if (currentMode === 'actions') {
      if (canRecordTypedWord) {
        chooseWord(value); // Jump directly to recording
      } else if (ingView === 'grid') {
        // If in grid view, do nothing until a category is selected
        return;
      } else if (ingView === 'record') {
        // This case should ideally not be reached directly from the main button
        // but is handled within RecordWord component.
        return;
      } else if (ingView === 'words') {
        // If in words view, the button should trigger recording all or typed word
        // For now, this path might need refinement based on exact UX desired.
        // The input field's onKeyDown handles direct recording.
        showToastNotification('Select or type a word to record.');
        return;
      }
    } else {
      onNext(name.toUpperCase());
    }
  };


  // Action Words data
  const ING = {
    daily: ['eating', 'drinking', 'brushing', 'washing', 'sleeping', 'waking'],
    movement: ['running', 'jumping', 'walking', 'crawling', 'rolling', 'spinning'],
    hands: ['clapping', 'waving', 'grabbing', 'throwing', 'catching', 'pointing'],
    emotions: ['laughing', 'smiling', 'crying', 'hugging', 'kissing', 'loving'],
    creative: ['drawing', 'painting', 'singing', 'dancing', 'building', 'making'],
    playing: ['hiding', 'seeking', 'climbing', 'sliding', 'swinging', 'bouncing'],
  };

  // Open category view
  const openCategory = useCallback((cat: keyof typeof ING) => {
    setIngCategory(cat);
    setIngView('words');
  }, []);

  // Choose word for recording
  const chooseWord = useCallback((word: string) => {
    setIngQueue([word.toLowerCase()]);
    setIngIndex(0);
    setIngView('record');
  }, []);

  // Choose all words in category
  const chooseAllInCategory = useCallback(() => {
    if (!ingCategory) return;
    setIngQueue([...ING[ingCategory]]);
    setIngIndex(0);
    setIngView('record');
  }, [ingCategory]);

  // Helper to get the correct emoji for categories
  const getCategoryEmoji = (catKey: string) => {
    switch (catKey) {
      case 'daily': return '🍽️';
      case 'movement': return '🏃';
      case 'hands': return '✋';
      case 'emotions': return '😊';
      case 'creative': return '🎨';
      case 'playing': return '🎮';
      default: return '❓';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4" style={{
      backgroundColor: currentMode === 'actions' ? 'rgba(255, 0, 255, 0.05)' :
                       currentMode === 'alphabet' ? 'rgba(0, 123, 255, 0.05)' :
                       currentMode === 'numbers' ? 'rgba(0, 255, 0, 0.05)' :
                       currentMode === 'grandparent' ? 'rgba(255, 165, 0, 0.05)' :
                       currentMode === 'vip' ? 'rgba(255, 215, 0, 0.05)' : 'transparent',
      transition: 'background-color 0.3s ease'
    }}>
      {/* Mode Banner */}
      {currentMode !== 'standard' && (
        <div className="fixed top-0 left-0 right-0 z-50 p-3 text-center text-white font-bold animate-pulse" style={{
          background: currentMode === 'actions' ? '#ff00ff' :
                     currentMode === 'alphabet' ? '#007bff' :
                     currentMode === 'numbers' ? '#00ff00' :
                     currentMode === 'grandparent' ? '#ffa500' :
                     currentMode === 'vip' ? '#ffd700' : '#333',
          animation: 'slideDown 0.3s ease'
        }}>
          {currentMode === 'actions' && '🎬 ACTION WORDS MODE ACTIVE'}
          {currentMode === 'alphabet' && '🔤 ALPHABET MODE ACTIVE'}
          {currentMode === 'numbers' && '🔢 NUMBERS MODE ACTIVE'}
          {currentMode === 'grandparent' && '👴 GRANDPARENT MODE ACTIVE'}
          {currentMode === 'vip' && '🔒 VIP MODE - Maximum Security'}
        </div>
      )}

      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative" style={{
        marginTop: currentMode !== 'standard' ? '60px' : '0'
      }}>
        <button
          onClick={() => !showSecretMenu && onGuide()}
          onMouseDown={handleInfoMouseDown}
          onMouseUp={handleInfoMouseUp}
          onMouseLeave={handleInfoMouseLeave}
          onTouchStart={handleInfoTouchStart}
          onTouchEnd={handleInfoTouchEnd}
          className={`absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all ${infoPressing ? 'bg-purple-500 text-white' : ''}`}
          aria-label="Open parent guide"
        >
          <Info size={20} aria-hidden="true" />
        </button>

        {/* Secret Dropdown Menu */}
        {showSecretMenu && (
          <div className="absolute top-16 right-4 bg-white rounded-xl shadow-xl border-2 border-gray-100 p-4 z-50 min-w-[260px]">
            <div className="space-y-2">
              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">Secret Features</div>

              <button
                onClick={() => handleModeChange('actions')}
                className={`w-full text-left p-2 rounded-lg hover:bg-purple-50 flex items-center gap-2 ${currentMode === 'actions' ? 'bg-purple-100 text-purple-700' : ''}`}
              >
                🎬 Action Words Mode
                {currentMode === 'actions' && <span className="ml-auto text-xs bg-purple-500 text-white px-2 py-1 rounded">ACTIVE</span>}
              </button>

              <button
                onClick={() => handleModeChange('alphabet')}
                className={`w-full text-left p-2 rounded-lg hover:bg-blue-50 flex items-center gap-2 ${currentMode === 'alphabet' ? 'bg-blue-100 text-blue-700' : ''}`}
              >
                🔤 Alphabet Mode
                {currentMode === 'alphabet' && <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-1 rounded">ACTIVE</span>}
              </button>

              <button
                onClick={() => handleModeChange('numbers')}
                className={`w-full text-left p-2 rounded-lg hover:bg-orange-50 flex items-center gap-2 ${currentMode === 'numbers' ? 'bg-orange-100 text-orange-700' : ''}`}
              >
                🔢 Numbers Mode
                {currentMode === 'numbers' && <span className="ml-auto text-xs bg-orange-500 text-white px-2 py-1 rounded">ACTIVE</span>}
              </button>

              <button
                onClick={() => handleModeChange('grandparent')}
                className={`w-full text-left p-2 rounded-lg hover:bg-yellow-50 flex items-center gap-2 ${currentMode === 'grandparent' ? 'bg-yellow-100 text-yellow-700' : ''}`}
              >
                👴 Grandparent Mode
                {currentMode === 'grandparent' && <span className="ml-auto text-xs bg-yellow-500 text-white px-2 py-1 rounded">ACTIVE</span>}
              </button>

              <button
                onClick={() => handleModeChange('vip')}
                className={`w-full text-left p-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 ${currentMode === 'vip' ? 'bg-gray-100 text-gray-700' : ''}`}
              >
                🔒 VIP Mode
                {currentMode === 'vip' && <span className="ml-auto text-xs bg-gray-500 text-white px-2 py-1 rounded">ACTIVE</span>}
              </button>

              <div className="border-t pt-2 mt-3">
                <button
                  onClick={() => {
                    setShowSecretMenu(false);
                    setCurrentMode('standard');
                    showToastNotification('🏠 Standard Mode Restored');
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-gray-50 text-gray-600 text-sm"
                >
                  🏠 Back to Standard
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowSecretMenu(false)}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full"
            >
              ×
            </button>
          </div>
        )}

        <div className="mb-6">
          <BoredMamaLogo />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          My Name Is
          {currentMode !== 'standard' && (
            <span className="text-sm block text-purple-600 font-medium mt-1">
              {currentMode === 'actions' && '🎬 Action Words Mode'}
              {currentMode === 'alphabet' && '🔤 Alphabet Mode'}
              {currentMode === 'numbers' && '🔢 Numbers Mode'}
              {currentMode === 'grandparent' && '👴 Grandparent Mode'}
              {currentMode === 'vip' && '🔒 VIP Mode'}
            </span>
          )}
        </h1>
        <p className="text-gray-600 mb-2">
          {currentMode === 'actions' ? 'Learn action words ending in -ING with YOUR voice!' :
           currentMode === 'alphabet' ? 'Master the alphabet A-Z with YOUR voice!' :
           currentMode === 'numbers' ? 'Count and learn 0-9 with YOUR voice!' :
           currentMode === 'grandparent' ? 'Simplified learning at a comfortable pace' :
           currentMode === 'vip' ? 'Maximum privacy phonics experience' :
           'Teach your child their name with YOUR voice'}
        </p>
        <p className="text-purple-600 text-sm font-medium mb-4">
          {currentMode === 'actions' ? '⭐ "My toddler loves learning action words!" - Happy parent' :
           currentMode === 'alphabet' ? '⭐ "Perfect for learning letter sounds!" - Parent' :
           currentMode === 'numbers' ? '⭐ "Counting made fun and personal!" - Parent' :
           currentMode === 'grandparent' ? '⭐ "Easy for grandparents to use!" - Family' :
           currentMode === 'vip' ? '⭐ "Perfect privacy for my child!" - Parent' :
           '⭐ "My 18-month-old learned all letters phonetically!" - Real parent'}
        </p>

        {/* Main Content for Action Words Mode */}
        {currentMode === 'actions' ? (
          <>
            {ingView === 'grid' && (
              <div>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                  🎬 Choose a Category
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  {Object.keys(ING).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => openCategory(cat as keyof typeof ING)}
                      style={{
                        padding: '20px',
                        background: 'white',
                        border: '2px solid #ff00ff',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#ff00ff';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.color = 'black';
                      }}
                    >
                      <div style={{ fontSize: '30px', marginBottom: '10px' }}>
                        {getCategoryEmoji(cat)}
                      </div>
                      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </div>
                      <div style={{ fontSize: '12px', opacity: '0.7' }}>
                        {ING[cat as keyof typeof ING].slice(0, 3).join(', ')}...
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {ingView === 'words' && ingCategory && (
              <div>
                <button
                  onClick={() => setIngView('grid')}
                  className="absolute top-4 left-4 p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                  aria-label="Back to categories"
                >
                  <ArrowLeft size={20} aria-hidden="true" />
                </button>
                <h3 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '30px' }}>
                  {ingCategory.charAt(0).toUpperCase() + ingCategory.slice(1)} Actions
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                  {ING[ingCategory].map((w) => (
                    <button
                      key={w}
                      onClick={() => chooseWord(w)}
                      style={{
                        padding: '10px',
                        background: '#f0f0f0',
                        border: '1px solid #ddd',
                        borderRadius: '15px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#ff00ff';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f0f0f0';
                        e.currentTarget.style.color = 'black';
                      }}
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <div style={{ textAlign: 'center', marginBottom: '10px', color: '#666' }}>or</div>
                <input
                  placeholder="Type your own -ING word (e.g., clapping)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      chooseWord(e.currentTarget.value.trim());
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #ddd',
                    borderRadius: '10px',
                    marginBottom: '10px',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    onClick={() => {
                      if (name.trim()) chooseWord(name.trim());
                    }}
                    style={{
                      padding: '10px 20px',
                      background: '#ff00ff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    Record Typed Word →
                  </button>
                  <button
                    onClick={chooseAllInCategory}
                    style={{
                      padding: '10px 15px',
                      background: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    Record All in Category →
                  </button>
                </div>
              </div>
            )}

            {ingView === 'record' && ingQueue.length > 0 && (
              <RecordWord
                word={ingQueue[ingIndex]}
                onNext={() => {
                  const next = ingIndex + 1;
                  if (next < ingQueue.length) {
                    setIngIndex(next);
                  } else {
                    setIngView('words');
                    setIngQueue([]);
                    setIngIndex(0);
                    showToastNotification('Recording complete!');
                  }
                }}
                onBack={() => setIngView('words')}
                recorderRef={recorderRef}
              />
            )}
          </>
        ) : (
          // Standard and other modes content
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                if (currentMode === 'numbers') {
                  setName(e.target.value.replace(/[^0-9]/g, ''));
                } else {
                  setName(e.target.value.replace(/[^a-zA-Z]/g, ''));
                }
              }}
              onKeyPress={handleKeyPress}
              placeholder={
                currentMode === 'standard' ? "Enter your child's name" :
                currentMode === 'actions' ? "Type an -ING word (e.g., clapping)" :
                currentMode === 'alphabet' ? "Enter letters (A-Z)" :
                currentMode === 'numbers' ? "Enter numbers (0-9)" :
                currentMode === 'grandparent' ? "TYPE THE CHILD'S NAME" :
                currentMode === 'vip' ? "Enter name (Privacy Mode)" :
                "Enter a value"
              }
              className={`w-full p-4 text-center border-2 border-purple-200 rounded-xl text-gray-800 mb-6 ${
                currentMode === 'grandparent' ? 'text-3xl' : 'text-2xl'
              }`}
              maxLength={currentMode === 'alphabet' ? 26 : currentMode === 'numbers' ? 10 : 12}
              autoFocus
              aria-label="Input field"
            />

            {name.length >= 10 && currentMode === 'standard' && (
              <p className="text-xs text-orange-600 -mt-4 mb-4 text-center">
                {12 - name.length} characters left
              </p>
            )}

            <button
              onClick={handleNextClick}
              className={`w-full py-4 rounded-xl font-bold text-xl transition-all flex items-center justify-center gap-2 ${
                currentMode === 'actions' && name.trim().length > 0 && /ing$/i.test(name.trim())
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                  : currentMode === 'actions' ? 'bg-purple-300'
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
              }`}
              aria-label="Proceed to next step"
              disabled={
                (currentMode === 'actions' && !name.trim() && ingView === 'grid') || // Cannot proceed from grid without selecting category
                (currentMode === 'actions' && ingView === 'words' && !name.trim() && ingQueue.length === 0) // Cannot proceed from words without selecting or typing
              }
            >
              {currentMode === 'actions' && name.trim().length > 0 && /ing$/i.test(name.trim()) ? 'Start Recording →' :
               currentMode === 'actions' ? 'Show Categories →' : 'Next →'}
              {currentMode !== 'actions' && <ChevronRight />}
            </button>
          </>
        )}

        <button
          onClick={onGuide}
          className="mt-4 text-purple-600 underline text-sm"
          aria-label="View parent guide"
        >
          Need help? Read 4-minute guide
        </button>

        <ShareButton className="mt-6" />

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border-2 border-purple-200 px-6 py-3 z-50 animate-bounce">
            <div className="text-sm font-medium text-gray-800">{toastMessage}</div>
          </div>
        )}

        {/* Global click handler to close dropdown */}
        {showSecretMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowSecretMenu(false)}
          />
        )}
      </div>
    </div>
  );
});

// RecordingStage Component
const RecordingStage: React.FC<RecordingStageProps> = memo(({ stage, isActive, isComplete, isNext, onRecord, onClick, onReRecord, recordings }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [tempRecording, setTempRecording] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!stream) throw new Error('No audio stream available');

      const possibleTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/mpeg',
        'audio/ogg;codecs=opus',
      ];
      const mimeType = possibleTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'audio/webm';

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.onload = () => {
          const audioData = reader.result as string;
          setTempRecording(audioData);
          setIsRecording(false);
          setIsStopping(false);
          setCountdown(null);
          // Auto-save after 2 seconds delay
          setTimeout(() => {
            onRecord(audioData);
            setTempRecording(null);
          }, 2000);
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Recording error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      alert(`Recording failed: ${errorMessage}. Please ensure microphone access is granted.`);
      setIsRecording(false);
      setIsStopping(false);
      setCountdown(null);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      setIsStopping(true);
      mediaRecorderRef.current.stop();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      setTempRecording(null);
      setCountdown(1);
      setTimeout(() => {
        startRecording();
      }, 1000);
    }
  };

  const playRecording = () => {
    if (tempRecording && audioRef.current) {
      audioRef.current.src = tempRecording;
      audioRef.current.play().catch(err => {
        console.error('Preview playback failed:', err);
        alert('Unable to play preview. Check your device volume or silent mode.');
      });
    }
  };

  const saveRecording = () => {
    if (tempRecording) {
      onRecord(tempRecording);
      setTempRecording(null);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
        isActive
          ? 'bg-blue-100 border-2 border-blue-300'
          : isNext && !isComplete
          ? 'bg-yellow-50 border-2 border-yellow-300'
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
      role="button"
      tabIndex={0}
      aria-label={`Record ${stage.label}`}
      onKeyPress={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="flex items-center gap-2">
        {stage.icon}
        <span className="text-sm font-medium">{stage.label}</span>
      </div>
      <div className="flex items-center gap-2 relative">
        {countdown !== null && (
          <span className="absolute -top-6 text-xs text-blue-600 font-bold">
            Recording in {countdown}...
          </span>
        )}
        {tempRecording ? (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                playRecording();
              }}
              className="p-2 bg-purple-500 rounded-full hover:bg-purple-600 text-white"
              aria-label={`Play preview of ${stage.label}`}
            >
              <Play size={20} aria-hidden="true" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                saveRecording();
              }}
              className="p-2 bg-green-500 rounded-full hover:bg-green-600 text-white"
              aria-label={`SAVE recording for ${stage.label}`}
            >
              <CheckCircle size={20} aria-hidden="true" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleRecording();
              }}
              className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 text-white"
              aria-label={`Re-record ${stage.label}`}
            >
              <RefreshCw size={20} aria-hidden="true" />
            </button>
            <audio ref={audioRef} className="hidden" />
          </div>
        ) : isComplete ? (
          <div className="flex gap-2 items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (recordings[stage.key]) {
                  const audio = new Audio(recordings[stage.key]);
                  audio.play().catch(err => {
                    console.error('Playback failed:', err);
                    alert('Unable to play audio. Check your device volume or silent mode.');
                  });
                }
              }}
              className="p-2 bg-purple-500 rounded-full hover:bg-purple-600 text-white"
              aria-label={`Play ${stage.label} recording`}
            >
              <Play size={20} aria-hidden="true" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReRecord();
              }}
              className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 text-white"
              aria-label={`Re-record ${stage.label}`}
            >
              <RefreshCw size={20} aria-hidden="true" />
            </button>
            <CheckCircle size={20} className="text-green-500" aria-hidden="true" />
          </div>
        ) : isActive && isRecording ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleRecording();
            }}
            className={`p-2 rounded-full ${isStopping ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'} text-white`}
            aria-label={isStopping ? 'Stopping recording' : 'Stop recording'}
            disabled={isStopping}
          >
            {isStopping ? <Loader2 size={20} className="animate-spin" aria-hidden="true" /> : <Square size={20} aria-hidden="true" />}
          </button>
        ) : isActive ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleRecording();
            }}
            className="p-2 bg-orange-500 rounded-full hover:bg-orange-600 text-white"
            aria-label="Start recording"
            disabled={countdown !== null}
          >
            <Mic size={20} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
});

// RecordingScreen Component
const RecordingScreen: React.FC<RecordingScreenProps> = memo(({ name, recordings, setRecordings, onComplete, onBack }) => {
  const [currentStage, setCurrentStage] = useState(0);

  const letters = name.split('');

  const stages: Stage[] = [
    {
      id: 'fullname',
      label: `Full Name: "${name}"`,
      key: 'fullname',
      instruction: `Say their name clearly: "${name}"`,
      icon: <Volume2 size={20} />
    },
    {
      id: 'question',
      label: 'Name Question',
      key: 'question',
      instruction: `Ask: "What is your name?" (pause for response)`,
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
      label: 'Say a sentence with name',
      key: 'sentence',
      instruction: `Say a sentence using "${name}" - be creative!`,
      icon: <Moon size={20} />
    },
    {
      id: 'rhyme',
      label: `Say a fun rhyme with name`,
      key: 'rhyme',
      instruction: `Make a fun rhyme with "${name}"\nExample: "${name} is sweet, from head to feet!"`,
      icon: <Music size={20} />
    }
  ];

  const isComplete = stages.every(stage => recordings[stage.key]);
  const nextUnrecordedStage = stages.findIndex(stage => !recordings[stage.key]);

  const handleBack = () => {
    if (window.confirm('Going back will clear all recordings and the name. Are you sure?')) {
      onBack();
    }
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          aria-label="Go back to name entry and clear recordings"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Record Your Voice for {name}
        </h2>

        {Object.keys(recordings).length > 0 && Object.keys(recordings).length < stages.length && (
          <div className="bg-purple-50 border border-purple-200 p-2 rounded-lg mb-3 text-center">
            <p className="text-xs text-purple-700">
              💜 Even partial recordings help! You can always add more later.
            </p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4 relative">
          <div className="flex items-center gap-2 text-blue-800">
            <Info size={16} aria-hidden="true" />
            <p className="text-sm font-medium">How to Record:</p>
          </div>
          <ol className="text-sm text-blue-700 mt-1 ml-6 list-decimal">
            <li>Tap any item to select it</li>
            <li>Tap the RED microphone to START recording</li>
            <li>Say the word/sound clearly</li>
            <li>Tap the SQUARE to STOP</li>
            <li>Recording auto-saves after 2 seconds - no need to click SAVE!</li>
            <li><strong>To re-record: Tap the BLUE refresh icon</strong></li>
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
            <div key={stage.id} className="relative">
              <RecordingStage
                stage={stage}
                isActive={index === currentStage}
                isComplete={!!recordings[stage.key]}
                isNext={index === nextUnrecordedStage}
                onRecord={(audioData: string) => {
                  setRecordings(prev => ({
                    ...prev,
                    [stage.key]: audioData
                  }));
                  // Auto-advance to next unrecorded stage after successful recording
                  if (index < stages.length - 1) {
                    setTimeout(() => setCurrentStage(index + 1), 1000);
                  }
                }}
                onClick={() => setCurrentStage(index)}
                onReRecord={() => {
                  setRecordings(prev => {
                    const newRecordings = { ...prev };
                    delete newRecordings[stage.key];
                    return newRecordings;
                  });
                  setCurrentStage(index);
                }}
                recordings={recordings}
              />
            </div>
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

// FlashcardScreen Component
const FlashcardScreen: React.FC<FlashcardScreenProps> = memo(({ name, recordings, onReset }) => {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const letters = name.split('');

  const playAudio = (key: string) => {
    if (!recordings[key]) {
      console.warn(`No recording found for key: ${key}`);
      return;
    }
    const audio = new Audio(recordings[key]);
    audio.play().catch(err => {
      console.error('Audio playback failed:', err);
      alert('Unable to play audio. Check your device volume or silent mode.');
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' && currentLetterIndex < letters.length - 1) {
      setCurrentLetterIndex(currentLetterIndex + 1);
    } else if (e.key === 'ArrowLeft' && currentLetterIndex > 0) {
      setCurrentLetterIndex(currentLetterIndex - 1);
    } else if (e.key === 'Enter') {
      playAudio(`letter-${currentLetterIndex}`);
    }
  };

  return (
    <div
      className="min-h-screen p-4 flex items-center justify-center"
      tabIndex={0}
      onKeyDown={handleKeyPress}
      aria-label="Flashcard navigation"
    >
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {name}'s Flashcards
        </h2>

        <div className="text-center mb-8">
          <span
            className="text-9xl font-bold text-purple-600 animate-pulse"
            aria-label={`Current letter: ${letters[currentLetterIndex]}`}
          >
            {letters[currentLetterIndex]}
          </span>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => playAudio('fullname')}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 flex items-center gap-2"
            aria-label="Play full name"
          >
            <Volume2 size={20} aria-hidden="true" /> Name
          </button>

          <button
            onClick={() => playAudio(`letter-${currentLetterIndex}`)}
            className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 flex items-center gap-2"
            aria-label="Play letter sound"
          >
            <Volume2 size={20} aria-hidden="true" />
            <span>Play Letter Sound</span>
          </button>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => playAudio('question')}
            className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 flex items-center gap-2"
            aria-label="Play name question"
          >
            <Volume2 size={20} aria-hidden="true" /> Question
          </button>

          <button
            onClick={() => playAudio('sentence')}
            className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 flex items-center gap-2"
            aria-label="Play sentence"
          >
            <Moon size={20} aria-hidden="true" /> Sentence
          </button>

          <button
            onClick={() => playAudio('rhyme')}
            className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 flex items-center gap-2"
            aria-label="Play fun rhyme"
          >
            <Music size={20} aria-hidden="true" /> Rhyme
          </button>
        </div>

        <div className="flex justify-between mb-6">
          <div className="flex flex-col items-center">
            <button
              onClick={() => setCurrentLetterIndex(currentLetterIndex - 1)}
              disabled={currentLetterIndex === 0}
              className={`p-3 rounded-xl ${
                currentLetterIndex === 0
                  ? 'bg-gray-300 text-gray-500'
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
              aria-label="Previous letter"
            >
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
            <span className="text-sm text-gray-600 mt-2 font-medium">Previous Letter</span>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => setCurrentLetterIndex(currentLetterIndex + 1)}
              disabled={currentLetterIndex === letters.length - 1}
              className={`p-3 rounded-xl ${
                currentLetterIndex === letters.length - 1
                  ? 'bg-gray-300 text-gray-500'
                  : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}
              aria-label="Next letter"
            >
              <ArrowRight size={24} aria-hidden="true" />
            </button>
            <span className="text-sm text-gray-600 mt-2 font-medium">Next Letter</span>
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 mb-4"
          aria-label="Start over and clear all data"
        >
          Start Over
        </button>

        <ShareButton />
      </div>
    </div>
  );
});

// App Component
const App = () => {
  const [step, setStep] = useState<'welcome' | 'recording' | 'flashcards'>('welcome');
  const [name, setName] = useState<string | null>(null);
  const [recordings, setRecordings] = useState<Record<string, string>>({});
  const [showGuide, setShowGuide] = useState(false);
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ message: '', type: 'info', show: false });

  useEffect(() => {
    const loadData = async () => {
      try {
        let loadedRecordings: Record<string, string> = {};

        try {
          const db = await openDB('MyNameIsDB', 1, {
            upgrade(db) {
              db.createObjectStore('recordings');
            },
          });
          const savedRecordings = await db.getAll('recordings');
          for (const { key, value } of savedRecordings) {
            loadedRecordings[key] = value;
          }
        } catch (idbError) {
          console.warn('IndexedDB failed, trying localStorage:', idbError);
          const savedRecordings = localStorage.getItem('recordings');
          if (savedRecordings) {
            try {
              loadedRecordings = JSON.parse(savedRecordings);
            } catch (parseError) {
              console.error('Failed to parse localStorage recordings:', parseError);
              loadedRecordings = {};
            }
          }
        }

        setRecordings(loadedRecordings);

        const savedName = localStorage.getItem('childName');
        if (savedName && savedName.length <= 12 && Object.keys(loadedRecordings).length > 0) {
          setName(savedName);
          setStep('flashcards');
        } else if (savedName && savedName.length > 12) {
          localStorage.removeItem('childName');
          setRecordings({});
          try {
            const db = await openDB('MyNameIsDB', 1);
            const tx = db.transaction('recordings', 'readwrite');
            await tx.objectStore('recordings').clear();
            await tx.done;
          } catch (error) {
            console.log('Cleanup completed');
          }
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (name) localStorage.setItem('childName', name);
  }, [name]);

  useEffect(() => {
    const saveRecordings = async () => {
      if (Object.keys(recordings).length === 0) return;

      try {
        try {
          const db = await openDB('MyNameIsDB', 1);
          const tx = db.transaction('recordings', 'readwrite');
          const store = tx.objectStore('recordings');
          for (const [key, value] of Object.entries(recordings)) {
            await store.put({ key, value });
          }
          await tx.done;
        } catch (idbError) {
          console.warn('IndexedDB failed, using localStorage:', idbError);
          localStorage.setItem('recordings', JSON.stringify(recordings));
        }
      } catch (err) {
        console.error('Failed to save recordings:', err);
        localStorage.setItem('recordings', JSON.stringify(recordings));
      }
    };
    saveRecordings();
  }, [recordings]);


  const handleReset = async () => {
    if (window.confirm('This will clear all recordings and data. Are you sure?')) {
      try {
        try {
          const db = await openDB('MyNameIsDB', 1);
          const tx = db.transaction('recordings', 'readwrite');
          await tx.objectStore('recordings').clear();
          await tx.done;
        } catch (idbError) {
          console.warn('IndexedDB clear failed:', idbError);
        }
        localStorage.removeItem('recordings');
        localStorage.removeItem('childName');
        localStorage.removeItem('tooltipsDismissed');
        setRecordings({});
        setName(null);
        setStep('welcome');
      } catch (err) {
        console.error('Failed to clear data:', err);
        setRecordings({});
        setName(null);
        setStep('welcome');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100">
      {showGuide && <ParentGuide onClose={() => setShowGuide(false)} />}

      {step === 'welcome' && (
        <WelcomeScreen
          onNext={(newName) => {
            setName(newName);
            setRecordings({});
            setStep('recording');
          }}
          onGuide={() => setShowGuide(true)}
        />
      )}

      {step === 'recording' && name && (
        <RecordingScreen
          name={name}
          recordings={recordings}
          setRecordings={setRecordings}
          onComplete={() => setStep('flashcards')}
          onBack={() => {
            handleReset();
          }}
        />
      )}

      {step === 'flashcards' && name && (
        <FlashcardScreen
          name={name}
          recordings={recordings}
          onReset={handleReset}
        />
      )}



      <footer className="text-center text-xs text-gray-500 py-6 px-4 mt-8">
        <div className="space-y-3">
          <div>
            <p className="text-gray-700 text-sm">The phonics app that doesn't exist on your phone</p>
            <p className="text-gray-500 text-xs">No App • No Account • No Tracking</p>
          </div>

          <div>
            <p className="text-gray-600 text-xs">First Multi-AI Endorsed App • August 2025</p>
            <p className="text-sm">🇵🇭 🇮🇳 🇳🇬 🇵🇰 🇸🇬 🇲🇾</p>
          </div>

          <div>
            <p className="text-gray-600 text-xs">
              <button
                onClick={() => setShowGitHubModal(true)}
                className="text-gray-600 underline hover:text-purple-600 transition-colors"
              >
                Open Source on GitHub
              </button> •
              <button
                onClick={() => setShowLicenseModal(true)}
                className="text-gray-600 underline hover:text-purple-600 transition-colors"
              >
                CC BY-NC-SA 4.0
              </button>
            </p>
            <p className="text-gray-600 text-xs mt-1">Created with ❤️ by BoredMama</p>
          </div>

          <div>
            <p className="text-purple-600 text-sm font-medium">Revolutionising Motherhood</p>
          </div>
        </div>
      </footer>

      {showGitHubModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowGitHubModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">🔗</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Open Source</h2>
                </div>
                <button
                  onClick={() => setShowGitHubModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">MyNameIsApp on GitHub</h3>
                <p className="text-gray-700 text-sm mb-4">
                  Explore the complete source code, contribute features, or learn how we built this privacy-first app.
                </p>
                <a
                  href="https://github.com/Respect4Code/my-name-is-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  <span className="mr-2">🔗</span>
                  Visit GitHub Repository
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLicenseModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowLicenseModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">⚖️</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">License</h2>
                </div>
                <button
                  onClick={() => setShowLicenseModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Creative Commons BY-NC-SA 4.0</h3>
                <p className="text-gray-700 text-sm mb-4">
                  This app is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0.
                </p>
                <a
                  href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <span className="mr-2">🔗</span>
                  Read Full License
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;