
import { useState, useEffect } from "react";
import WelcomeScreen from "@/components/welcome-screen";
import FlashcardsScreen from "@/components/flashcards-screen";
import ChildInteractionScreen from "@/components/child-interaction-screen";
import SettingsModal from "@/components/settings-modal";
import { useLocalStorage } from "@/hooks/use-local-storage";

export interface Settings {
  speechMode: boolean;
  visualMode: boolean;
  animations: boolean;
  speechRate: number;
  highContrast: boolean;
  deafMode: boolean;
}

const defaultSettings: Settings = {
  speechMode: true,
  visualMode: false,
  animations: true,
  speechRate: 0.8,
  highContrast: false,
  deafMode: false,
};

export default function Home() {
  console.log('🏠 Home component initializing...');
  
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'recording' | 'flashcards' | 'child-interaction'>('welcome');
  const [currentName, setCurrentName] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  console.log('🏠 About to initialize localStorage hooks...');
  const [settings, setSettings] = useLocalStorage<Settings>('mynameIs_settings', defaultSettings);
  const [recentNames, setRecentNames] = useLocalStorage<string[]>('mynameIs_recentNames', []);
  console.log('🏠 localStorage hooks initialized successfully');

  useEffect(() => {
    // Apply high contrast mode
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Apply reduced motion
    if (!settings.animations) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [settings.highContrast, settings.animations]);

  const handleCreateFlashcards = (name: string) => {
    const cleanName = name.trim().toUpperCase();
    if (cleanName && cleanName.length >= 2 && cleanName.length <= 12) {
      setCurrentName(cleanName);
      setCurrentScreen('flashcards');

      // Add to recent names
      const updatedRecent = [cleanName, ...recentNames.filter(n => n !== cleanName)].slice(0, 5);
      setRecentNames(updatedRecent);
    }
  };

  const handleGoBack = () => {
    setCurrentScreen('welcome');
    setCurrentName('');
  };

  const handleStartChildInteraction = () => {
    setCurrentScreen('child-interaction');
  };

  const handleChildInteractionComplete = () => {
    setCurrentScreen('flashcards');
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  console.log('🏠 Rendering Home component, currentScreen:', currentScreen);
  
  return (
    <div className="min-h-screen">
      {currentScreen === 'welcome' && (
        <>
          {console.log('🏠 Rendering WelcomeScreen...')}
          <WelcomeScreen
            onCreateFlashcards={handleCreateFlashcards}
            onOpenSettings={handleOpenSettings}
            recentNames={recentNames}
          />
        </>
      )}

      {currentScreen === 'child-interaction' && (
        <ChildInteractionScreen
          name={currentName}
          onComplete={handleChildInteractionComplete}
          onGoBack={handleGoBack}
          settings={settings}
        />
      )}

      {currentScreen === 'flashcards' && (
        <FlashcardsScreen
          name={currentName}
          onGoBack={handleGoBack}
          onOpenSettings={handleOpenSettings}
          onStartChildInteraction={handleStartChildInteraction}
          settings={settings}
        />
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />

      {/* Creative Commons Footer */}
      {/* AI Endorsements Section */}
      <section className="endorsements mt-12 mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Endorses Privacy</h2>
          <p className="text-gray-600">When three leading AI systems praise your privacy-first approach</p>
        </div>
        
        {/* Square version for main display */}
        <div className="flex justify-center mb-6">
          <img 
            src="/ai_endorsements_mynameisapp.png" 
            alt="AI Endorsements for MyNameIsApp - Claude AI, Grok AI, and ChatGPT praise the privacy-first phonics learning approach" 
            className="max-w-full w-full max-w-md rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          />
        </div>
        
        {/* Horizontal version for social sharing */}
        <div className="flex justify-center mb-6">
          <img 
            src="/ai_endorsements_horizontal.png" 
            alt="Horizontal AI Endorsements - Perfect for social media sharing" 
            className="max-w-full w-full max-w-2xl rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          />
        </div>

        {/* Social sharing buttons */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">Share the AI-endorsed privacy revolution:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <a
              href="https://twitter.com/intent/tweet?text=Even%20AI%20systems%20endorse%20MyNameIsApp's%20privacy-first%20approach!%20✨&url=https://mynameisapp.co.uk&hashtags=PrivacyFirst,PhonicsLearning,AIEndorsed"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              Share on Twitter
            </a>
            <a
              href="https://www.facebook.com/sharer/sharer.php?u=https://mynameisapp.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Share on Facebook
            </a>
            <a
              href="https://www.linkedin.com/sharing/share-offsite/?url=https://mynameisapp.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm"
            >
              Share on LinkedIn
            </a>
          </div>
        </div>
      </section>

      <div className="text-center text-xs text-gray-500 mt-8 mb-4">
        <p>Join the Global Phonics Revolution 🌍</p>
        <p>
          Open Source view on{' '}
          <a 
            href="https://github.com/Respect4Code/my-name-is-app" 
            target="_blank" 
            rel="noopener" 
            className="text-blue-600 hover:text-blue-400 underline hover:no-underline transition-colors"
          >
            GitHub
          </a>{' '}
          • Translate to Tagalog, Hindi, or your language • Share with your community
        </p>
        <p>Trusted by parents in: 🇵🇭 Philippines, 🇮🇳 India, 🇳🇬 Nigeria, 🇵🇰 Pakistan, 🇸🇬 Singapore, 🇲🇾 Malaysia</p>
        <p>
          <a 
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/" 
            target="_blank"
            rel="noopener"
            className="text-blue-600 hover:text-blue-400 underline hover:no-underline transition-colors"
          >
            CC BY-NC-SA 4.0
          </a>
        </p>
        <p className="text-[10px] mt-1">© {new Date().getFullYear()} MyNameIsApp • Made with love in the UK</p>
        <p className="text-[10px] text-gray-400">v1.0.2 — Global SEO Launch Edition</p>
      </div>
    </div>
  );
}
