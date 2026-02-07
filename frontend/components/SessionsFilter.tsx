import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SessionsFilterProps {
  userId: string;
  onUserIdChange: (userId: string) => void;
}

export function SessionsFilter({ userId, onUserIdChange }: SessionsFilterProps) {
  return (
    <div className="relative w-full max-w-xs">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Filter by user ID..."
        value={userId}
        onChange={(e) => onUserIdChange(e.target.value)}
        className="pl-9 font-mono text-sm"
      />
    </div>
  );
}
