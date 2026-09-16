import { PdfWidget } from '@/components/pdf-widget';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart3, Leaf, FileText, Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-6">
      <div className="relative z-10 max-w-xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
          <Leaf className="h-3.5 w-3.5 text-success" />
          Print less. Waste less.
        </div>

        <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground">
          Paper <span className="text-primary">Cuts</span>
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
          Drop in a PDF and get an instant report on wasted pages, ink coverage, and the
          exact edits that would make it lighter to print.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <div className="inline-flex items-center gap-2 rounded-lg border bg-card/60 px-4 py-2.5 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Click the button in the corner to start
          </div>
          <Link to="/dashboard">
            <Button variant="outline" className="w-full gap-2 sm:w-auto">
              <BarChart3 className="h-4 w-4" />
              View Dashboard
            </Button>
          </Link>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <FileText className="h-3.5 w-3.5" />
          Supports PDFs up to 50MB
        </div>
      </div>

      {/* Floating PDF Optimizer Widget */}
      <PdfWidget />
    </div>
  );
};

export default Index;
