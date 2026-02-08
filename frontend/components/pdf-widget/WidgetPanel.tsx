import { useState, useEffect } from 'react';
import { X, Upload, BarChart3, Eye, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UploadStep } from './UploadStep';
import { ResultsStep } from './ResultsStep';
import { PreviewStep } from './PreviewStep';
import { pdfApi } from '@/services/pdfApi';
import { useToast } from '@/hooks/use-toast';
import type { PdfSession, OptimizeSettings } from '@/types/pdf';

type Step = 'upload' | 'results' | 'preview';

interface WidgetPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: 'upload', label: 'Upload', icon: <Upload className="h-4 w-4" /> },
  { id: 'results', label: 'Results', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'preview', label: 'Preview', icon: <Eye className="h-4 w-4" /> }
];

export const WidgetPanel = ({ isOpen, onClose }: WidgetPanelProps) => {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [session, setSession] = useState<PdfSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);
  const [settings, setSettings] = useState<OptimizeSettings>({
    inkSaverLevel: 50,
    pageSaverLevel: 50,
    preserveQuality: true,
    excludeImages: false
  });

  const { toast } = useToast();
  const config = pdfApi.getConfig();

  // Check backend connection on mount
  useEffect(() => {
    if (isOpen && !config.useMock) {
      pdfApi.checkHealth().then(setBackendConnected);
    } else if (config.useMock) {
      setBackendConnected(true);
    }
  }, [isOpen, config.useMock]);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    try {
      // Upload the file
      const uploadResponse = await pdfApi.uploadPdf(file);
      
      toast({
        title: "PDF Uploaded",
        description: `Analyzing ${file.name}...`,
      });
      
      // Analyze the PDF
      const analysis = await pdfApi.analyzePdf(uploadResponse.sessionId);
      
      // Create session object from analysis
      const newSession: PdfSession = {
        id: uploadResponse.sessionId,
        originalFileName: uploadResponse.originalFileName,
        pagesBefore: analysis.pagesBefore,
        inkBefore: analysis.inkBefore,
        optimizingScore: analysis.optimizingScore,
        suggestions: analysis.recommendations,
        status: 'ANALYZED',
        createdAt: new Date().toISOString()
      };
      
      setSession(newSession);
      setCurrentStep('results');

      toast({
        title: "Analysis Complete",
        description: `Found ${analysis.recommendations.length} optimization opportunities`,
      });
    } catch (error) {
      console.error('Upload/analysis failed:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Could not connect to backend",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!session) return;
    
    setIsLoading(true);
    try {
      const optimizedSession = await pdfApi.optimizePdf(session.id, settings);
      setSession(optimizedSession);
      setCurrentStep('preview');

      const pagesSaved = (optimizedSession.pagesBefore || 0) - (optimizedSession.pagesAfter || 0);
      toast({
        title: "Optimization Complete",
        description: `Saved ${pagesSaved} pages, reduced ink by ${Math.round((1 - (optimizedSession.inkAfter || 0) / (optimizedSession.inkBefore || 1)) * 100)}%`,
      });
    } catch (error) {
      console.error('Optimization failed:', error);
      toast({
        variant: "destructive",
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "Could not optimize PDF",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!session) return;
    
    setIsLoading(true);
    try {
      const optimizedSession = await pdfApi.optimizePdf(session.id, settings);
      setSession(optimizedSession);

      toast({
        title: "Regeneration Complete",
        description: "PDF has been re-optimized with new settings",
      });
    } catch (error) {
      console.error('Regeneration failed:', error);
      toast({
        variant: "destructive",
        title: "Regeneration Failed",
        description: error instanceof Error ? error.message : "Could not regenerate PDF",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSession(null);
    setCurrentStep('upload');
    setSettings({
      inkSaverLevel: 50,
      pageSaverLevel: 50,
      preserveQuality: true,
      excludeImages: false
    });
  };

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div
      className={cn(
        "fixed bottom-24 right-6 z-50 w-[400px] max-h-[80vh] overflow-hidden",
        "bg-background border rounded-xl shadow-2xl",
        "transition-all duration-300 ease-out",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">PDF Optimizer</span>
          {/* Connection Status */}
          {!config.useMock && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
              backendConnected === null ? "bg-muted text-muted-foreground" :
              backendConnected ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
            )}>
              {backendConnected === null ? (
                <span>Checking...</span>
              ) : backendConnected ? (
                <>
                  <Wifi className="h-3 w-3" />
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  <span>Offline</span>
                </>
              )}
            </div>
          )}
          {config.useMock && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-accent text-accent-foreground">
              Demo Mode
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {session && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              New
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Backend Offline Warning */}
      {!config.useMock && backendConnected === false && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border-b text-destructive text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>Backend not connected. Start with: <code className="bg-background px-1 rounded">cd backend && ./mvnw spring-boot:run</code></span>
        </div>
      )}

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 p-3 border-b">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => idx > 0 && idx < currentStepIndex && setCurrentStep(step.id)}
              disabled={idx === 0 || idx >= currentStepIndex}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors",
                idx <= currentStepIndex
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
                idx > 0 && idx < currentStepIndex && "cursor-pointer hover:opacity-80"
              )}
            >
              {step.icon}
              <span className="hidden sm:inline">{step.label}</span>
            </button>
            {idx < steps.length - 1 && (
              <div className={cn(
                "w-6 h-0.5 mx-1",
                idx < currentStepIndex ? "bg-primary" : "bg-muted"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
        {currentStep === 'upload' && (
          <UploadStep 
            onUpload={handleUpload} 
            isUploading={isLoading} 
          />
        )}
        
        {currentStep === 'results' && session && (
          <ResultsStep
            session={session}
            onOptimize={handleOptimize}
            isOptimizing={isLoading}
          />
        )}
        
        {currentStep === 'preview' && session && (
          <PreviewStep
            session={session}
            settings={settings}
            onSettingsChange={setSettings}
            onRegenerate={handleRegenerate}
            isRegenerating={isLoading}
          />
        )}
      </div>
    </div>
  );
};
