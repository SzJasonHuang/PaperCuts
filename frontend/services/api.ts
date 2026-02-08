import { Session, CreateSessionRequest, SessionsResponse, User, UsersResponse, CreateUserRequest } from '@/types/session';

// Configure your Spring Boot backend URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'; // 8080 here is referencing the backend port, not the frontend.



const USE_MOCK = false; // Set to false when backend is ready

export const sessionsApi = {
  // GET /sessions?userId=...
  async getSessions(userId?: string): Promise<SessionsResponse> {

    const url = new URL(`${API_BASE_URL}/sessions`);
    if (userId) url.searchParams.set('userId', userId);
    
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to fetch sessions');
    return response.json();
  },

  // POST /sessions
  async createSession(data: CreateSessionRequest): Promise<Session> {

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

    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  // GET /users/:id
  async getUser(id: string): Promise<User> {

    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  // POST /users
  async createUser(data: CreateUserRequest): Promise<User> {

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },
};
