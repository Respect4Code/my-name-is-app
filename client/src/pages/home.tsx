import { useState, useEffect } from "react";
import WelcomeScreen from "@/components/welcome-screen";
import FlashcardsScreen from "@/components/flashcards-screen";
import SettingsModal from "@/components/settings-modal";
import { useLocalStorage } from "@/hooks/use-local-storage";

export interface Settings {
  speechMode: boolean;
  visualMode: boolean;
  animations: boolean;
  speechRate: number;
  highContrast: boolean;
}

const defaultSettings: Settings = {
  speechMode: true,
  visualMode: false,
  animations: true,
  speechRate: 0.8,
  highContrast: false,
};

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'flashcards'>('welcome');
  const [currentName, setCurrentName] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useLocalStorage<Settings>('mynameIs_settings', defaultSettings);
  const [recentNames, setRecentNames] = useLocalStorage<string[]>('mynameIs_recentNames', []);

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

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  return (
    <div className="min-h-screen">
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onCreateFlashcards={handleCreateFlashcards}
          onOpenSettings={handleOpenSettings}
          recentNames={recentNames}
        />
      )}
      
      {currentScreen === 'flashcards' && (
        <FlashcardsScreen
          name={currentName}
          onGoBack={handleGoBack}
          onOpenSettings={handleOpenSettings}
          settings={settings}
        />
      )}
      
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
}
