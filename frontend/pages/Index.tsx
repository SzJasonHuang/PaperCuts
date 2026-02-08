import { PdfWidget } from '@/components/pdf-widget';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">Paper Cuts</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Click the floating button to optimize your PDFs
        </p>
        <Link to="/dashboard">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            View Dashboard
          </Button>
        </Link>
      </div>
      
      {/* Floating PDF Optimizer Widget */}
      <PdfWidget />
    </div>
  );
};

export default Index;
