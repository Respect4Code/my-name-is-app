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
      className={`flip-card h-96 cursor-pointer ${isPlaying ? 'sound-indicator playing' : 'sound-indicator'}`}
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
        <div className="flip-card-front bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8 border-4 border-purple-200">
          <div className="text-8xl font-bold text-purple-600 mb-4">
            {phonics.letter}
          </div>
          {settings.deafMode && (
            <div className="text-3xl font-mono text-purple-500 mb-2 bg-purple-50 px-4 py-2 rounded-lg">
              {phonics.sound}
            </div>
          )}
          <div className="text-2xl text-gray-600 font-medium">
            The <span className="text-purple-600 font-bold">{phonics.position}</span> letter
          </div>
          <div className="text-lg text-gray-500 mt-2">
            in <span className="font-semibold">{name}</span>
          </div>
          <div className="mt-6 space-y-3">
            <div className="text-sm text-gray-400 flex items-center gap-2">
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