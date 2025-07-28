import React, { memo, useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import {
Info, ChevronRight, ArrowLeft, Volume2, BookOpen, Moon, Music, Loader2, ArrowRight, ChevronLeft,
CheckCircle, Mic, Square, RefreshCw, Play, Share2
} from 'lucide-react';
import { openDB } from 'idb';
// BoredMama colorful logo component that will definitely work
const BoredMamaLogo = () => (
        <div className="flex items-center justify-center mb-2">
                <img 
                        src="/logo.png?v=2" 
                        alt="BoredMama - Revolutionising Motherhood" 
                        className="h-16 w-auto object-contain max-w-full"
                        onError={(e) => {
                                console.log('Logo failed to load');
                                e.currentTarget.style.display = 'none';
                        }}
                />
        </div>
);

// Get vibrant colors for letters matching the BoredMama brand
const getLetterColor = (index: number) => {
        const colors = [
                'text-yellow-500', 'text-green-500', 'text-blue-400', 'text-pink-500', 
                'text-red-500', 'text-purple-600', 'text-orange-500', 'text-teal-500',
                'text-indigo-500', 'text-rose-500'
        ];
        return colors[index % colors.length];
};

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

interface ShareButtonProps {
className?: string;
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
recordings: { [key: string]: string };
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
As parents, we wanted our toddler to learn their name with our voices, not generic videos. Inspired by phonemes, I created this app to let parents record their voice, helping toddlers connect letters to sounds in a fun, personal way! And there is nothing more personal than parents’ voices, after all they have been hearing them since they were in the womb.
</p>
</div>

<div className="bg-blue-50 p-4 rounded-lg">
<h3 className="font-bold mb-2">⏱️ Total Setup Time: 4 minutes</h3>
<p>We respect your time. Here's exactly what to do:</p>
</div>

<div className="space-y-3">
<div>
<h4 className="font-bold">1️⃣ Enter Name (10 seconds)</h4>
<p className="text-gray-600">Type your child's name (up to 26 letters).</p>
</div>

<div>
<h4 className="font-bold">2️⃣ Record Sounds (3-4 minutes)</h4>
<p className="text-gray-600">Record 4 types of sounds:</p>
<ul className="ml-4 mt-1 text-gray-600 list-disc">
<li>Their full name</li>
<li>Each letter sound (A = "ahh", B = "buh")</li>
<li>Sentence with name</li>
<li>Rhyme with name</li>
</ul>
<p className="text-gray-600 mt-1"><strong>To re-record:</strong> Tap the blue refresh icon next to any completed item!</p>
<p className="text-gray-600 mt-1"><strong>Preview:</strong> Listen to your recording before saving to ensure it’s perfect.</p>
</div>

<div>
<h4 className="font-bold">3️⃣ Done! Give to child</h4>
<p className="text-gray-600">They tap the colored buttons to hear YOUR voice.</p>
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
<li>Web browsers require user interaction before playing audio</li>
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

// ShareButton Component
const ShareButton: React.FC<ShareButtonProps> = memo(({ className = "" }) => {
const [isExpanded, setIsExpanded] = useState(false);
const [isHovered, setIsHovered] = useState(false);

const shareUrl = window.location.href;
const shareText = "Check out this amazing phonics app! Help your child learn letters with your own voice 🎵";

const handleShare = async (platform: string) => {
        const urls = {
                whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
                snapchat: `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(shareUrl)}`
        };

        window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
        setIsExpanded(false);
};

// Try native sharing first on mobile
const handleNativeShare = async () => {
        if (navigator.share) {
                try {
                        await navigator.share({
                                title: 'My Name Is - Phonics Learning App',
                                text: shareText,
                                url: shareUrl,
                        });
                        return;
                } catch (err) {
                        // User cancelled or share failed, fall through to custom sharing
                }
        }
        setIsExpanded(!isExpanded);
};

return (
        <div className={`relative ${className}`}>
                <button
                        onClick={handleNativeShare}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className={`
                                w-full py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2
                                ${isHovered 
                                        ? 'bg-orange-400 text-white shadow-lg transform scale-105' 
                                        : 'bg-transparent text-purple-600 border-2 border-purple-200 hover:border-purple-300'
                                }
                        `}
                        aria-label="Share this app with friends and family"
                >
                        {isHovered ? 'SHARE THIS APP' : 'Share with friends & family'} 
                        <Share2 size={16} />
                </button>

                {isExpanded && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border-2 border-gray-100 p-4 z-50">
                                <div className="grid grid-cols-2 gap-3">
                                        <button
                                                onClick={() => handleShare('whatsapp')}
                                                className="flex items-center gap-2 p-3 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                                        >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.886 3.488"/>
                                                </svg>
                                                WhatsApp
                                        </button>
                                        <button
                                                onClick={() => handleShare('snapchat')}
                                                className="flex items-center gap-2 p-3 rounded-lg bg-yellow-400 text-black hover:bg-yellow-500 transition-colors"
                                        >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.162-1.499-.69-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12.013C24.007 5.367 18.641.001.017 0"/>
                                                </svg>
                                                Snapchat
                                        </button>
                                        <button
                                                onClick={() => handleShare('facebook')}
                                                className="flex items-center gap-2 p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                        >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                </svg>
                                                Facebook
                                        </button>
                                        <button
                                                onClick={() => handleShare('twitter')}
                                                className="flex items-center gap-2 p-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
                                        >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                                                </svg>
                                                X (Twitter)
                                        </button>
                                </div>
                        </div>
                )}
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

<div className="mb-6">
        <BoredMamaLogo />
</div>
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
maxLength={26}
autoFocus
aria-label="Child's name"
/>

{name.length >= 20 && (
<p className="text-xs text-orange-600 -mt-4 mb-4 text-center">
{26 - name.length} characters left
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

<ShareButton className="mt-6" />

<p className="text-xs text-gray-500 mt-6 text-center">
100% Private • Works Offline • CC BY-NC-SA 4.0<br/>
Created with ❤️ by BoredMamaApp<br/>
<span className="text-purple-600 font-medium">Revolutionising Motherhood</span>
</p>
</div>
</div>
);
});

// RecordingStage Component
const RecordingStage: React.FC<RecordingStageProps> = memo(({ stage, isActive, isComplete, isNext, onRecord, onClick, onReRecord, recordings }) => {
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
console.log('Attempting to start recording for:', stage.label);
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
if (!stream) throw new Error('No audio stream available');
const possibleTypes = [
'audio/webm;codecs=opus',
'audio/webm',
'audio/mp4',
'audio/mpeg',
'audio/ogg;codecs=opus',
];
const mimeType = possibleTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'audio/webm';
console.log('Using mimeType:', mimeType);
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
const audioData = reader.result as string;
console.log('Recording stopped, data length:', audioData.length);
setTempRecording(audioData);
setIsRecording(false);
setIsStopping(false);
setCountdown(null);
// Auto-save after 2 seconds delay so user can hear the recording preview
setTimeout(() => {
console.log('Auto-saving recording for stage:', stage.key);
onRecord(audioData);
setTempRecording(null);
console.log('Auto-save completed');
}, 2000);
};
reader.readAsDataURL(audioBlob);
};

mediaRecorderRef.current.start();
setIsRecording(true);
} catch (err) {
console.error('Recording error:', err);
const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
alert(`Recording failed: ${errorMessage}. Please ensure microphone access is granted.`);
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
console.log('Saving recording for stage:', stage.key);
onRecord(tempRecording);
setTempRecording(null);
console.log('Recording saved and temp cleared');
} else {
console.log('No temp recording to save');
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
aria-label={`SAVE recording for ${stage.label}`}
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
<div className="flex gap-2 items-center">
<button
onClick={(e) => {
e.stopPropagation();
if (recordings[stage.key]) {
const audio = new Audio(recordings[stage.key]);
audio.play().catch(err => {
console.error('Playback failed:', err);
alert('Unable to play audio. Check your device volume or silent mode.');
});
}
}}
className="p-2 bg-purple-500 rounded-full hover:bg-purple-600 text-white"
aria-label={`Play ${stage.label} recording`}
>
<Play size={20} aria-hidden="true" />
</button>
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
</div>
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
label: 'Say a sentence with name', 
key: 'sentence',
instruction: `Say a sentence using "${name}" - be creative!`,
icon: <Moon size={20} />
},
{ 
id: 'rhyme', 
label: `Say a fun rhyme with name`, 
key: 'rhyme',
instruction: `Make a fun rhyme with "${name}"\nExample: "${name} is sweet, from head to feet!"`,
icon: <Music size={20} />
}
];

const isComplete = stages.every(stage => recordings[stage.key]);
const nextUnrecordedStage = stages.findIndex(stage => !recordings[stage.key]);

// Keep one debug line to track completion
console.log(`Progress: ${Object.keys(recordings).length}/${stages.length} recordings complete`);

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
<li>Recording auto-saves after 2 seconds - no need to click SAVE!</li>
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
// Auto-advance to next unrecorded stage after successful recording
if (index < stages.length - 1) {
setTimeout(() => setCurrentStage(index + 1), 1000);
}
}}
onClick={() => setCurrentStage(index)}
onReRecord={() => {
console.log('Re-recording initiated for:', stage.label);
setRecordings(prev => {
const newRecordings = { ...prev };
delete newRecordings[stage.key]; // Clear the existing recording
console.log('Cleared recording for:', stage.label);
return newRecordings;
});
setCurrentStage(index);
}}
recordings={recordings}
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
const letters = name.split('');

const playAudio = (key: string) => {
if (!recordings[key]) {
console.warn(`No recording found for key: ${key}`);
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
<div className="text-center mb-4">
        <BoredMamaLogo />
</div>
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
className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 flex items-center gap-2"
aria-label="Play letter sound"
>
<Volume2 size={20} aria-hidden="true" />
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
<div className="flex flex-col items-center">
<button
onClick={() => setCurrentLetterIndex(currentLetterIndex - 1)}
disabled={currentLetterIndex === 0}
className={`p-3 rounded-xl ${
currentLetterIndex === 0
? 'bg-gray-300 text-gray-500'
: 'bg-gray-500 text-white hover:bg-gray-600'
}`}
aria-label="Previous letter"
>
<ChevronLeft size={24} aria-hidden="true" />
</button>
<span className="text-sm text-gray-600 mt-2 font-medium">Previous Letter</span>
</div>

<div className="flex flex-col items-center">
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
<span className="text-sm text-gray-600 mt-2 font-medium">Next Letter</span>
</div>
</div>

<button
onClick={onReset}
className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 mb-4"
aria-label="Start over and clear all data"
>
Start Over
</button>

<ShareButton />
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
// Try IndexedDB first, fallback to localStorage
let loadedRecordings: Record<string, string> = {};

try {
const db = await openDB('MyNameIsDB', 1, {
upgrade(db) {
db.createObjectStore('recordings');
},
});
const savedRecordings = await db.getAll('recordings');
for (const { key, value } of savedRecordings) {
loadedRecordings[key] = value;
}
console.log('Loaded recordings from IndexedDB:', Object.keys(loadedRecordings).length);
} catch (idbError) {
console.warn('IndexedDB failed, trying localStorage:', idbError);
// Fallback to localStorage
const savedRecordings = localStorage.getItem('recordings');
if (savedRecordings) {
try {
loadedRecordings = JSON.parse(savedRecordings);
} catch (parseError) {
console.error('Failed to parse localStorage recordings:', parseError);
loadedRecordings = {};
}
}
}

setRecordings(loadedRecordings);

const savedName = localStorage.getItem('childName');
if (savedName && Object.keys(loadedRecordings).length > 0) {
setName(savedName);
setStep('flashcards');
}
} catch (err) {
console.error('Failed to load data:', err);
// Don't show error alert on initial load - just start fresh
}
};
loadData();
}, []);

useEffect(() => {
if (name) localStorage.setItem('childName', name);
}, [name]);

useEffect(() => {
const saveRecordings = async () => {
if (Object.keys(recordings).length === 0) return;

try {
// Try IndexedDB first
try {
const db = await openDB('MyNameIsDB', 1);
const tx = db.transaction('recordings', 'readwrite');
const store = tx.objectStore('recordings');
for (const [key, value] of Object.entries(recordings)) {
await store.put({ key, value });
}
await tx.done;
console.log('Saved recordings to IndexedDB:', Object.keys(recordings).length);
} catch (idbError) {
console.warn('IndexedDB failed, using localStorage:', idbError);
// Fallback to localStorage
localStorage.setItem('recordings', JSON.stringify(recordings));
console.log('Saved recordings to localStorage:', Object.keys(recordings).length);
}
} catch (err) {
console.error('Failed to save recordings:', err);
// Silent fallback - don't interrupt user experience
localStorage.setItem('recordings', JSON.stringify(recordings));
}
};
saveRecordings();
}, [recordings]);

const handleReset = async () => {
if (window.confirm('This will clear all recordings and data. Are you sure?')) {
try {
// Clear both IndexedDB and localStorage
try {
const db = await openDB('MyNameIsDB', 1);
const tx = db.transaction('recordings', 'readwrite');
await tx.objectStore('recordings').clear();
await tx.done;
} catch (idbError) {
console.warn('IndexedDB clear failed:', idbError);
}
localStorage.removeItem('recordings');
localStorage.removeItem('childName');
localStorage.removeItem('tooltipsDismissed');
setRecordings({});
setName(null);
setStep('welcome');
console.log('Reset complete - all data cleared');
} catch (err) {
console.error('Failed to clear data:', err);
// Force reset even if clearing fails
setRecordings({});
setName(null);
setStep('welcome');
}
}
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