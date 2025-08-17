import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import {
  Info, ChevronRight, ArrowLeft, Volume2, BookOpen, Moon, Music, Loader2, ArrowRight, ChevronLeft,
  CheckCircle, Mic, Square, RefreshCw, Play, Share2, HelpCircle, X, ChevronDown
} from 'lucide-react';

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

// Welcome Screen Component
const WelcomeScreen = memo(({ onNext, onGuide }) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      localStorage.setItem('childName', name.trim());
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        <BoredMamaLogo />
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">My Name Is</h1>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-center">What's your child's name?</h2>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name here"
            className="w-full p-4 border-2 border-purple-200 rounded-xl text-lg mb-4 focus:border-purple-500 focus:outline-none"
            maxLength={26}
          />

          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white py-4 rounded-xl text-lg font-semibold"
          >
            Start Learning
          </button>
        </div>

        <button
          onClick={onGuide}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold"
        >
          Parent Guide
        </button>
      </div>
    </div>
  );
});

// Flashcards Screen Component
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