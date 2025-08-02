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
import { Mic, Play, Stop, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRecording } from "@/hooks/use-recording";
import { useParentRecordings } from "@/hooks/use-parent-recordings";
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

  const { getRecording, saveRecording, deleteRecording } = useParentRecordings();
  const { recording, startRecording, stopRecording, playRecording, stopPlaying, hasRecording } = useRecording({
    phonics,
    name,
    settings,
  });

  // Check for existing saved recording
  const existingRecording = getRecording(name, phonics.letter, phonics.position);
  const hasSavedRecording = !!existingRecording;

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

  const handlePlaySaved = async () => {
    if (existingRecording && !isPlaying) {
      setIsPlaying(true);
      try {
        const audio = new Audio(existingRecording.audioUrl);
        audio.volume = volume / 100;
        await audio.play();
        audio.onended = () => setIsPlaying(false);
      } catch (error) {
        console.error("Error playing saved recording:", error);
        toast({
          title: "Error Playing",
          description: "There was an error playing the saved recording.",
          variant: "destructive",
        });
        setIsPlaying(false);
      }
    }
  };

  const handleSave = () => {
    if (recording) {
      const recordingData = {
        id: `${phonics.letter}-${phonics.position}`,
        audioUrl: recording,
        letter: phonics.letter,
        position: phonics.position,
        type: 'phonetic' as const,
        createdAt: new Date()
      };
      saveRecording(name, recordingData);
      toast({
        title: "Recording Saved!",
        description: `Voice recording for letter ${phonics.letter} has been saved.`,
      });
    }
  };

  const handleDelete = () => {
    if (existingRecording) {
      deleteRecording(name, phonics.letter, phonics.position);
      toast({
        title: "Recording Deleted",
        description: `Voice recording for letter ${phonics.letter} has been deleted.`,
      });
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
            Record the sound for letter "{phonics.letter}" in "{name}"
          </DialogDescription>
        </DialogHeader>

        {/* What is your name? Recording Option */}
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">✨ Special Recording</h3>
          <p className="text-sm text-blue-700 mb-3">
            Record "What is your name?" in your voice for social confidence practice
          </p>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-blue-100 border-blue-300 hover:bg-blue-200 text-blue-800"
          >
            🎤 Record Question
          </Button>
        </div>

        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="volume" className="text-sm font-medium">Volume</label>
            <Slider
              id="volume"
              defaultValue={[volume]}
              max={100}
              step={1}
              onValueChange={onVolumeChange}
              className="flex-1"
            />
            <span className="text-sm text-gray-500 w-10">{volume}%</span>
          </div>

          <audio ref={audioRef} style={{ display: "none" }} controls />

          {/* Show existing recording if available */}
          {hasSavedRecording && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium mb-2">✓ Existing Recording Found</p>
              <div className="flex gap-2">
                <Button
                  onClick={handlePlaySaved}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-green-100 border-green-300 hover:bg-green-200"
                  disabled={isPlaying}
                >
                  {isPlaying ? (
                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span>Play Saved</span>
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-red-100 border-red-300 hover:bg-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </Button>
              </div>
            </div>
          )}

          {/* Recording controls */}
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {hasSavedRecording ? 'Record New Voice:' : 'Create New Recording:'}
            </p>

            {!recording ? (
              <Button
                onClick={startRecording}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 bg-purple-50 border-purple-200 hover:bg-purple-100"
              >
                <Mic className="w-4 h-4" />
                <span>{hasSavedRecording ? 'Re-record Voice' : 'Start Recording'}</span>
              </Button>
            ) : (
              <div className="space-y-2">
                <Button
                  onClick={handlePlay}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 bg-blue-50 border-blue-200 hover:bg-blue-100"
                  disabled={isPlaying}
                >
                  {isPlaying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span>Playing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Play New Recording</span>
                    </>
                  )}
                </Button>
                <Button
                  onClick={stopRecording}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 bg-red-50 border-red-200 hover:bg-red-100"
                >
                  <Stop className="w-4 h-4" />
                  <span>Stop & Clear</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {recording && (
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              Save Recording
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}