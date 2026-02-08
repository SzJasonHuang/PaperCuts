import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const FloatingButton = ({ onClick, isOpen }: FloatingButtonProps) => {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={cn(
        "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-300",
        "bg-primary hover:bg-primary/90 hover:scale-110",
        "flex items-center justify-center",
        isOpen && "rotate-45 bg-destructive hover:bg-destructive/90"
      )}
    >
      <FileText className="h-6 w-6" />
    </Button>
  );
};
