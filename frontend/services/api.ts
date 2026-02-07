import { Session, CreateSessionRequest, SessionsResponse, User, UsersResponse, CreateUserRequest } from '@/types/session';

// Configure your Spring Boot backend URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Mock data for development - remove when connecting to real backend
const mockUsers: User[] = [
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0d1',
    userId: 'U12345',
    name: 'Jason Huang',
    isAdmin: false,
    numUser: 1,
    sessionIds: ['65f2a3b4c5d6e7f8a9b0c1d2', '65a3b4c5d6e7f8a9b0c1d2e3'],
    createdAt: '2026-02-07T00:00:00Z',
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0d2',
    userId: 'U12346',
    name: 'Sarah Chen',
    isAdmin: true,
    numUser: 1,
    sessionIds: ['65f2a3b4c5d6e7f8a9b0c1d3'],
    createdAt: '2026-02-06T00:00:00Z',
  },
];

const mockSessions: Session[] = [
  {
    _id: '65f2a3b4c5d6e7f8a9b0c1d2',
    sessionId: 'S98765',
    userId: '65f1a2b3c4d5e6f7a8b9c0d1',
    pages: 42,
    inkUse: 0.18,
    optimizingScore: 82,
    createdAt: '2026-02-07T02:13:00Z',
  },
  {
    _id: '65a3b4c5d6e7f8a9b0c1d2e3',
    sessionId: 'S98766',
    userId: '65f1a2b3c4d5e6f7a8b9c0d1',
    pages: 28,
    inkUse: 0.12,
    optimizingScore: 91,
    createdAt: '2026-02-06T14:30:00Z',
  },
  {
    _id: '65f2a3b4c5d6e7f8a9b0c1d3',
    sessionId: 'S98767',
    userId: '65f1a2b3c4d5e6f7a8b9c0d2',
    pages: 156,
    inkUse: 0.45,
    optimizingScore: 67,
    createdAt: '2026-02-07T09:45:00Z',
  },
];

const USE_MOCK = true; // Set to false when backend is ready

export const sessionsApi = {
  // GET /sessions?userId=...
  async getSessions(userId?: string): Promise<SessionsResponse> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
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
        _id: String(Date.now()),
        sessionId: `S${Math.floor(Math.random() * 100000)}`,
        ...data,
        createdAt: new Date().toISOString(),
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

export const usersApi = {
  // GET /users
  async getUsers(): Promise<UsersResponse> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { users: mockUsers, total: mockUsers.length };
    }

    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  // GET /users/:id
  async getUser(id: string): Promise<User> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const user = mockUsers.find(u => u._id === id || u.userId === id);
      if (!user) throw new Error('User not found');
      return user;
    }

    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  // POST /users
  async createUser(data: CreateUserRequest): Promise<User> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newUser: User = {
        _id: String(Date.now()),
        ...data,
        isAdmin: data.isAdmin ?? false,
        numUser: data.numUser ?? 1,
        sessionIds: [],
        createdAt: new Date().toISOString(),
      };
      mockUsers.push(newUser);
      return newUser;
    }

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },
};
