import { useState } from 'react';
import { FloatingButton } from './FloatingButton';
import { WidgetPanel } from './WidgetPanel';

export const PdfWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <WidgetPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <FloatingButton onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
    </>
  );
};
