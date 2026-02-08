import { FileText, Droplets, TrendingDown, Lightbulb, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { PdfSession } from '@/types/pdf';

interface ResultsStepProps {
  session: PdfSession;
  onOptimize: () => void;
  isOptimizing: boolean;
}

export const ResultsStep = ({ session, onOptimize, isOptimizing }: ResultsStepProps) => {
  const pagesSaved = session.pagesBefore - (session.pagesAfter || session.pagesBefore);
  const inkSavedPercent = session.inkBefore && session.inkAfter
    ? Math.round((1 - session.inkAfter / session.inkBefore) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Metrics Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-muted/50">
          <CardContent className="p-3 text-center">
            <FileText className="h-5 w-5 mx-auto mb-1 text-primary" />
            <div className="text-lg font-bold text-foreground">
              {session.pagesBefore}
              {session.pagesAfter && (
                <span className="text-primary"> → {session.pagesAfter}</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">Pages</div>
            {pagesSaved > 0 && (
              <div className="text-xs text-primary font-medium">-{pagesSaved} saved</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-3 text-center">
            <Droplets className="h-5 w-5 mx-auto mb-1 text-primary" />
            <div className="text-lg font-bold text-foreground">
              {(session.inkBefore * 100).toFixed(0)}%
              {session.inkAfter && (
                <span className="text-primary"> → {(session.inkAfter * 100).toFixed(0)}%</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">Ink Coverage</div>
            {inkSavedPercent > 0 && (
              <div className="text-xs text-primary font-medium">-{inkSavedPercent}% saved</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-3 text-center">
            <TrendingDown className="h-5 w-5 mx-auto mb-1 text-primary" />
            <div className="text-lg font-bold text-foreground">
              {session.optimizingScore || 0}
            </div>
            <div className="text-xs text-muted-foreground">Score</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Suggestions */}
      {session.suggestions && session.suggestions.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-accent-foreground" />
              <span className="font-medium text-foreground">AI Recommendations</span>
            </div>
            <ul className="space-y-2">
              {session.suggestions.map((suggestion, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-primary">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Changes Applied */}
      {session.changesApplied && session.changesApplied.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="font-medium text-primary mb-2">
              ✓ Changes Applied
            </div>
            <ul className="space-y-1">
              {session.changesApplied.map((change, idx) => (
                <li key={idx} className="text-sm text-primary/80">
                  {change}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      <Button onClick={onOptimize} disabled={isOptimizing} className="w-full" size="lg">
        {isOptimizing ? 'Optimizing...' : (
          <>
            Preview & Download
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};
