import { useState, useEffect } from 'react';
import { Download, ExternalLink, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [reportHtml, setReportHtml] = useState<string | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(true);

  const originalUrl = pdfApi.getOriginalPdfUrl(session.id);
  const reportDownloadUrl = pdfApi.getReportDownloadUrl(session.id);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setIsLoadingReport(true);
        const html = await pdfApi.getReportHtml(session.id);
        setReportHtml(html);
      } catch (error) {
        console.error('Failed to load report:', error);
      } finally {
        setIsLoadingReport(false);
      }
    };
    loadReport();
  }, [session.id]);

  const handleDownloadReport = () => {
    const link = document.createElement('a');
    link.href = reportDownloadUrl;
    link.download = `${session.originalFileName.replace('.pdf', '')}_report.html`;
    link.click();
  };

  const handleDownloadOriginal = () => {
    const link = document.createElement('a');
    link.href = originalUrl;
    link.download = session.originalFileName;
    link.click();
  };

  // Calculate savings
  const inkSavings = session.inkBefore && session.inkAfter 
    ? Math.round((1 - session.inkAfter / session.inkBefore) * 100)
    : 15;

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Savings Summary */}
      <div className="bg-accent/50 rounded-lg p-3 border border-accent">
        <div className="flex items-center gap-2 text-primary font-medium mb-1">
          <FileText className="h-4 w-4" />
          Optimization Report Ready
        </div>
        <p className="text-sm text-muted-foreground">
          Estimated savings: ~{inkSavings}% ink reduction with 3 recommended edits
        </p>
      </div>

      {/* Side-by-side Preview */}
      <div className="grid grid-cols-2 gap-3">
        {/* Original PDF */}
        <div className="flex flex-col">
          <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            Original PDF
          </div>
          <div className="bg-muted rounded-lg h-48 flex items-center justify-center border">
            <div className="text-center text-muted-foreground p-3">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs mb-2">{session.originalFileName}</p>
              <p className="text-xs opacity-70">{session.pagesBefore} pages</p>
              <Button variant="ghost" size="sm" className="mt-2" asChild>
                <a href={originalUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1 h-3 w-3" />
                  View
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* HTML Report */}
        <div className="flex flex-col">
          <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            Download EcoPDF
          </div>
          <div className="bg-background rounded-lg h-48 border overflow-hidden">
            {isLoadingReport ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : reportHtml ? (
              <iframe
                srcDoc={reportHtml}
                className="w-full h-full border-0"
                title="Optimization Report"
                sandbox="allow-same-origin"
                style={{ overflow: 'hidden' }}
                scrolling="no"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Failed to load report
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Regenerate Button */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRegenerate}
        disabled={isRegenerating}
        className="w-full"
      >
        {isRegenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Regenerating...
          </>
        ) : (
          'Regenerate Report'
        )}
      </Button>

      {/* Download Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={handleDownloadOriginal}>
          <Download className="mr-2 h-4 w-4" />
          Original PDF
        </Button>
        <Button onClick={handleDownloadReport}>
          <Download className="mr-2 h-4 w-4" />
          Download EcoPDF
        </Button>
      </div>
    </div>
  );
};
