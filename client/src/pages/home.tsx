
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
      <div className="text-center text-xs text-gray-500 mt-8 mb-4">
        <p>Open Source Phonics Revolution 🌍</p>
        <p>Fork us on GitHub • Translate to your language • Share with your community</p>
        <p>Built with AI (ChatGPT, Claude, Grok, Replit) • Already adapted for: 🇵🇭 🇮🇳 🇸🇬 🇲🇾 🇳🇬 🇿🇦</p>
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" className="underline">CC BY-NC-SA 4.0</a>
        <p className="text-[10px] mt-1">© {new Date().getFullYear()} MyNameIsApp • Made with love in the UK</p>
        <p className="text-[10px] text-gray-400">v1.0.2 — Global SEO Launch Edition</p>
      </div>
    </div>
  );
}
