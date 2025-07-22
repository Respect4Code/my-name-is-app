import { PhonicsData } from "@/lib/phonics";
import type { Settings } from "@/pages/home";
import ParentRecordingButton from "./parent-recording-button";
import { useParentRecordings } from "@/hooks/use-parent-recordings";

interface FlashcardProps {
  phonics: PhonicsData;
  isFlipped: boolean;
  onFlip: () => void;
  isPlaying: boolean;
  settings: Settings;
  name: string;
}

export default function Flashcard({ phonics, isFlipped, onFlip, isPlaying, settings, name }: FlashcardProps) {
  const { getRecording } = useParentRecordings();
  const childPhoto = localStorage.getItem('childPhoto');

  // Safety check for phonics properties
  if (!phonics || !phonics.letter || !phonics.position) {
    console.error('💳 Flashcard - Invalid phonics data:', phonics);
    return (
      <div className="flip-card h-96 bg-red-100 rounded-2xl flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p>Error: Invalid phonics data</p>
          <p className="text-sm">Please go back and try again</p>
        </div>
      </div>
    );
  }

  const parentRecording = getRecording(name, phonics.letter, phonics.position);

  return (
    <div 
      className={`flip-card h-96 w-full max-w-2xl cursor-pointer ${isPlaying ? 'sound-indicator playing' : 'sound-indicator'}`}
      onClick={onFlip}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onFlip();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Flashcard for letter ${phonics.letter} - ${isFlipped ? 'showing back' : 'showing front'} - press Enter to flip`}
      aria-pressed={isFlipped}
    >
      <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* Front of Card */}
        <div className="flip-card-front bg-white rounded-2xl shadow-2xl p-6 border-4 border-purple-200">
          {/* Fixed side-by-side layout with proper spacing */}
          <div className="grid grid-cols-2 gap-8 items-center justify-center mb-6">
            {/* Child's Photo - Left Side */}
            <div className="flex flex-col items-center justify-center">
              {(() => {
                const storedPhoto = localStorage.getItem('childPhoto');
                return storedPhoto ? (
                  <img
                    src={storedPhoto}
                    alt={name}
                    className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-purple-300"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-purple-100 shadow-lg border-4 border-purple-300 flex items-center justify-center">
                    <span className="text-purple-500 text-lg font-medium">📷</span>
                  </div>
                );
              })()}
              <div className="text-sm text-gray-500 mt-2 font-medium text-center">
                {name}
              </div>
            </div>

            {/* Large Letter - Right Side */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-7xl font-bold text-purple-600 leading-none">
                {phonics.letter}
              </div>
              {settings.deafMode && (
                <div className="text-xl font-mono text-purple-500 bg-purple-50 px-2 py-1 rounded-lg mt-2">
                  {phonics.sound}
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <div className="text-xl text-gray-600 font-medium mb-2">
              The <span className="text-purple-600 font-bold">{phonics.position}</span> letter
            </div>
            <div className="text-lg text-gray-500">
              in <span className="font-semibold">{name}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="text-sm text-gray-400 flex items-center justify-center gap-2">
              <span>{settings.deafMode ? "Visual phonetic sound" : "Click to hear the sound"}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728"></path>
              </svg>
            </div>

            <ParentRecordingButton 
              name={name}
              phonicsData={phonics}
              settings={settings}
              className="w-full"
            />
          </div>
        </div>

        {/* Back of Card */}
        <div className="flip-card-back bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8 text-white border-4 border-purple-300">
          <div className="text-6xl mb-4">{phonics.letter}</div>
          <div className="text-3xl font-bold mb-2">
            makes the sound
          </div>
          <div className="text-5xl font-bold mb-4 bg-white/20 px-6 py-3 rounded-xl">
            {phonics.sound}
          </div>
          <div className="text-xl opacity-90">
            Like in "<span className="font-bold">{phonics.exampleWord}</span>"
          </div>
          {isPlaying && (
            <div className="mt-6 text-sm opacity-75 flex items-center gap-2">
              <span>🔊 Playing sound</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}