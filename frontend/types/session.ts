export interface User {
  _id: string;
  userId: string;           // app-level ID (e.g., "U12345")
  name: string;
  isAdmin: boolean;
  numUser: number;          // if individual; move to org if company-level
  sessionIds: string[];     // references to sessions._id
  createdAt: string;
}

export interface Session {
  _id: string;
  sessionId: string;        // optional readable ID (e.g., "S98765")
  userId: string;           // reference to users._id
  pages: number;
  inkUse: number;           // normalized or ml
  optimizingScore: number;  // 0-100
  createdAt: string;
}

export interface CreateSessionRequest {
  userId: string;
  pages: number;
  inkUse: number;
  optimizingScore: number;
}

export interface SessionsResponse {
  sessions: Session[];
  total: number;
}

export interface UsersResponse {
  users: User[];
  total: number;
}

export interface CreateUserRequest {
  userId: string;
  name: string;
  isAdmin?: boolean;
  numUser?: number;
}
