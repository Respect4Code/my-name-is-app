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
As a parent, I wanted my toddler to learn their name with our voices, not generic videos. Inspired by phonemes, I created this app to let parents record their voice, helping toddlers connect letters to sounds in a fun, personal way! And there is nothing more personal than parents’ voices, after all they have been hearing them since they were in the womb.
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
<p className="text-gray-600 mt-1"><strong>Preview:</strong> Listen to your recording before saving to ensure it’s perfect.</p>
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
Perfect for sharing with friends & family!
</span>
</p>
</div>
</div>
);
});

// RecordingStage Component
const RecordingStage: React.FC<RecordingStageProps> = memo(({ stage, isActive, isComplete, isNext, onRecord, onClick, onReRecord }) => {
const [isRecording, setIsRecording] = useState(false);
const [isStopping, setIsStopping] = useState(false);
const [countdown, setCountdown] = useState<number | null>(null);
const [tempRecording, setTempRecording] = useState<string | null>(null);
const mediaRecorderRef = useRef<MediaRecorder | null>(null);
const audioChunksRef = useRef<Blob[]>([]);
const audioRef = useRef<HTMLAudioElement | null>(null);

useEffect(() => {
return () => {
if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
mediaRecorderRef.current.stop();
}
};
}, []);

const startRecording = async () => {
try {
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const possibleTypes = [
'audio/webm;codecs=opus',
'audio/webm',
'audio/mp4',
'audio/mpeg',
'audio/ogg;codecs=opus',
];
const mimeType = possibleTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'audio/webm';
console.log('Using audio format:', mimeType);
mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
audioChunksRef.current = [];

mediaRecorderRef.current.ondataavailable = (e) => {
if (e.data.size > 0) {
audioChunksRef.current.push(e.data);
}
};

mediaRecorderRef.current.onstop = () => {
stream.getTracks().forEach(track => track.stop());
const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
const reader = new FileReader();
reader.onload = () => {
setTempRecording(reader.result as string);
setIsRecording(false);
setIsStopping(false);
setCountdown(null);
};
reader.readAsDataURL(audioBlob);
};

mediaRecorderRef.current.start();
setIsRecording(true);
} catch (err) {
console.error('Recording failed:', err);
alert('Please allow microphone access to record your voice');
setIsRecording(false);
setIsStopping(false);
setCountdown(null);
}
};

const stopRecording = () => {
if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
setIsStopping(true);
mediaRecorderRef.current.stop();
}
};

const toggleRecording = () => {
if (isRecording) {
stopRecording();
} else {
setTempRecording(null);
setCountdown(1);
setTimeout(() => {
startRecording();
}, 1000);
}
};

const playRecording = () => {
if (tempRecording && audioRef.current) {
audioRef.current.src = tempRecording;
audioRef.current.play().catch(err => {
console.error('Preview playback failed:', err);
alert('Unable to play preview. Check your device volume or silent mode.');
});
}
};

const saveRecording = () => {
if (tempRecording) {
onRecord(tempRecording);
setTempRecording(null);
}
};

return (
<div
onClick={onClick}
className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
isActive
? 'bg-blue-100 border-2 border-blue-300'
: isNext && !isComplete
? 'bg-yellow-50 border-2 border-yellow-300'
: 'bg-gray-100 hover:bg-gray-200'
}`}
role="button"
tabIndex={0}
aria-label={`Record ${stage.label}`}
onKeyPress={(e) => e.key === 'Enter' && onClick()}
>
<div className="flex items-center gap-2">
{stage.icon}
<span className="text-sm font-medium">{stage.label}</span>
</div>
<div className="flex items-center gap-2 relative">
{countdown !== null && (
<span className="absolute -top-6 text-xs text-blue-600 font-bold">
Recording in {countdown}...
</span>
)}
{tempRecording ? (
<div className="flex gap-2">
<button
onClick={(e) => {
e.stopPropagation();
playRecording();
}}
className="p-2 bg-purple-500 rounded-full hover:bg-purple-600 text-white"
aria-label={`Play preview of ${stage.label}`}
>
<Play size={20} aria-hidden="true" />
</button>
<button
onClick={(e) => {
e.stopPropagation();
saveRecording();
}}
className="p-2 bg-green-500 rounded-full hover:bg-green-600 text-white"
aria-label={`Save recording for ${stage.label}`}
>
<CheckCircle size={20} aria-hidden="true" />
</button>
<button
onClick={(e) => {
e.stopPropagation();
toggleRecording();
}}
className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 text-white"
aria-label={`Re-record ${stage.label}`}
>
<RefreshCw size={20} aria-hidden="true" />
</button>
<audio ref={audioRef} className="hidden" />
</div>
) : isComplete ? (
<>
<button
onClick={(e) => {
e.stopPropagation();
onReRecord();
}}
className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 text-white"
aria-label={`Re-record ${stage.label}`}
>
<RefreshCw size={20} aria-hidden="true" />
</button>
<CheckCircle size={20} className="text-green-500" aria-hidden="true" />
</>
) : isActive && isRecording ? (
<button
onClick={(e) => {
e.stopPropagation();
toggleRecording();
}}
className={`p-2 rounded-full ${isStopping ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'} text-white`}
aria-label={isStopping ? 'Stopping recording' : 'Stop recording'}
disabled={isStopping}
>
{isStopping ? <Loader2 size={20} className="animate-spin" aria-hidden="true" /> : <Square size={20} aria-hidden="true" />}
</button>
) : isActive ? (
<button
onClick={(e) => {
e.stopPropagation();
toggleRecording();
}}
className="p-2 bg-orange-500 rounded-full hover:bg-orange-600 text-white"
aria-label="Start recording"
disabled={countdown !== null}
>
<Mic size={20} aria-hidden="true" />
</button>
) : null}
</div>
</div>
);
});

// RecordingScreen Component
const RecordingScreen: React.FC<RecordingScreenProps> = memo(({ name, recordings, setRecordings, onComplete, onBack }) => {
const [currentStage, setCurrentStage] = useState(0);

const letters = name.split('');

const stages: Stage[] = [
{ 
id: 'fullname', 
label: `Full Name: "${name}"`, 
key: 'fullname',
instruction: `Say their name clearly: "${name}"`,
icon: <Volume2 size={20} />
},
...letters.map((letter, i) => ({
id: `letter-${i}`,
label: `Letter ${i + 1}: "${letter}"`,
key: `letter-${i}`,
instruction: `Say the SOUND of "${letter}" (not the letter name)\nExample: B = "buh" not "bee"`,
icon: <BookOpen size={20} />
})),
{ 
id: 'sentence', 
label: 'Walking Sentence', 
key: 'sentence',
instruction: `Say: "${name}, do you want to go for a walk?"`,
icon: <Moon size={20} />
},
{ 
id: 'rhyme', 
label: `Fun Rhyme`, 
key: 'rhyme',
instruction: `Make a fun rhyme with "${name}"\nExample: "${name} is sweet, from head to feet!"`,
icon: <Music size={20} />
}
];

const isComplete = stages.every(stage => recordings[stage.key]);
const nextUnrecordedStage = stages.findIndex(stage => !recordings[stage.key]);

const startRecordingForStage = async (stageIndex: number) => {
setCurrentStage(stageIndex);
const stage = stages[stageIndex];
try {
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const possibleTypes = [
'audio/webm;codecs=opus',
'audio/webm',
'audio/mp4',
'audio/mpeg',
'audio/ogg;codecs=opus',
];
const mimeType = possibleTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'audio/webm';
const mediaRecorder = new MediaRecorder(stream, { mimeType });
const audioChunks: Blob[] = [];

mediaRecorder.ondataavailable = (e) => {
if (e.data.size > 0) {
audioChunks.push(e.data);
}
};

mediaRecorder.onstop = () => {
stream.getTracks().forEach(track => track.stop());
const audioBlob = new Blob(audioChunks, { type: mimeType });
const reader = new FileReader();
reader.onload = () => {
setRecordings(prev => ({
...prev,
[stage.key]: reader.result as string
}));
};
reader.readAsDataURL(audioBlob);
};

setTimeout(() => {
mediaRecorder.start();
}, 1000);
} catch (err) {
console.error('Recording failed:', err);
alert('Please allow microphone access to record your voice');
}
};

const handleBack = () => {
if (window.confirm('Going back will clear all recordings and the name. Are you sure?')) {
onBack();
}
};



return (
<div className="min-h-screen p-4 flex items-center justify-center">
<div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
<div className="relative">
<button
onClick={handleBack}
className="absolute top-4 left-4 p-2 text-gray-600 hover:bg-gray-100 rounded-full"
aria-label="Go back to name entry and clear recordings"
id="back-button"
>
<ArrowLeft size={20} aria-hidden="true" />
</button>


</div>

<h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
Record Your Voice for {name}
</h2>

{Object.keys(recordings).length > 0 && Object.keys(recordings).length < stages.length && (
<div className="bg-purple-50 border border-purple-200 p-2 rounded-lg mb-3 text-center">
<p className="text-xs text-purple-700">
💜 Even partial recordings help! You can always add more later.
</p>
</div>
)}

<div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4 relative">
<div className="flex items-center gap-2 text-blue-800">
<Info size={16} aria-hidden="true" />
<p className="text-sm font-medium">How to Record:</p>
</div>
<ol className="text-sm text-blue-700 mt-1 ml-6 list-decimal">
<li>Tap any item to select it</li>
<li>Tap the RED microphone to START recording</li>
<li>Say the word/sound clearly</li>
<li>Tap the SQUARE to STOP</li>
<li>Preview with PLAY, then SAVE or RE-RECORD</li>
<li><strong>To re-record: Tap the BLUE refresh icon</strong></li>
</ol>


</div>

<div className="mb-4">
<div className="flex justify-between items-center mb-2">
<span className="text-sm text-gray-600 font-medium">Your Progress</span>
<span className="text-sm text-gray-600 font-medium">
{Object.keys(recordings).length} of {stages.length} done
</span>
</div>
<div className="h-3 bg-gray-200 rounded-full overflow-hidden">
<div
className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
style={{ width: `${(Object.keys(recordings).length / stages.length) * 100}%` }}
/>
</div>
{Object.keys(recordings).length > 0 && (
<p className="text-xs text-gray-500 mt-1 text-center">
Storage used: ~{((JSON.stringify(recordings).length / 1024 / 1024) * 2).toFixed(1)}MB
</p>
)}
</div>

<div className="space-y-2 mb-6 max-h-80 overflow-y-auto">
{stages.map((stage, index) => (
<div key={stage.id} className="relative">
<RecordingStage
stage={stage}
isActive={index === currentStage}
isComplete={!!recordings[stage.key]}
isNext={index === nextUnrecordedStage}
onRecord={(audioData: string) => {
setRecordings(prev => ({
...prev,
[stage.key]: audioData
}));
if (index < stages.length - 1) {
setTimeout(() => setCurrentStage(index + 1), 1000);
}
}}
onClick={() => setCurrentStage(index)}
onReRecord={() => {
setCurrentStage(index);
startRecordingForStage(index);
}}
/>

</div>
))}
</div>

<button
onClick={onComplete}
disabled={!isComplete}
className={`w-full py-4 rounded-xl font-bold text-xl transition-all ${
isComplete
? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
: 'bg-gray-300 text-gray-500'
}`}
aria-label={isComplete ? "Create flashcards" : "Complete all recordings to proceed"}
>
{isComplete ? '🎉 All Done! Create Flashcards' : `📝 ${stages.length - Object.keys(recordings).length} recordings left`}
</button>

{isComplete && (
<p className="text-xs text-gray-500 text-center mt-2">
💡 Tip: Test audio playback in flashcards. If no sound, check volume/silent mode.
</p>
)}
</div>
</div>
);
});

// FlashcardScreen Component
const FlashcardScreen: React.FC<FlashcardScreenProps> = memo(({ name, recordings, onReset }) => {
const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
const [hasPlayed, setHasPlayed] = useState(false);
const letters = name.split('');

const playAudio = (key: string) => {
if (!hasPlayed) {
setHasPlayed(true);
return;
}
const audio = new Audio(recordings[key]);
audio.play().catch(err => {
console.error('Audio playback failed:', err);
alert('Unable to play audio. Check your device volume or silent mode.');
});
};

const handleKeyPress = (e: React.KeyboardEvent) => {
if (e.key === 'ArrowRight' && currentLetterIndex < letters.length - 1) {
setCurrentLetterIndex(currentLetterIndex + 1);
} else if (e.key === 'ArrowLeft' && currentLetterIndex > 0) {
setCurrentLetterIndex(currentLetterIndex - 1);
} else if (e.key === 'Enter') {
playAudio(`letter-${currentLetterIndex}`);
}
};

return (
<div
className="min-h-screen p-4 flex items-center justify-center"
tabIndex={0}
onKeyDown={handleKeyPress}
aria-label="Flashcard navigation"
>
<div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
<h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
{name}'s Flashcards
</h2>

<div className="text-center mb-6">
<span
className="text-8xl font-bold text-purple-600 animate-pulse"
aria-label={`Current letter: ${letters[currentLetterIndex]}`}
>
{ letters[currentLetterIndex]}
</span>
</div>

<div className="flex justify-center gap-4 mb-6">
<button
onClick={() => playAudio('fullname')}
className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 flex items-center gap-2"
aria-label="Play full name"
>
<Volume2 size={20} aria-hidden="true" /> Name
</button>

<button
onClick={() => playAudio(`letter-${currentLetterIndex}`)}
disabled={!hasPlayed}
className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
hasPlayed
? 'bg-purple-500 text-white hover:bg-purple-600'
: 'bg-gray-300 text-gray-500'
}`}
aria-label={hasPlayed ? 'Play letter sound' : 'Tap to enable audio playback'}
>
<Loader2
size={20}
className={hasPlayed ? 'hidden' : 'animate-spin'}
aria-hidden="true"
/>
<span>Play Letter Sound</span>
</button>
</div>

<div className="flex justify-center gap-4 mb-6">
<button
onClick={() => playAudio('sentence')}
className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 flex items-center gap-2"
aria-label="Play walking sentence"
>
<Moon size={20} aria-hidden="true" /> Sentence
</button>

<button
onClick={() => playAudio('rhyme')}
className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 flex items-center gap-2"
aria-label="Play fun rhyme"
>
<Music size={20} aria-hidden="true" /> Rhyme
</button>
</div>

<div className="flex justify-between mb-6">
<button
onClick={() => setCurrentLetterIndex(currentLetterIndex - 1)}
disabled={currentLetterIndex === 0}
className={`p-3 rounded-xl ${
currentLetterIndex === 0
? 'bg-gray-300 text-gray-500'
: 'bg-purple-500 text-white hover:bg-purple-600'
}`}
aria-label="Previous letter"
>
<ChevronLeft size={24} aria-hidden="true" />
</button>

<button
onClick={() => setCurrentLetterIndex(currentLetterIndex + 1)}
disabled={currentLetterIndex === letters.length - 1}
className={`p-3 rounded-xl ${
currentLetterIndex === letters.length - 1
? 'bg-gray-300 text-gray-500'
: 'bg-purple-500 text-white hover:bg-purple-600'
}`}
aria-label="Next letter"
>
<ArrowRight size={24} aria-hidden="true" />
</button>
</div>

<button
onClick={onReset}
className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600"
aria-label="Start over and clear all data"
>
Start Over
</button>
</div>
</div>
);
});

// App Component
const App = () => {
const [step, setStep] = useState<'welcome' | 'recording' | 'flashcards'>('welcome');
const [name, setName] = useState<string | null>(null);
const [recordings, setRecordings] = useState<Record<string, string>>({});
const [showGuide, setShowGuide] = useState(false);

useEffect(() => {
const loadData = async () => {
try {
const db = await openDB('MyNameIsDB', 1, {
upgrade(db) {
db.createObjectStore('recordings');
},
});
const savedRecordings = await db.getAll('recordings');
const loadedRecordings: Record<string, string> = {};
for (const { key, value } of savedRecordings) {
loadedRecordings[key] = value;
}
setRecordings(loadedRecordings);

const savedName = localStorage.getItem('childName');
if (savedName && Object.keys(loadedRecordings).length > 0) {
setName(savedName);
setStep('flashcards');
}
} catch (err) {
console.error('Failed to load data:', err);
alert('Unable to load saved data. Please try again.');
}
};
loadData();
}, []);

useEffect(() => {
if (name) localStorage.setItem('childName', name);
}, [name]);

useEffect(() => {
const saveRecordings = async () => {
try {
const db = await openDB('MyNameIsDB', 1);
const tx = db.transaction('recordings', 'readwrite');
const store = tx.objectStore('recordings');
for (const [key, value] of Object.entries(recordings)) {
await store.put({ key, value });
}
await tx.done;
} catch (err) {
console.error('Failed to save recordings:', err);
alert('Unable to save recordings. Please try again.');
}
};
if (Object.keys(recordings).length > 0) {
saveRecordings();
}
}, [recordings]);

const handleReset = () => {
localStorage.removeItem('childName');
localStorage.removeItem('tooltipsDismissed');
setName(null);
setRecordings({});
setStep('welcome');
openDB('MyNameIsDB', 1).then(db => {
db.clear('recordings');
});
};

return (
<div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100">
{showGuide && <ParentGuide onClose={() => setShowGuide(false)} />}

{step === 'welcome' && (
<WelcomeScreen
onNext={(newName) => {
setName(newName);
setRecordings({});
setStep('recording');
}}
onGuide={() => setShowGuide(true)}
/>
)}

{step === 'recording' && name && (
<RecordingScreen
name={name}
recordings={recordings}
setRecordings={setRecordings}
onComplete={() => setStep('flashcards')}
onBack={() => {
handleReset();
}}
/>
)}

{step === 'flashcards' && name && (
<FlashcardScreen
name={name}
recordings={recordings}
onReset={handleReset}
/>
)}
</div>
);
};

export default App;