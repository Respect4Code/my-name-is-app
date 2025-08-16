import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Volume2 } from "lucide-react";
import RecordingModal from "./recording-modal";
import { PhonicsData } from "@/lib/phonics";
import { useParentRecordings } from "@/hooks/use-parent-recordings";
import { Recording } from "@/hooks/use-recording";
import type { Settings } from "@/pages/home";

interface ParentRecordingButtonProps {
  phonicsData: PhonicsData;
  name: string;
  settings?: Settings;
  className?: string;
}

const defaultSettings: Settings = {
  speechRate: 0.8,
  speechMode: true,
  visualMode: false,
  animations: true,
  highContrast: false,
  deafMode: false
};

export default function ParentRecordingButton({ phonicsData, name, settings, className }: ParentRecordingButtonProps) {
  const safeSettings = settings || defaultSettings;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getRecording, saveRecording } = useParentRecordings();

  const existingRecording = getRecording(name, phonicsData.letter, phonicsData.position);
  const hasRecording = !!existingRecording;

  const handleSave = (recording: Recording) => {
    saveRecording(name, recording);
  };

  return (
    <>
      <Button
        variant={hasRecording ? "default" : "outline"}
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center space-x-2 ${hasRecording ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-purple-300 text-purple-600 hover:bg-purple-50'} ${className || ''}`}
      >
        {hasRecording ? (
          <>
            <Volume2 className="w-4 h-4" />
            <span>Parent Sound</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            <span>Record Sound</span>
          </>
        )}
      </Button>

      <RecordingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          phonics={phonicsData}
          name={name}
          settings={safeSettings}
        />
    </>
  );
}
```

```jsx
import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Mic, Play, Stop } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRecording } from "@/hooks/use-recording";
import { Settings } from "@/pages/home";

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  phonics: any;
  name: string;
  settings: Settings;
}
export default function RecordingModal({ isOpen, onClose, phonics, name, settings }: RecordingModalProps) {
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const className = "";

  const { recording, startRecording, stopRecording, playRecording, stopPlaying, hasRecording } = useRecording({
    phonics,
    name,
    settings,
  });

  // Function to handle playing the recording
  const handlePlay = async () => {
    if (recording && !isPlaying) {
      setIsPlaying(true);
      try {
        await playRecording(recording, audioRef);
      } catch (error) {
        console.error("Error playing recording:", error);
        toast({
          title: "Error Playing",
          description: "There was an error playing the recording.",
          variant: "destructive",
        });
        setIsPlaying(false);
      } finally {
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      stopPlaying();
    }
  }, [isOpen, stopPlaying]);

  const onVolumeChange = useCallback(
    (value: number[]) => {
      setVolume(value[0]);
      if (audioRef.current) {
        audioRef.current.volume = value[0] / 100;
      }
    },
    []
  );

  // Ensure audioRef.current is updated when recording changes
  useEffect(() => {
    if (recording && audioRef.current) {
      audioRef.current.src = recording;
    }
  }, [recording]);

  return (
    <Dialog open={showModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Your Voice</DialogTitle>
          <DialogDescription>
            Record your voice for the phonics sound.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="volume">Volume</label>
            <Slider
              id="volume"
              defaultValue={[volume]}
              max={100}
              step={1}
              onValueChange={onVolumeChange}
            />
          </div>

          <audio ref={audioRef} style={{ display: "none" }} controls />

          {/* Buttons to handle recording */}
          {!recording ? (
            <Button
              onClick={startRecording}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 bg-purple-50 border-purple-200 hover:bg-purple-100"
            >
              <Mic className="w-4 h-4" />
              <span>Start Recording</span>
            </Button>
          ) : (
            <>
              <Button
                onClick={handlePlay}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 bg-green-50 border-green-200 hover:bg-green-100"
                disabled={isPlaying}
              >
                {isPlaying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                    <span>Playing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Play Recording</span>
                  </>
                )}
              </Button>
              <Button
                onClick={stopRecording}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 bg-red-50 border-red-200 hover:bg-red-100"
              >
                <Stop className="w-4 h-4" />
                <span>Stop Recording</span>
              </Button>
            </>
          )}
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

```jsx
return (
    <div className={`space-y-2 ${className}`}>
      {/* Play button for saved recording */}
      {hasRecording && (
        <Button
          onClick={handlePlay}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 bg-green-50 border-green-200 hover:bg-green-100"
          disabled={isPlaying}
        >
          {isPlaying ? (
            <>
              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              <span>Playing...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Play Recording</span>
            </>
          )}
        </Button>
      )}

      {/* Record/Re-record button */}
      <Button
        onClick={() => setShowModal(true)}
        variant="outline"
        className="w-full flex items-center justify-center gap-2 bg-purple-50 border-purple-200 hover:bg-purple-100"
      >
        <Mic className="w-4 h-4" />
        <span>{hasRecording ? 'Re-record Voice' : 'Record Your Voice'}</span>
      </Button>
```

```replit_final_file
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Volume2 } from "lucide-react";
import RecordingModal from "./recording-modal";
import { PhonicsData } from "@/lib/phonics";
import { useParentRecordings } from "@/hooks/use-parent-recordings";
import { Recording } from "@/hooks/use-recording";
import type { Settings } from "@/pages/home";

interface ParentRecordingButtonProps {
  phonicsData: PhonicsData;
  name: string;
  settings?: Settings;
  className?: string;
}

const defaultSettings: Settings = {
  speechRate: 0.8,
  speechMode: true,
  visualMode: false,
  animations: true,
  highContrast: false,
  deafMode: false
};

export default function ParentRecordingButton({ phonicsData, name, settings, className }: ParentRecordingButtonProps) {
  const safeSettings = settings || defaultSettings;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getRecording, saveRecording } = useParentRecordings();

  const existingRecording = getRecording(name, phonicsData.letter, phonicsData.position);
  const hasRecording = !!existingRecording;

  const handleSave = (recording: Recording) => {
    saveRecording(name, recording);
  };

  return (
    <>
      <Button
        variant={hasRecording ? "default" : "outline"}
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center space-x-2 ${hasRecording ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-purple-300 text-purple-600 hover:bg-purple-50'} ${className || ''}`}
      >
        {hasRecording ? (
          <>
            <Volume2 className="w-4 h-4" />
            <span>Parent Sound</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            <span>Record Sound</span>
          </>
        )}
      </Button>

      <RecordingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          phonics={phonicsData}
          name={name}
          settings={safeSettings}
        />
    </>
  );
}