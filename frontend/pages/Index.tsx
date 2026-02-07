import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionsApi } from '@/services/api';
import { CreateSessionRequest } from '@/types/session';
import { Header } from '@/components/Header';
import { SessionCard } from '@/components/SessionCard';
import { SessionsFilter } from '@/components/SessionsFilter';
import { CreateSessionDialog } from '@/components/CreateSessionDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { AlertCircle, Inbox } from 'lucide-react';

const Index = () => {
  const [userIdFilter, setUserIdFilter] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['sessions', userIdFilter],
    queryFn: () => sessionsApi.getSessions(userIdFilter || undefined),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateSessionRequest) => sessionsApi.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Session created successfully');
    },
    onError: () => {
      toast.error('Failed to create session');
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Page header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Print Sessions</h2>
          <p className="text-muted-foreground mt-1">
            Monitor print sessions, pages, ink usage, and optimization scores.
          </p>
        </div>

        {/* Actions bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <SessionsFilter 
            userId={userIdFilter} 
            onUserIdChange={setUserIdFilter} 
          />
          <CreateSessionDialog 
            onSubmit={createMutation.mutateAsync}
            isLoading={createMutation.isPending}
          />
        </div>

        {/* Stats */}
        {data && (
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{data.total}</span>
            {data.total === 1 ? 'session' : 'sessions'} found
            {userIdFilter && (
              <span className="text-xs">
                for <code className="rounded bg-muted px-1.5 py-0.5 font-mono">{userIdFilter}</code>
              </span>
            )}
          </div>
        )}

        {/* Sessions grid */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[220px] rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold">Failed to load sessions</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Check your backend connection and try again.
            </p>
          </div>
        ) : data?.sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Inbox className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold">No sessions found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {userIdFilter 
                ? `No sessions for user "${userIdFilter}"`
                : 'Create your first session to get started'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.sessions.map((session) => (
              <SessionCard key={session._id} session={session} />
            ))}
          </div>
        )}

        {/* API Reference */}
        <div className="mt-12 rounded-lg border border-border/50 bg-card/50 p-6">
          <h3 className="text-lg font-semibold mb-4">API Reference</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="rounded bg-success/20 px-2 py-0.5 text-xs font-bold text-success">GET</span>
                <code className="text-sm font-mono">/sessions?userId=...</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Fetch sessions, optionally filtered by userId (ObjectId)
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="rounded bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary">POST</span>
                <code className="text-sm font-mono">/sessions</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Create session with userId, pages, inkUse, optimizingScore
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
