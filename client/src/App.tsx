
import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { Info, ChevronRight, ArrowLeft, Volume2, BookOpen, Moon, Music, Loader2, ArrowRight, ChevronLeft, CheckCircle, Mic, Square, RefreshCw, Play, Share2, HelpCircle, X, ChevronDown, Settings } from 'lucide-react';

// BoredMama logo component
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

// Welcome Screen Component with Secret Features
const WelcomeScreen = memo(({ onNext, onGuide, onMode }) => {
  const [name, setName] = useState('');
  const [showSecretMenu, setShowSecretMenu] = useState(false);
  const [infoPressing, setInfoPressing] = useState(false);
  const [infoPressTimer, setInfoPressTimer] = useState(null);

  const handleInfoPressStart = () => {
    setInfoPressing(true);
    const timer = setTimeout(() => {
      setShowSecretMenu(true);
    }, 3000);
    setInfoPressTimer(timer);
  };

  const handleInfoPressEnd = () => {
    setInfoPressing(false);
    if (infoPressTimer) {
      clearTimeout(infoPressTimer);
      setInfoPressTimer(null);
    }
  };

  const handleSubmit = () => {
    if (name.trim()) {
      localStorage.setItem('childName', name.trim());
      onNext();
    }
  };

  const handleModeSelect = (mode) => {
    if (name.trim()) {
      localStorage.setItem('childName', name.trim());
      onMode(mode);
    }
    setShowSecretMenu(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4 relative">
      <div className="max-w-md mx-auto pt-8">
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-lg"
          onMouseDown={handleInfoPressStart}
          onMouseUp={handleInfoPressEnd}
          onTouchStart={handleInfoPressStart}
          onTouchEnd={handleInfoPressEnd}
        >
          <Info className={`w-6 h-6 ${infoPressing ? 'text-purple-600' : 'text-gray-600'}`} />
        </button>

        <BoredMamaLogo />
        
        {showSecretMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">SECRET FEATURES</h3>
                <button onClick={() => setShowSecretMenu(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleModeSelect('actions')}
                  className="w-full p-3 bg-purple-100 rounded-xl text-left flex items-center gap-3"
                >
                  <span className="text-2xl">🎬</span>
                  <span className="font-semibold">Action Words Mode</span>
                </button>
                
                <button
                  onClick={() => handleModeSelect('alphabet')}
                  className="w-full p-3 bg-blue-100 rounded-xl text-left flex items-center gap-3"
                >
                  <span className="text-2xl">🔤</span>
                  <span className="font-semibold">Alphabet Mode</span>
                </button>
                
                <button
                  onClick={() => handleModeSelect('numbers')}
                  className="w-full p-3 bg-green-100 rounded-xl text-left flex items-center gap-3"
                >
                  <span className="text-2xl">🔢</span>
                  <span className="font-semibold">Numbers Mode</span>
                </button>
                
                <button
                  onClick={() => handleModeSelect('grandparent')}
                  className="w-full p-3 bg-yellow-100 rounded-xl text-left flex items-center gap-3"
                >
                  <span className="text-2xl">👴</span>
                  <span className="font-semibold">Grandparent Mode</span>
                </button>
                
                <button
                  onClick={() => handleModeSelect('vip')}
                  className="w-full p-3 bg-pink-100 rounded-xl text-left flex items-center gap-3"
                >
                  <span className="text-2xl">🔒</span>
                  <span className="font-semibold">VIP Mode</span>
                </button>
                
                <button
                  onClick={() => setShowSecretMenu(false)}
                  className="w-full p-3 bg-gray-100 rounded-xl text-left flex items-center gap-3"
                >
                  <span className="text-2xl">🏠</span>
                  <span className="font-semibold">Back to Standard</span>
                </button>
              </div>
              
              <p className="text-sm text-center text-purple-600 mt-4">
                Need help? Read 4-minute guide
              </p>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">My Name Is</h1>
        <p className="text-center text-gray-600 mb-6">
          Teach your child their name with YOUR voice
        </p>
        <p className="text-center text-purple-600 mb-6 text-sm">
          ⭐ "My 18-month-old learned all letters phonetically!" - Real parent
        </p>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-center">What's your child's name?</h2>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your child's name"
            className="w-full p-4 border-2 border-purple-200 rounded-xl text-lg mb-4 focus:border-purple-500 focus:outline-none"
            maxLength={26}
          />

          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white py-4 rounded-xl text-lg font-semibold mb-4"
          >
            Next →
          </button>
        </div>

        <p className="text-center text-purple-600 mb-4">
          Need help? Read 4-minute guide
        </p>

        <button
          onClick={onGuide}
          className="w-full bg-white border-2 border-purple-200 text-purple-600 py-3 rounded-xl font-semibold mb-4"
        >
          Share with friends & family 🔗
        </button>
      </div>
    </div>
  );
});

// Action Words Mode Component
const ActionWordsMode = memo(({ name, onBack }) => {
  const [currentScreen, setCurrentScreen] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recordingStage, setRecordingStage] = useState('word');
  const [currentWord, setCurrentWord] = useState('');

  const categories = {
    daily: {
      name: 'Daily Actions',
      emoji: '🍽️',
      description: 'eating, drinking, brushing...',
      words: ['eating', 'drinking', 'brushing', 'washing', 'sleeping', 'waking']
    },
    movement: {
      name: 'Movement',
      emoji: '🏃',
      description: 'running, jumping, walking...',
      words: ['running', 'jumping', 'walking', 'dancing', 'swimming', 'climbing']
    },
    hands: {
      name: 'Hand Actions',
      emoji: '✋',
      description: 'clapping, waving, grabbing...',
      words: ['clapping', 'waving', 'grabbing', 'pointing', 'drawing', 'writing']
    },
    emotions: {
      name: 'Emotions',
      emoji: '😊',
      description: 'laughing, smiling, crying...',
      words: ['laughing', 'smiling', 'crying', 'singing', 'shouting', 'whispering']
    },
    creative: {
      name: 'Creative',
      emoji: '🎨',
      description: 'drawing, painting, building...',
      words: ['drawing', 'painting', 'building', 'creating', 'making', 'designing']
    },
    playing: {
      name: 'Playing',
      emoji: '🎮',
      description: 'hiding, seeking, throwing...',
      words: ['hiding', 'seeking', 'throwing', 'catching', 'rolling', 'bouncing']
    }
  };

  if (currentScreen === 'categories') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4">
        <div className="max-w-md mx-auto pt-8">
          <BoredMamaLogo />
          
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">My Name Is</h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🎬</span>
            <span className="text-lg font-semibold text-purple-600">Action Words Mode</span>
          </div>
          
          <p className="text-center text-gray-600 mb-4">
            Learn action words ending in -ING with YOUR voice!
          </p>
          
          <p className="text-center text-purple-600 mb-6 text-sm">
            ⭐ "My toddler loves learning action words!" - Happy parent
          </p>

          <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎬</span>
              <span className="font-semibold text-lg">Choose a Category</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedCategory(key);
                    setCurrentScreen('words');
                  }}
                  className="p-4 border-2 border-purple-200 rounded-xl hover:border-purple-400 transition-colors"
                >
                  <div className="text-3xl mb-2">{category.emoji}</div>
                  <div className="font-semibold mb-1">{category.name}</div>
                  <div className="text-sm text-gray-600">{category.description}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold mb-4"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'words' && selectedCategory) {
    const category = categories[selectedCategory];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4">
        <div className="max-w-md mx-auto pt-8">
          <BoredMamaLogo />
          
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">My Name Is</h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🎬</span>
            <span className="text-lg font-semibold text-purple-600">Action Words Mode</span>
          </div>
          
          <p className="text-center text-gray-600 mb-4">
            Learn action words ending in -ING with YOUR voice!
          </p>
          
          <p className="text-center text-purple-600 mb-6 text-sm">
            ⭐ "My toddler loves learning action words!" - Happy parent
          </p>

          <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
            <button
              onClick={() => setCurrentScreen('categories')}
              className="flex items-center gap-2 mb-4 text-gray-600"
            >
              ← Back to Categories
            </button>
            
            <h2 className="text-xl font-bold mb-4">{category.name}</h2>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {category.words.map((word) => (
                <button
                  key={word}
                  onClick={() => {
                    setCurrentWord(word);
                    setCurrentScreen('recording');
                  }}
                  className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  {word}
                </button>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <p className="text-center text-gray-600 mb-3">or</p>
              <input
                type="text"
                placeholder="Type your own -ING word (e.g., clapping)"
                className="w-full p-3 border border-gray-300 rounded-lg mb-3"
              />
              <div className="flex gap-2">
                <button className="flex-1 bg-purple-500 text-white py-2 rounded-lg font-semibold">
                  Record Typed Word →
                </button>
                <button className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold">
                  Record All in Category →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'recording' && currentWord) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4">
        <div className="max-w-md mx-auto pt-8">
          <BoredMamaLogo />
          
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">My Name Is</h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🎬</span>
            <span className="text-lg font-semibold text-purple-600">Action Words Mode</span>
          </div>
          
          <p className="text-center text-gray-600 mb-4">
            Learn action words ending in -ING with YOUR voice!
          </p>
          
          <p className="text-center text-purple-600 mb-6 text-sm">
            ⭐ "My toddler loves learning action words!" - Happy parent
          </p>

          <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
            <button
              onClick={() => setCurrentScreen('words')}
              className="flex items-center gap-2 mb-4 text-gray-600"
            >
              ← Back
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-purple-600 mb-2">
                Record word: {currentWord}
              </h2>
              <p className="text-lg text-gray-700">{currentWord} (3/6)</p>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-purple-500 text-white py-4 rounded-xl text-lg font-semibold">
                🎤 Record WORD →
              </button>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold mb-2">Sentence</h3>
                <p className="text-gray-700 mb-3">We are {currentWord}.</p>
                <button className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold">
                  🎤 Record SENTENCE →
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold mb-2">Rhyme</h3>
                <p className="text-gray-700 mb-3">
                  {currentWord} {currentWord}, {currentWord} all day — {currentWord} {currentWord}, hip-hip-hooray!
                </p>
                <button className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold">
                  🎤 Record RHYME →
                </button>
              </div>
              
              <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold">
                ▶ Play All Words 2/6
              </button>
              
              <button className="w-full bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold">
                Next Word →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
});

// Standard Flashcards Screen Component (original functionality)
const FlashcardsScreen = memo(({ name, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const letters = name.toUpperCase().split('');

  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const nextCard = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % letters.length);
  }, [letters.length]);

  const prevCard = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + letters.length) % letters.length);
  }, [letters.length]);

  const currentLetter = letters[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4">
      <div className="max-w-md mx-auto pt-8">
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
          <div className="w-48 h-48 mx-auto flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl mb-6">
            <span className="text-8xl font-bold text-purple-800">{currentLetter}</span>
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
      </div>
    </div>
  );
});

// Parent Guide Screen Component
const ParentGuideScreen = memo(({ onBack }) => (
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

// Main App Component
const App = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [currentMode, setCurrentMode] = useState('standard');
  const [childName, setChildName] = useState('');

  // Load saved data on mount
  useEffect(() => {
    const savedName = localStorage.getItem('childName');
    if (savedName) {
      setChildName(savedName);
    }
  }, []);

  const handleNext = useCallback(() => {
    const name = localStorage.getItem('childName');
    if (name) {
      setChildName(name);
      setCurrentScreen('flashcards');
    }
  }, []);

  const handleBack = useCallback(() => {
    setCurrentScreen('welcome');
    setCurrentMode('standard');
  }, []);

  const handleGuide = useCallback(() => {
    setCurrentScreen('guide');
  }, []);

  const handleModeSelect = useCallback((mode) => {
    const name = localStorage.getItem('childName');
    if (name) {
      setChildName(name);
      setCurrentMode(mode);
      setCurrentScreen('mode');
    }
  }, []);

  if (currentScreen === 'guide') {
    return <ParentGuideScreen onBack={handleBack} />;
  }

  if (currentScreen === 'mode' && currentMode === 'actions' && childName) {
    return (
      <ActionWordsMode
        name={childName}
        onBack={handleBack}
      />
    );
  }

  if (currentScreen === 'flashcards' && childName) {
    return (
      <FlashcardsScreen
        name={childName}
        onBack={handleBack}
      />
    );
  }

  return (
    <WelcomeScreen
      onNext={handleNext}
      onGuide={handleGuide}
      onMode={handleModeSelect}
    />
  );
};

export default App;
