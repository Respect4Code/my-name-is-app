import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Volume2, Eye, Zap, Contrast, X } from "lucide-react";
import type { Settings as SettingsType } from "@/pages/home";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsType;
  onSettingsChange: (settings: SettingsType) => void;
}

export default function SettingsModal({ isOpen, onClose, settings, onSettingsChange }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<SettingsType>(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings: Settings = {
      speechMode: true,
      visualMode: false,
      animations: true,
      speechRate: 0.8,
      highContrast: false,
    };
    setLocalSettings(defaultSettings);
    onSettingsChange(defaultSettings);
  };

  const handleSettingChange = (key: keyof Settings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center justify-between">
            Accessibility Settings
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Close settings"
            >
              <X className="w-6 h-6" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Speech Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <Label className="flex items-center gap-3 cursor-pointer">
              <Volume2 className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Speech Mode</span>
            </Label>
            <Switch
              checked={localSettings.speechMode}
              onCheckedChange={(checked) => handleSettingChange('speechMode', checked)}
              aria-label="Toggle speech mode"
            />
          </div>
          
          {/* Visual Only Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <Label className="flex items-center gap-3 cursor-pointer">
              <Eye className="w-5 h-5 text-green-600" />
              <span className="font-medium">Visual Only Mode</span>
            </Label>
            <Switch
              checked={localSettings.visualMode}
              onCheckedChange={(checked) => handleSettingChange('visualMode', checked)}
              aria-label="Toggle visual only mode"
            />
          </div>
          
          {/* Animations Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <Label className="flex items-center gap-3 cursor-pointer">
              <Zap className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Animations</span>
            </Label>
            <Switch
              checked={localSettings.animations}
              onCheckedChange={(checked) => handleSettingChange('animations', checked)}
              aria-label="Toggle animations"
            />
          </div>
          
          {/* Speech Rate Slider */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <Label className="block text-sm font-medium mb-3 text-gray-700">Speech Rate</Label>
            <Slider
              value={[localSettings.speechRate]}
              onValueChange={(value) => handleSettingChange('speechRate', value[0])}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
              aria-label="Adjust speech rate"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Slow</span>
              <span className="font-medium">{localSettings.speechRate.toFixed(1)}x</span>
              <span>Fast</span>
            </div>
          </div>
          
          {/* High Contrast Mode */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <Label className="flex items-center gap-3 cursor-pointer">
              <Contrast className="w-5 h-5 text-gray-600" />
              <span className="font-medium">High Contrast</span>
            </Label>
            <Switch
              checked={localSettings.highContrast}
              onCheckedChange={(checked) => handleSettingChange('highContrast', checked)}
              aria-label="Toggle high contrast mode"
            />
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="flex gap-3 mt-8">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1"
          >
            Reset to Defaults
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
