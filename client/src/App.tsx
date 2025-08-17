import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
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

// RecordClip Component - content-agnostic recorder for word/sentence/rhyme
const RecordClip: React.FC<{
  title: string;
  text: string;
  onSaved: (url: string) => void;
  onBack: () => void;
}> = memo(({ title, text, onSaved, onBack }) => {
  const [rec, setRec] = useState<MediaRecorder | null>(null);
  const [audioURL, setAudioURL] = useState<string>('');
  const chunksRef = useRef<Blob[]>([]);

  // Helper to pick best MIME type for cross-platform compatibility
  const pickMimeType = useCallback(() => {
    const candidates = [
      'audio/mp4;codecs=aac',
      'audio/mp4',
      'audio/webm;codecs=opus',
      'audio/webm'
    ];
    return candidates.find(type => MediaRecorder.isTypeSupported(type)) || '';
  }, []);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = pickMimeType();
      const r = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      r.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      r.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mime || 'audio/webm' });
        // Revoke previous URL to prevent memory leaks
        if (audioURL) {
          URL.revokeObjectURL(audioURL);
        }
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      r.start();
      setRec(r);
      setTimeout(() => r.state === 'recording' && r.stop(), 15000); // 15s max
    } catch (err) {
      console.error('Recording error:', err);
      alert('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stop = () => {
    rec?.stop();
    setRec(null);
  };

  useEffect(() => {
    return () => {
      if (rec?.state === 'recording') rec.stop();
      // Cleanup object URL on unmount
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [rec, audioURL]);

  return (
    <div style={{ padding: '30px', background: '#fff0ff', borderRadius: '15px', textAlign: 'center' }}>
      <button
        onClick={onBack}
        style={{
          background: 'transparent',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        ← Back
      </button>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '28px', fontWeight: 'bold', color: '#ff00ff' }}>
        {title}
      </h2>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666', fontSize: '18px' }}>
        {text}
      </p>
      {!rec && !audioURL && (
        <button
          onClick={start}
          style={{
            width: '100%',
            padding: '15px',
            background: '#ff00ff',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <Mic size={24} /> Record (15s max)
        </button>
      )}
      {rec && (
        <button
          onClick={stop}
          style={{
            width: '100%',
            padding: '15px',
            background: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <Square size={24} /> Stop Recording
        </button>
      )}
      {audioURL && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <audio src={audioURL} controls style={{ width: '100%', marginBottom: '10px' }} />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={() => {
                setAudioURL('');
                start();
              }}
              style={{
                padding: '10px 20px',
                background: '#ff00ff',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <RefreshCw size={16} /> Re-record
            </button>
            <button
              onClick={() => onSaved(audioURL)}
              style={{
                padding: '10px 20px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <CheckCircle size={16} /> ✓ Save
            </button>
          </div>
        </div>
      )}
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
              <li>▶︎ Play button = Listen to what you just recorded</li>
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

// FlashcardsScreen Component
const FlashcardsScreen: React.FC<{ name: string; onBack: () => void; mode: string }> = memo(({ name, onBack, mode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLetter, setShowLetter] = useState(true);
  const letters = name.toUpperCase().split('');

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const nextCard = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % letters.length);
    setShowLetter(true);
  }, [letters.length]);

  const prevCard = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + letters.length) % letters.length);
    setShowLetter(true);
  }, [letters.length]);

  const toggleView = useCallback(() => {
    setShowLetter(prev => !prev);
  }, []);

  useEffect(() => {
    if (mode === 'auditory') {
      const letter = letters[currentIndex];
      speak(`The letter ${letter}`);
    }
  }, [currentIndex, letters, mode, speak]);

  const currentLetter = letters[currentIndex];

  return (
    <div className={`min-h-screen p-4 ${mode === 'visual' ? 'bg-gradient-to-br from-green-100 to-blue-100' : 'bg-gradient-to-br from-purple-100 to-pink-100'}`}>
      {/* Mode indicator banner */}
      <div className="fixed top-0 left-0 right-0 bg-purple-600 text-white text-center py-2 z-50">
        <span className="text-sm font-medium">
          {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode Active
        </span>
      </div>

      <div className="max-w-md mx-auto pt-16">
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-purple-600 hover:text-purple-800"
        >
          ← Back to Start
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Learning: {name}</h1>
          <p className="text-gray-600">Letter {currentIndex + 1} of {letters.length}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center mb-6">
          <div
            className="w-48 h-48 mx-auto flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl cursor-pointer mb-6"
            onClick={toggleView}
          >
            {showLetter ? (
              <span className="text-8xl font-bold text-purple-800">{currentLetter}</span>
            ) : (
              <span className="text-4xl">👆 Tap to see letter</span>
            )}
          </div>

          <div className="space-y-4">
            <button
              onClick={() => speak(`The letter ${currentLetter}`)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold"
            >
              🔊 Say Letter
            </button>

            <button
              onClick={() => speak(`${currentLetter} says ${currentLetter.toLowerCase()}`)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-lg font-semibold"
            >
              🎵 Say Sound
            </button>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={prevCard}
            disabled={letters.length <= 1}
            className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:opacity-50 text-white py-3 rounded-xl font-semibold"
          >
            ← Previous
          </button>
          <button
            onClick={nextCard}
            disabled={letters.length <= 1}
            className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white py-3 rounded-xl font-semibold"
          >
            Next →
          </button>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            {letters.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? 'bg-purple-500' : 'bg-purple-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

// ParentGuideScreen Component
const ParentGuideScreen: React.FC<{ onBack: () => void }> = memo(({ onBack }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-4">
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Parent Guide</h1>

      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-3">How It Works</h2>
          <p>My Name Is creates personalized phonics flashcards using your child's name. This helps them connect with the letters and sounds in a meaningful way.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Privacy First</h2>
          <p>All data stays on your device. No personal information is sent to servers. The app works completely offline after initial load.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Age Range</h2>
          <p>Designed for children aged 3-7, but can be enjoyed by learners of all ages discovering phonics.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Tips for Success</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Practice for 5-10 minutes at a time</li>
            <li>Celebrate every attempt, not just correct answers</li>
            <li>Let your child tap the cards to hear sounds</li>
            <li>Make it playful and stress-free</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
));


// App Component
const App = () => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'guide' | 'flashcards'>('welcome');
  const [childName, setChildName] = useState('');
  const [currentMode, setCurrentMode] = useState('standard');

  // Load saved data on mount
  useEffect(() => {
    const savedName = localStorage.getItem('childName');
    const savedMode = localStorage.getItem('selectedMode');

    if (savedName) {
      setChildName(savedName);
    }
    if (savedMode) {
      setCurrentMode(savedMode);
    }
  }, []);

  // Handle mode changes with useEffect to avoid TDZ
  useEffect(() => {
    if (currentMode === 'actions') {
      // Reset to welcome when actions mode is selected
      setCurrentScreen('welcome');
      setChildName('');
      localStorage.removeItem('childName');
      localStorage.removeItem('selectedMode');
      setCurrentMode('standard');
    }
  }, [currentMode]);

  const handleNext = useCallback(() => {
    const name = localStorage.getItem('childName');
    if (name) {
      setChildName(name);
      setCurrentScreen('flashcards');
    }
  }, []);

  const handleBack = useCallback(() => {
    setCurrentScreen('welcome');
  }, []);

  const handleGuide = useCallback(() => {
    setCurrentScreen('guide');
  }, []);

  if (currentScreen === 'guide') {
    return <ParentGuideScreen onBack={handleBack} />;
  }

  if (currentScreen === 'flashcards' && childName) {
    return (
      <FlashcardsScreen
        name={childName}
        onBack={handleBack}
        mode={currentMode}
      />
    );
  }

  return (
    <WelcomeScreen
      onNext={handleNext}
      onGuide={handleGuide}
    />
  );
};

export default App;