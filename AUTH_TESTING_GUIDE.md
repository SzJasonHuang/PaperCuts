# Auth Controller Test Cases

## Base URL
```
http://localhost:8080
```

## Test Cases

### 1. Register User (POST /api/auth/register)
**Success Case:**
```
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "name": "testuser",
  "password": "password123",
  "isAdmin": false
}
```
**Expected Response:** 201 Created
```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "testuser",
    "password": "password123",
    "isAdmin": false,
    "sessionIds": [],
    "createdAt": "2026-02-08T02:04:38..."
  },
  "message": "User registered successfully"
}
```

---

### 2. Login User (POST /api/auth/login)
**Success Case:**
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "name": "testuser",
  "password": "password123"
}
```
**Expected Response:** 200 OK
```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "testuser",
    "password": "password123",
    "isAdmin": false,
    "sessionIds": [],
    "createdAt": "..."
  },
  "message": "Login successful"
}
```

---

### 3. Login with Wrong Password (POST /api/auth/login)
**Failure Case:**
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "name": "testuser",
  "password": "wrongpassword"
}
```
**Expected Response:** 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 4. Register Duplicate User (POST /api/auth/register)
**Failure Case:**
```
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "name": "testuser",
  "password": "password789",
  "isAdmin": false
}
```
**Expected Response:** 409 Conflict
```json
{
  "success": false,
  "message": "User already exists"
}
```

---

### 5. Register with Short Password (POST /api/auth/register)
**Validation Failure:**
```
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "name": "shortpass",
  "password": "123",
  "isAdmin": false
}
```
**Expected Response:** 400 Bad Request
```json
{
  "success": false,
  "message": "Password must be at least 6 characters"
}
```

---

### 6. Validate User (GET /api/auth/validate/{userId})
**Success Case:**
```
GET http://localhost:8080/api/auth/validate/testuser
```
**Expected Response:** 200 OK
```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "testuser",
    "password": "password123",
    "isAdmin": false,
    "sessionIds": [],
    "createdAt": "..."
  }
}
```

---

### 7. Validate Non-existent User (GET /api/auth/validate/{userId})
**Failure Case:**
```
GET http://localhost:8080/api/auth/validate/nonexistent
```
**Expected Response:** 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

---

### 8. Change Password (PUT /api/auth/change-password)
**Success Case:**
```
PUT http://localhost:8080/api/auth/change-password
Content-Type: application/json

{
  "userId": "testuser",
  "oldPassword": "password123",
  "newPassword": "newpassword456"
}
```
**Expected Response:** 200 OK
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 9. Change Password with Wrong Old Password (PUT /api/auth/change-password)
**Failure Case:**
```
PUT http://localhost:8080/api/auth/change-password
Content-Type: application/json

{
  "userId": "testuser",
  "oldPassword": "wrongoldpassword",
  "newPassword": "newpassword456"
}
```
**Expected Response:** 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid current password"
}
```

---

### 10. Logout (POST /api/auth/logout)
```
POST http://localhost:8080/api/auth/logout
```
**Expected Response:** 200 OK
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Recommended Test Order
1. Register User
2. Register Duplicate User (should fail)
3. Register with Short Password (should fail)
4. Login User
5. Login with Wrong Password (should fail)
6. Validate User
7. Validate Non-existent User (should fail)
8. Change Password
9. Login with New Password
10. Logout

## Notes
- All requests use `Content-Type: application/json`
- The API uses CORS (origins: "*")
- Passwords are currently stored as plaintext (for demo only)
- Consider implementing JWT tokens for production use
- Add password hashing with BCrypt before deploying
