
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
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  
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

      {/* Clean Minimal Footer */}
      <footer 
        style={{
          textAlign: "center",
          fontSize: "0.75rem",
          marginTop: "3rem",
          padding: "24px 16px",
          color: "#6B7280"
        }}
      >
        <div style={{ marginBottom: "16px" }}>
          <p style={{ margin: "0", fontSize: "0.75rem", color: "#374151" }}>
            The phonics app that doesn't exist on your phone
          </p>
          <p style={{ margin: "4px 0 0 0", fontSize: "0.7rem", color: "#9CA3AF" }}>
            No App • No Account • No Tracking
          </p>
        </div>
        
        <div style={{ marginBottom: "16px" }}>
          <p style={{ margin: "0", fontSize: "0.7rem", color: "#6B7280" }}>
            First Multi-AI Endorsed App • August 2025
          </p>
          <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem" }}>
            🇵🇭 🇮🇳 🇳🇬 🇵🇰 🇸🇬 🇲🇾
          </p>
        </div>
        
        <div style={{ marginBottom: "16px" }}>
          <p style={{ margin: "0", fontSize: "0.7rem", color: "#6B7280" }}>
            <button
              onClick={() => setShowGitHubModal(true)}
              style={{ 
                color: "#6B7280", 
                textDecoration: "underline", 
                border: "none", 
                background: "none", 
                cursor: "pointer", 
                fontSize: "inherit",
                fontFamily: "inherit"
              }}
            >
              Open Source on GitHub
            </button> • 
            <button
              onClick={() => setShowLicenseModal(true)}
              style={{ 
                color: "#6B7280", 
                textDecoration: "underline", 
                border: "none", 
                background: "none", 
                cursor: "pointer", 
                fontSize: "inherit",
                fontFamily: "inherit"
              }}
            >
              CC BY-NC-SA 4.0
            </button>
          </p>
          <p style={{ margin: "4px 0 0 0", fontSize: "0.7rem", color: "#6B7280" }}>
            Created with ❤️ by BoredMama
          </p>
        </div>
        
        <div>
          <p style={{ margin: "0", fontSize: "0.75rem", color: "#8B5CF6", fontWeight: "500" }}>
            Revolutionising Motherhood
          </p>
        </div>
          <span style={{ color: "#8B5CF6", fontWeight: "500", fontSize: "0.8rem" }}>Revolutionising Motherhood</span>
        </p>
      </footer>

      {/* GitHub Modal */}
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
              
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-900">✨ Features</h4>
                  <ul className="ml-4 space-y-1 list-disc">
                    <li>100% privacy-first design</li>
                    <li>Family voice recording system</li>
                    <li>Offline-capable PWA</li>
                    <li>Accessibility features</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">🤝 Contributing</h4>
                  <p>We welcome contributions! Fork the repo and submit pull requests.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* License Modal */}
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
              
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-900">✅ You are free to:</h4>
                  <ul className="ml-4 space-y-1 list-disc">
                    <li><strong>Share</strong> — copy and redistribute the material</li>
                    <li><strong>Adapt</strong> — remix, transform, and build upon the material</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">📋 Under these terms:</h4>
                  <ul className="ml-4 space-y-1 list-disc">
                    <li><strong>Attribution</strong> — You must give appropriate credit</li>
                    <li><strong>NonCommercial</strong> — Not for commercial purposes</li>
                    <li><strong>ShareAlike</strong> — Distribute under same license</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
