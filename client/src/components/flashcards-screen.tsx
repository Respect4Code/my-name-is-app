import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, RotateCcw, Volume2, Settings as SettingsIcon } from "lucide-react";
import Flashcard from "./flashcard";
import { useSpeech } from "@/hooks/use-speech";
import { useSwipe } from "@/hooks/use-swipe";
import { generatePhonicsData } from "@/lib/phonics";
import type { Settings as SettingsType } from "@/pages/home";

interface FlashcardsScreenProps {
  name: string;
  onGoBack: () => void;
  onOpenSettings: () => void;
  onStartChildInteraction: () => void;
  settings: SettingsType;
}

export default function FlashcardsScreen({ 
  name, 
  onGoBack, 
  onOpenSettings, 
  onStartChildInteraction,
  settings 
}: FlashcardsScreenProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Ensure we have a valid name
  if (!name || name.trim().length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-600 p-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <p>No name provided. Please go back and enter a name.</p>
          <Button onClick={onGoBack} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  console.log('💳 FlashcardsScreen - name:', name, 'currentCardIndex:', currentCardIndex);

  const nameLetters = name.split('');
  const totalCards = nameLetters.length;
  const phonicsData = generatePhonicsData(name);

  console.log('💳 FlashcardsScreen - phonicsData:', phonicsData, 'totalCards:', totalCards);

  // Ensure currentCardIndex is within bounds
  const safeCardIndex = Math.min(Math.max(0, currentCardIndex), totalCards - 1);
  const currentPhonics = phonicsData[safeCardIndex];

  console.log('💳 FlashcardsScreen - safeCardIndex:', safeCardIndex, 'currentPhonics:', currentPhonics);

  // Create safe phonics data with fallback
  let safeCurrentPhonics = currentPhonics;
  if (!safeCurrentPhonics || !safeCurrentPhonics.letter) {
    console.error('💳 Missing phonics data for card index:', safeCardIndex, 'name:', name, 'phonicsData:', phonicsData);
    const fallbackLetter = nameLetters[safeCardIndex] || 'A';
    safeCurrentPhonics = {
      letter: fallbackLetter,
      sound: fallbackLetter.toLowerCase(),
      ipa: `/${fallbackLetter.toLowerCase()}/`,
      position: 'any',
      examples: [fallbackLetter.toLowerCase()],
      description: `${fallbackLetter} sound`
    };
    console.log('💳 Using fallback phonics:', safeCurrentPhonics);
  } else {
    console.log('💳 Using normal phonics:', safeCurrentPhonics);
  }

  const { speak, isPlaying } = useSpeech(settings.speechRate);

  const goToNextCard = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const goToPrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const resetToStart = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);

    if (!isFlipped && settings.speechMode && safeCurrentPhonics?.letter && safeCurrentPhonics?.sound) {
      const soundText = `${safeCurrentPhonics.letter} makes the sound ${safeCurrentPhonics.sound}`;
      speak(soundText);
    }
  };

  const playSound = () => {
    if (settings.speechMode && safeCurrentPhonics?.letter && safeCurrentPhonics?.sound) {
      const soundText = `${safeCurrentPhonics.letter} makes the sound ${safeCurrentPhonics.sound}`;
      speak(soundText);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevCard();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNextCard();
          break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          flipCard();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          resetToStart();
          break;
        case 'Escape':
          e.preventDefault();
          onGoBack();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCardIndex, isFlipped]);

  // Swipe gestures
  const swipeHandlers = useSwipe({
    onSwipeLeft: goToNextCard,
    onSwipeRight: goToPrevCard,
  });

  const progressPercentage = ((currentCardIndex + 1) / totalCards) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-600 p-4" {...swipeHandlers}>
      {/* Live region for screen readers */}
      <div id="live-region" className="sr-only" aria-live="polite" aria-atomic="true">
        Card {currentCardIndex + 1} of {totalCards}. Letter {safeCurrentPhonics.letter} in position {safeCurrentPhonics.position} of {name}.
      </div>

      {/* Header with Navigation */}
      <header className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={onGoBack}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
          aria-label="Go back to name input"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>

        <div className="text-center text-white">
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-white/80">
            {currentCardIndex + 1} of {totalCards}
          </p>
        </div>

        <div className="flex space-x-2">
            <Button
              onClick={onStartChildInteraction}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium"
              aria-label="Start child interaction"
            >
              <span className="mr-2">👦</span>
              Child Mode
            </Button>

            <Button
              variant="ghost"
              onClick={onOpenSettings}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
              aria-label="Open settings"
            >
              <SettingsIcon className="w-5 h-5" />
              Settings
            </Button>
          </div>
      </header>

      {/* Main Flashcard Area */}
      <main id="main-content" className="max-w-2xl mx-auto">
        {/* Name Display with Letter Highlighting */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8 text-center">
          <div className="text-white/80 text-lg mb-2">Learning the name:</div>
          <div className="flex justify-center items-center gap-1 text-3xl font-bold">
            {nameLetters.map((letter, index) => (
              <span
                key={index}
                className={`px-3 py-2 rounded-lg ${
                  index === currentCardIndex
                    ? 'bg-white/30 text-white border-2 border-white/50'
                    : 'text-white/60'
                }`}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        {/* Flashcard Container */}
        <div className="perspective-1000 mb-8">
          <Flashcard 
          phonics={safeCurrentPhonics}
          name={name}
          isFlipped={isFlipped}
          onFlip={flipCard}
          isPlaying={isPlaying}
          settings={settings}
        />
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={goToPrevCard}
            disabled={currentCardIndex === 0}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Previous card"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={resetToStart}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
              aria-label="Reset to first card"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>

            <Button
              variant="ghost"
              onClick={playSound}
              className={`bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 ${
                isPlaying ? 'sound-indicator playing' : 'sound-indicator'
              }`}
              aria-label="Play current letter sound"
            >
              <Volume2 className="w-5 h-5 mr-2" />
              Play Sound
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={goToNextCard}
            disabled={currentCardIndex === totalCards - 1}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Next card"
          >
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progressPercentage} className="h-3 bg-white/20" />
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white/80 text-sm">
          <div className="font-medium mb-2">Keyboard Shortcuts:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>← → Arrow keys: Navigate</div>
            <div>Space/Enter: Flip card</div>
            <div>R: Reset to start</div>
            <div>Esc: Go back</div>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-white/60 py-2 mt-4">
        Created with ❤️ by BoredMamaApp • CC BY-NC-SA 4.0
      </footer>
    </div>
  );
}