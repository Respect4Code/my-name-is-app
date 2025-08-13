import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Mic } from "lucide-react";
import { useParentRecordings } from "@/hooks/use-parent-recordings";
import TestRecording from "./test-recording";

interface WelcomeScreenProps {
  onCreateFlashcards: (name: string) => void;
  onOpenSettings: () => void;
  recentNames: string[];
}

export default function WelcomeScreen({ onCreateFlashcards, onOpenSettings, recentNames }: WelcomeScreenProps) {
  console.log('👋 WelcomeScreen component initializing...');
  const [nameInput, setNameInput] = useState("");
  
  console.log('👋 About to initialize useParentRecordings hook...');
  const { getCompletionStatus } = useParentRecordings();
  console.log('👋 useParentRecordings hook initialized successfully');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onCreateFlashcards(nameInput);
    }
  };

  const handleExampleClick = (name: string) => {
    setNameInput(name);
    onCreateFlashcards(name);
  };

  const handleRecentClick = (name: string) => {
    setNameInput(name);
    onCreateFlashcards(name);
  };

  const exampleNames = ["DIVINE", "ZARA", "MICHAEL", "SOPHIA"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
        {/* Skip link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded-lg z-50"
        >
          Skip to main content
        </a>
        
        {/* BoredMama Logo */}
        <div className="mb-6 flex justify-center">
          <div 
            className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded-2xl shadow-lg"
            style={{ 
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
            }}
          >
            <span className="text-white font-bold text-lg tracking-wide">BoredMama</span>
          </div>
        </div>
        
        {/* App Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4 tracking-tight">
          My Name Is
        </h1>
        
        {/* App Description */}
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          Create personalized phonics flashcards from any name! Perfect for learning letter sounds and building reading skills.
        </p>
        
        {/* Name Input Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="Enter a name..."
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full p-4 text-2xl text-center border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300"
              maxLength={12}
              aria-label="Enter name for flashcards"
              autoFocus
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              {nameInput.length}/12
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
            disabled={!nameInput.trim() || nameInput.trim().length < 2}
            aria-label="Create flashcards"
          >
            Create Flashcards! 🚀
          </Button>
        </form>
        
        {/* Recent Names Section */}
        {recentNames.length > 0 && (
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-3">Recent names:</div>
            <div className="flex flex-wrap justify-center gap-2">
              {recentNames.map((name) => {
                const completion = getCompletionStatus(name);
                return (
                  <div key={name} className="relative">
                    <Button
                      variant="outline"
                      onClick={() => handleRecentClick(name)}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors duration-200 border-green-200"
                    >
                      {name}
                    </Button>
                    {completion.recorded > 0 && (
                      <div className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        <Mic className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Example Names Section */}
        <div className="mb-8">
          <div className="text-sm text-gray-500 mb-3">Try these examples:</div>
          <div className="flex flex-wrap justify-center gap-2">
            {exampleNames.map((name) => (
              <Button
                key={name}
                variant="outline"
                onClick={() => handleExampleClick(name)}
                className="px-3 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors duration-200 border-purple-200"
              >
                {name}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Settings Access */}
        <Button
          variant="ghost"
          onClick={onOpenSettings}
          className="mt-4 flex items-center justify-center gap-2 mx-auto text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-lg p-2 transition-colors duration-200"
          aria-label="Open accessibility settings"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm">Accessibility Settings</span>
        </Button>
        
        {/* Test Recording Component for debugging */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Test Recording (Debug Mode)</h3>
          <TestRecording />
        </div>
      </div>
    </div>
  );
}
