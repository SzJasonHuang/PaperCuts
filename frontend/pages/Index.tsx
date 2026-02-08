import { PdfWidget } from '@/components/pdf-widget';

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">Sessions Dashboard</h1>
        <p className="text-xl text-muted-foreground">
          Click the floating button to optimize your PDFs
        </p>
      </div>
      
      {/* Floating PDF Optimizer Widget */}
      <PdfWidget />
    </div>
  );
};

export default Index;
