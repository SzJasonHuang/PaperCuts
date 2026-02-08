import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Droplets, FileText } from 'lucide-react';
import type { OptimizeSettings } from '@/types/pdf';

interface OptimizationControlsProps {
  settings: OptimizeSettings;
  onSettingsChange: (settings: OptimizeSettings) => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const OptimizationControls = ({
  settings,
  onSettingsChange,
  onRegenerate,
  isRegenerating
}: OptimizationControlsProps) => {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Ink Saver Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-primary" />
              Ink Saver
            </Label>
            <span className="text-sm text-muted-foreground">{settings.inkSaverLevel}%</span>
          </div>
          <Slider
            value={[settings.inkSaverLevel]}
            onValueChange={([value]) => 
              onSettingsChange({ ...settings, inkSaverLevel: value })
            }
            max={100}
            step={10}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Higher = more aggressive grayscale & compression
          </p>
        </div>

        {/* Page Saver Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Page Saver
            </Label>
            <span className="text-sm text-muted-foreground">{settings.pageSaverLevel}%</span>
          </div>
          <Slider
            value={[settings.pageSaverLevel]}
            onValueChange={([value]) => 
              onSettingsChange({ ...settings, pageSaverLevel: value })
            }
            max={100}
            step={10}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Higher = tighter margins & smaller images
          </p>
        </div>

        {/* Toggles */}
        <div className="flex items-center justify-between">
          <Label htmlFor="preserve-quality" className="cursor-pointer">
            Preserve Quality
          </Label>
          <Switch
            id="preserve-quality"
            checked={settings.preserveQuality}
            onCheckedChange={(checked) => 
              onSettingsChange({ ...settings, preserveQuality: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="exclude-images" className="cursor-pointer">
            Exclude Images
          </Label>
          <Switch
            id="exclude-images"
            checked={settings.excludeImages || false}
            onCheckedChange={(checked) => 
              onSettingsChange({ ...settings, excludeImages: checked })
            }
          />
        </div>

        {/* Regenerate Button */}
        <Button 
          onClick={onRegenerate} 
          disabled={isRegenerating}
          variant="outline"
          className="w-full"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          {isRegenerating ? 'Regenerating...' : 'Regenerate with Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};
