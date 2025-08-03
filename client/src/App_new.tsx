import React, { memo, useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import {
Info, ChevronRight, ArrowLeft, Volume2, BookOpen, Moon, Music, Loader2, ArrowRight, ChevronLeft,
CheckCircle, Mic, Square, RefreshCw, Play
} from 'lucide-react';
import { openDB } from 'idb';

// TypeScript interfaces
interface Stage {
id: string;
label: string;
key: string;
instruction: string;
icon: React.ReactNode;
}

interface ParentGuideProps {
onClose: () => void;
}

interface WelcomeScreenProps {
onNext: (name: string) => void;
onGuide: () => void;
}

interface RecordingScreenProps {
name: string;
recordings: Record<string, string>;
setRecordings: React.Dispatch<React.SetStateAction<Record<string, string>>>;
onComplete: () => void;
onBack: () => void;
}

interface FlashcardScreenProps {
name: string;
recordings: Record<string, string>;
onReset: () => void;
}

interface RecordingStageProps {
stage: Stage;
isActive: boolean;
isComplete: boolean;
isNext: boolean;
onRecord: (audioData: string) => void;
onClick: () => void;
onReRecord: () => void;
}

// ParentGuide Component
const ParentGuide: React.FC<ParentGuideProps> = memo(({ onClose }) => {
return (
<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-labelledby="parent-guide-title">
<div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
<h2 id="parent-guide-title" className="text-2xl font-bold mb-4">Quick Parent Guide</h2>

<div className="space-y-4 text-sm">
<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
<h3 className="font-bold mb-2">Why I Made This App</h3>
<p className="text-gray-600">
As a parent, I wanted my toddler to learn their name with our voices, not generic videos. Inspired by phonemes, I created this app to let parents record their voice, helping toddlers connect letters to sounds in a fun, personal way! And there is nothing more personal than parents' voices, after all they have been hearing them since they were in the womb.
</p>
</div>

<div className="bg-blue-50 p-4 rounded-lg">
<h3 className="font-bold mb-2">⏱️ Total Setup Time: 4 minutes</h3>
<p>We respect your time. Here's exactly what to do:</p>
</div>

<div className="space-y-3">
<div>
<h4 className="font-bold">1️⃣ Enter Name (10 seconds)</h4>
<p className="text-gray-600">Type your child's name (up to 20 letters).</p>
</div>

<div>
<h4 className="font-bold">2️⃣ Record Sounds (3-4 minutes)</h4>
<p className="text-gray-600">Record 4 types of sounds:</p>
<ul className="ml-4 mt-1 text-gray-600 list-disc">
<li>Their full name</li>
<li>Each letter SOUND (not name!)</li>
<li>Walking sentence</li>
<li>Fun rhyme</li>
</ul>
<p className="text-gray-600 mt-1"><strong>To re-record:</strong> Tap the blue refresh icon next to any completed item!</p>
<p className="text-gray-600 mt-1"><strong>Preview:</strong> Listen to your recording before saving to ensure it's perfect.</p>
</div>

<div>
<h4 className="font-bold">3️⃣ Done! Give to child</h4>
<p className="text-gray-600">They tap the big letters and hear YOUR voice.</p>
</div>
</div>

<div className="bg-green-50 p-4 rounded-lg">
<h3 className="font-bold mb-1">💡 Recording Tips:</h3>
<ul className="text-gray-700 space-y-1 list-disc ml-4">
<li>Red mic = recording</li>
<li>Tap once to start, tap again to stop</li>
<li>Play button = preview recording</li>
<li>Green check = save recording</li>
<li>Blue refresh = re-record</li>
<li>Record letter SOUNDS not names (B = "buh" not "bee")</li>
<li>Check tooltips on the recording screen for guidance!</li>
</ul>
</div>

<div className="bg-yellow-50 p-4 rounded-lg">
<h3 className="font-bold mb-1">⚠️ Important:</h3>
<ul className="text-gray-700 space-y-1 list-disc ml-4">
<li><strong>Your work is auto-saved!</strong></li>
<li>Use app buttons (not browser back)</li>
<li>Going back clears recordings—confirm carefully!</li>
<li>Works best without toddler present 😅</li>
<li>If audio doesn't play, check volume/silent mode</li>
<li>First audio requires a tap (mobile safety)</li>
</ul>
</div>
</div>

<button
onClick={onClose}
className="w-full mt-6 py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600"
aria-label="Close parent guide and start setup"
>
Got it! Let's start
</button>
</div>
</div>
);
});

// WelcomeScreen Component  
const WelcomeScreen: React.FC<WelcomeScreenProps> = memo(({ onNext, onGuide }) => {
const [name, setName] = useState('');

const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
if (e.key === 'Enter' && name.length >= 2) {
onNext(name.toUpperCase());
}
};

return (
<div className="flex items-center justify-center min-h-screen p-4">
<div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative">
<button
onClick={onGuide}
className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full"
aria-label="Open parent guide"
>
<Info size={20} aria-hidden="true" />
</button>

<h1 className="text-4xl font-bold text-gray-800 mb-2">My Name Is</h1>
<p className="text-gray-600 mb-2">Teach your child their name with YOUR voice</p>
<p className="text-purple-600 text-sm font-medium mb-6">
⭐ "My 18-month-old learned all letters phonetically!" - Real parent
</p>

<input
type="text"
value={name}
onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z]/g, ''))}
onKeyPress={handleKeyPress}
placeholder="Enter your child's name"
className="w-full p-4 text-2xl text-center border-2 border-purple-200 rounded-xl text-gray-800 mb-6"
maxLength={20}
autoFocus
aria-label="Child's name"
/>

{name.length >= 15 && (
<p className="text-xs text-orange-600 -mt-4 mb-4 text-center">
{20 - name.length} characters left
</p>
)}

<button
onClick={() => name.length >= 2 && onNext(name.toUpperCase())}
disabled={name.length < 2}
className={`w-full py-4 rounded-xl font-bold text-xl transition-all flex items-center justify-center gap-2 ${
name.length >= 2
? 'bg-purple-500 text-white hover:bg-purple-600'
: 'bg-gray-300 text-gray-500'
}`}
aria-label="Proceed to record voice"
>
Next <ChevronRight />
</button>

<button
onClick={onGuide}
className="mt-4 text-purple-600 underline text-sm"
aria-label="View parent guide"
>
Need help? Read 4-minute guide
</button>

<p className="text-xs text-gray-500 mt-8">
100% Private • Works Offline • CC BY-NC-SA 4.0<br/>
Created with ❤️ by BoredMamaApp<br/>
<span className="text-purple-600 font-medium">
Use YOUR voice for personal phonics—read our story!
</span>
</p>
</div>
</div>
);
});