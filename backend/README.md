# Sessions API - Spring Boot Backend

> **Note:** This folder contains the Spring Boot backend template. Run this separately from the React frontend.

## Quick Start

```bash
cd backend
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`

## Collections Schema

### Users Collection
```javascript
{
  _id: ObjectId("..."),
  userId: "U12345",          // app-level ID
  name: "Jason Huang",
  isAdmin: false,
  numUser: 1,               // if individual; move to org if company-level
  sessionIds: [ObjectId("65f..."), ObjectId("65a...")],
  createdAt: ISODate("2026-02-07T00:00:00Z")
}
```

### Sessions Collection
```javascript
{
  _id: ObjectId("65f..."),
  sessionId: "S98765",       // optional readable ID
  userId: ObjectId("..."),   // reference to users._id
  pages: 42,
  inkUse: 0.18,              // normalized or ml
  optimizingScore: 82,       // 0-100
  createdAt: ISODate("2026-02-07T02:13:00Z")
}
```

## Project Structure

```
backend/
├── src/main/java/com/sessions/
│   ├── SessionsApplication.java
│   ├── config/
│   │   └── WebConfig.java           # CORS config
│   ├── controller/
│   │   ├── SessionController.java   # /api/sessions endpoints
│   │   └── UserController.java      # /api/users endpoints
│   ├── model/
│   │   ├── Session.java
│   │   └── User.java
│   └── repository/
│       ├── SessionRepository.java
│       └── UserRepository.java
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

## API Endpoints

### Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sessions` | Get all sessions |
| GET | `/api/sessions?userId={id}` | Get sessions by user ObjectId |
| POST | `/api/sessions` | Create session (userId, pages, inkUse, optimizingScore) |
| GET | `/api/sessions/{id}` | Get session by id |
| PUT | `/api/sessions/{id}` | Update session |
| DELETE | `/api/sessions/{id}` | Delete session |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/{id}` | Get user by ObjectId or userId |
| POST | `/api/users` | Create user (userId, name, isAdmin?, numUser?) |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |
| GET | `/api/users/inkTotal/{id}` | Get total ink used by user |
| GET | `/api/users/pageTotal/{id}` | Get total pages printed by user |
| GET | `/api/users/avgScore/{id}` | Get user's average optimization score |
| POST | `/api/users/{id}/sessions/{sessionId}` | Add session to user |

### PDF Processing
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/pdf/upload` | Upload PDF (multipart: file, userId?) |
| POST | `/api/pdf/{id}/analyze` | Analyze PDF, returns metrics + suggestions |
| POST | `/api/pdf/{id}/optimize` | Optimize PDF with settings |
| GET | `/api/pdf/{id}/status` | Get session status and metrics |
| GET | `/api/pdf/{id}/original` | Download original PDF |
| GET | `/api/pdf/{id}/optimized` | Download optimized PDF |
| DELETE | `/api/pdf/{id}` | Delete session and files |

## MongoDB Atlas Setup (Teammate A)

1. Create cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Get connection string
3. Add to `application.properties`:
   ```properties
   spring.data.mongodb.uri=mongodb+srv://<user>:<pass>@cluster.mongodb.net/sessions
   ```

## Required Indexes

```javascript
// Users collection
db.users.createIndex({ "userId": 1 }, { unique: true })
db.users.createIndex({ "createdAt": -1 })

// Sessions collection
db.sessions.createIndex({ "userId": 1 })
db.sessions.createIndex({ "sessionId": 1 })
db.sessions.createIndex({ "createdAt": -1 })
db.sessions.createIndex({ "optimizingScore": 1 })
```

## Connecting Frontend

Set the environment variable in the React app:
```bash
VITE_API_URL=http://localhost:8080/api
```

Then set `USE_MOCK = false` in `frontend/services/api.ts`
