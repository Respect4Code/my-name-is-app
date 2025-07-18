import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Volume2 } from "lucide-react";
import RecordingModal from "./recording-modal";
import { PhonicsData } from "@/lib/phonics";
import { useParentRecordings } from "@/hooks/use-parent-recordings";
import { Recording } from "@/hooks/use-recording";
import type { Settings } from "@/pages/home";

interface ParentRecordingButtonProps {
  name: string;
  phonicsData: PhonicsData;
  settings: Settings;
  className?: string;
}

export default function ParentRecordingButton({ 
  name, 
  phonicsData, 
  settings,
  className = "" 
}: ParentRecordingButtonProps) {
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
        className={`flex items-center space-x-2 ${hasRecording ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-purple-300 text-purple-600 hover:bg-purple-50'} ${className}`}
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
        settings={settings}
      />
    </>
  );
}