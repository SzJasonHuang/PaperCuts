# Sessions API - Spring Boot Backend

> **Note:** This folder contains the Spring Boot backend template. Run this separately from the React frontend.

## Quick Start

```bash
cd backend
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`

## Project Structure

```
backend/
├── src/main/java/com/sessions/
│   ├── SessionsApplication.java      # Main entry point
│   ├── controller/
│   │   └── SessionController.java    # REST endpoints
│   ├── model/
│   │   └── Session.java              # MongoDB document
│   ├── repository/
│   │   └── SessionRepository.java    # MongoDB repository
│   └── service/
│       └── SessionService.java       # Business logic
├── src/main/resources/
│   └── application.properties        # MongoDB connection config
└── pom.xml                           # Maven dependencies
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sessions` | Get all sessions |
| GET | `/api/sessions?userId={id}` | Get sessions by user ID |
| POST | `/api/sessions` | Create a new session |

## MongoDB Atlas Setup (Teammate A)

1. Create cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Get connection string
3. Add to `application.properties`:
   ```properties
   spring.data.mongodb.uri=mongodb+srv://<user>:<pass>@cluster.mongodb.net/sessions
   ```

## Required Indexes

```javascript
// Create in MongoDB Atlas
db.sessions.createIndex({ "userId": 1 })
db.sessions.createIndex({ "createdAt": -1 })
db.sessions.createIndex({ "userId": 1, "createdAt": -1 })
```

## Connecting Frontend

Set the environment variable in the React app:
```bash
VITE_API_URL=http://localhost:8080/api
```

Then set `USE_MOCK = false` in `src/services/api.ts`
