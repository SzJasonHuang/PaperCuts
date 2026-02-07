import { Session } from '@/types/session';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, User } from 'lucide-react';

interface SessionCardProps {
  session: Session;
}

const statusVariants = {
  active: 'bg-success/20 text-success border-success/30',
  completed: 'bg-muted text-muted-foreground border-muted',
  pending: 'bg-warning/20 text-warning border-warning/30',
};

export function SessionCard({ session }: SessionCardProps) {
  const formattedDate = new Date(session.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-base font-medium leading-tight">
            {session.title}
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`shrink-0 capitalize ${statusVariants[session.status]}`}
          >
            {session.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {session.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {session.description}
          </p>
        )}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span className="font-mono">{session.userId}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>
        {session.metadata && Object.keys(session.metadata).length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {Object.entries(session.metadata).slice(0, 3).map(([key, value]) => (
              <span 
                key={key} 
                className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-mono text-secondary-foreground"
              >
                {key}: {String(value)}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
