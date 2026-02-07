import { Session } from '@/types/session';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FileText, Droplet, Gauge } from 'lucide-react';

interface SessionCardProps {
  session: Session;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-warning';
  return 'text-destructive';
};

const getScoreBadge = (score: number) => {
  if (score >= 80) return 'bg-success/20 text-success border-success/30';
  if (score >= 60) return 'bg-warning/20 text-warning border-warning/30';
  return 'bg-destructive/20 text-destructive border-destructive/30';
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
          <CardTitle className="text-base font-mono font-medium leading-tight">
            {session.sessionId}
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`shrink-0 ${getScoreBadge(session.optimizingScore)}`}
          >
            Score: {session.optimizingScore}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center rounded-lg bg-secondary/50 p-3">
            <FileText className="h-4 w-4 text-muted-foreground mb-1" />
            <span className="text-lg font-semibold">{session.pages}</span>
            <span className="text-xs text-muted-foreground">Pages</span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-secondary/50 p-3">
            <Droplet className="h-4 w-4 text-muted-foreground mb-1" />
            <span className="text-lg font-semibold">{session.inkUse.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground">Ink (ml)</span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-secondary/50 p-3">
            <Gauge className="h-4 w-4 text-muted-foreground mb-1" />
            <span className={`text-lg font-semibold ${getScoreColor(session.optimizingScore)}`}>
              {session.optimizingScore}%
            </span>
            <span className="text-xs text-muted-foreground">Optimized</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
          <span className="font-mono text-xs opacity-60">ID: {session._id.slice(-8)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
