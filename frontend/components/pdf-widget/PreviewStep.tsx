import { useState } from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OptimizationControls } from './OptimizationControls';
import { pdfApi } from '@/services/pdfApi';
import type { PdfSession, OptimizeSettings } from '@/types/pdf';

interface PreviewStepProps {
  session: PdfSession;
  settings: OptimizeSettings;
  onSettingsChange: (settings: OptimizeSettings) => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const PreviewStep = ({
  session,
  settings,
  onSettingsChange,
  onRegenerate,
  isRegenerating
}: PreviewStepProps) => {
  const [activeTab, setActiveTab] = useState<'original' | 'optimized'>('optimized');

  const originalUrl = pdfApi.getOriginalPdfUrl(session.id);
  const optimizedUrl = pdfApi.getOptimizedPdfUrl(session.id);

  const handleDownload = (type: 'original' | 'optimized') => {
    const url = type === 'original' ? originalUrl : optimizedUrl;
    const filename = type === 'original' 
      ? session.originalFileName 
      : `optimized_${session.originalFileName}`;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Controls */}
      <OptimizationControls
        settings={settings}
        onSettingsChange={onSettingsChange}
        onRegenerate={onRegenerate}
        isRegenerating={isRegenerating}
      />

      {/* PDF Preview Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'original' | 'optimized')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="original">
            Original ({session.pagesBefore} pages)
          </TabsTrigger>
          <TabsTrigger value="optimized">
            Optimized ({session.pagesAfter || session.pagesBefore} pages)
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="original" className="mt-3">
          <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="mb-2">Original PDF Preview</p>
              <Button variant="outline" size="sm" asChild>
                <a href={originalUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in New Tab
                </a>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="optimized" className="mt-3">
          <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="mb-2">Optimized PDF Preview</p>
              <Button variant="outline" size="sm" asChild>
                <a href={optimizedUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in New Tab
                </a>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Download Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={() => handleDownload('original')}>
          <Download className="mr-2 h-4 w-4" />
          Original
        </Button>
        <Button onClick={() => handleDownload('optimized')}>
          <Download className="mr-2 h-4 w-4" />
          Optimized
        </Button>
      </div>
    </div>
  );
};
