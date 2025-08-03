
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhonicsData } from "@/lib/phonics";

interface RecordingSetupProps {
  name: string;
  onRecordingsComplete: (recordings: { [key: string]: string }) => void;
  onCancel: () => void;
}

export default function RecordingSetup({ name, onRecordingsComplete, onCancel }: RecordingSetupProps) {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<{ [key: string]: string }>({});
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [syllableBreaks, setSyllableBreaks] = useState<string[]>([]);
  const [customSyllables, setCustomSyllables] = useState(name.toUpperCase());

  const letters = name.toUpperCase().split('');
  const currentLetter = letters[currentLetterIndex];
  const isComplete = currentLetterIndex >= letters.length;

  useEffect(() => {
    // Initialize with default syllable breaks
    setSyllableBreaks(letters);
  }, [name]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setRecordings(prev => ({
          ...prev,
          [currentLetter]: audioUrl
        }));
        
        setAudioChunks([]);
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      // Silent handling - user can retry if needed
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const nextLetter = () => {
    setCurrentLetterIndex(prev => prev + 1);
  };

  const prevLetter = () => {
    setCurrentLetterIndex(prev => Math.max(0, prev - 1));
  };

  const playRecording = (letter: string) => {
    const audioUrl = recordings[letter];
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleComplete = () => {
    onRecordingsComplete(recordings);
  };

  const handleSyllableChange = (value: string) => {
    setCustomSyllables(value.toUpperCase());
    setSyllableBreaks(value.toUpperCase().split(''));
  };

  if (isComplete) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-purple-600">
            🎉 Recordings Complete!
          </CardTitle>
          <CardDescription>
            Review your recordings for "{name}"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {letters.map((letter, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">{letter}</div>
                <Button
                  onClick={() => playRecording(letter)}
                  disabled={!recordings[letter]}
                  variant={recordings[letter] ? "default" : "outline"}
                  size="sm"
                >
                  {recordings[letter] ? "▶️ Play" : "❌ Missing"}
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button onClick={onCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleComplete}
              disabled={letters.some(letter => !recordings[letter])}
              className="flex-1"
            >
              Use These Recordings
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-purple-600">
          Record Your Child's Name
        </CardTitle>
        <CardDescription>
          Let's record how YOU pronounce each letter in "{name}"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Custom Syllable Input */}
        <div className="space-y-2">
          <Label htmlFor="syllables">
            How do you break up the name? (e.g., "DI-VINE" or "DIV-INE")
          </Label>
          <Input
            id="syllables"
            value={customSyllables}
            onChange={(e) => handleSyllableChange(e.target.value)}
            placeholder="Type the name with dashes between syllables"
            className="text-lg font-mono"
          />
          <p className="text-sm text-gray-600">
            This helps us know how you want to teach the name to your child
          </p>
        </div>

        {/* Current Letter Recording */}
        <div className="text-center space-y-4">
          <div className="text-6xl font-bold text-purple-600 mb-4">
            {currentLetter}
          </div>
          
          <div className="text-lg text-gray-600">
            Letter {currentLetterIndex + 1} of {letters.length}
          </div>
          
          <div className="text-sm text-gray-500 max-w-md mx-auto">
            Record the sound this letter makes in YOUR pronunciation of "{name}".
            For example, if your child is "Divine", the 'D' might sound like "duh" or "dee" depending on how you say it.
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={startRecording}
              disabled={isRecording}
              className="px-8 py-4 text-lg"
            >
              {isRecording ? "🔴 Recording..." : "🎤 Record Sound"}
            </Button>
            
            {isRecording && (
              <Button
                onClick={stopRecording}
                variant="outline"
                className="px-8 py-4 text-lg"
              >
                ⏹️ Stop
              </Button>
            )}
          </div>

          {recordings[currentLetter] && (
            <div className="space-y-2">
              <p className="text-green-600 font-medium">✅ Recorded!</p>
              <Button
                onClick={() => playRecording(currentLetter)}
                variant="outline"
                size="sm"
              >
                ▶️ Play Recording
              </Button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4">
          <Button
            onClick={prevLetter}
            disabled={currentLetterIndex === 0}
            variant="outline"
          >
            ← Previous
          </Button>
          
          <div className="text-sm text-gray-500">
            {currentLetterIndex + 1} / {letters.length}
          </div>
          
          <Button
            onClick={nextLetter}
            disabled={!recordings[currentLetter]}
          >
            Next →
          </Button>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={onCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
