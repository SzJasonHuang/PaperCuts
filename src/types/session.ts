export interface Session {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'pending';
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface CreateSessionRequest {
  userId: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface SessionsResponse {
  sessions: Session[];
  total: number;
}
