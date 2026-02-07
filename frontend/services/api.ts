import { Session, CreateSessionRequest, SessionsResponse } from '@/types/session';

// Configure your Spring Boot backend URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Mock data for development - remove when connecting to real backend
const mockSessions: Session[] = [
  {
    id: '1',
    userId: 'user-001',
    title: 'Data Processing Pipeline',
    description: 'ETL job for customer analytics',
    status: 'active',
    createdAt: '2026-02-07T10:30:00Z',
    updatedAt: '2026-02-07T10:30:00Z',
    metadata: { type: 'etl', priority: 'high' }
  },
  {
    id: '2',
    userId: 'user-001',
    title: 'ML Model Training',
    description: 'Training recommendation engine v2',
    status: 'completed',
    createdAt: '2026-02-06T14:00:00Z',
    updatedAt: '2026-02-07T08:00:00Z',
    metadata: { type: 'ml', model: 'recommendation-v2' }
  },
  {
    id: '3',
    userId: 'user-002',
    title: 'API Integration Test',
    description: 'Testing third-party payment gateway',
    status: 'pending',
    createdAt: '2026-02-07T09:00:00Z',
    updatedAt: '2026-02-07T09:00:00Z',
    metadata: { type: 'integration', service: 'stripe' }
  },
  {
    id: '4',
    userId: 'user-001',
    title: 'Database Migration',
    description: 'Migrating to new schema version',
    status: 'active',
    createdAt: '2026-02-07T11:00:00Z',
    updatedAt: '2026-02-07T11:15:00Z',
    metadata: { type: 'migration', version: '2.0' }
  },
];

const USE_MOCK = true; // Set to false when backend is ready

export const sessionsApi = {
  // GET /sessions?userId=...
  async getSessions(userId?: string): Promise<SessionsResponse> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      const filtered = userId 
        ? mockSessions.filter(s => s.userId === userId)
        : mockSessions;
      return { sessions: filtered, total: filtered.length };
    }

    const url = new URL(`${API_BASE_URL}/sessions`);
    if (userId) url.searchParams.set('userId', userId);
    
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to fetch sessions');
    return response.json();
  },

  // POST /sessions
  async createSession(data: CreateSessionRequest): Promise<Session> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newSession: Session = {
        id: String(mockSessions.length + 1),
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockSessions.push(newSession);
      return newSession;
    }

    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create session');
    return response.json();
  },
};
