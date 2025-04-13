# API Documentation for Multiplayer N-Queens Puzzle

## Game Room Management

### Create Game Room

- **Endpoint**: `POST /api/rooms`
- **Purpose**: Create a new multiplayer game room
- **Request Body**:
  ```json
  {
    "name": "string",
    "maxPlayers": "number",
    "timeLimit": "number" // in seconds, default 300 (5 minutes)
  }
  ```
- **Response**: Returns created room details with room ID

### Join Game Room

- **Endpoint**: `POST /api/rooms/{roomId}/join`
- **Purpose**: Join an existing game room
- **Response**: Returns room details and player assignment

### Leave Game Room

- **Endpoint**: `POST /api/rooms/{roomId}/leave`
- **Purpose**: Leave current game room
- **Response**: Success confirmation

### Get Room Status

- **Endpoint**: `GET /api/rooms/{roomId}`
- **Purpose**: Get current room status including players and game state
- **Response**: Returns room details, connected players, and game status

### List Available Rooms

- **Endpoint**: `GET /api/rooms`
- **Purpose**: Get list of available game rooms
- **Query Parameters**:
  - `status`: Filter by room status ("waiting", "playing", "finished")
  - `boardSize`: Filter by board size
  - `timeLimit`: Filter by time limit
- **Response**: Returns list of rooms with basic details

## Game Rounds

### Start New Round

- **Endpoint**: `POST /api/rooms/{roomId}/rounds`
- **Purpose**: Start a new game round in the room
- **Request Body**:
  ```json
  {
    "boardSize": "number", // optional, overrides room default
    "timeLimit": "number" // optional, overrides room default
  }
  ```
- **Response**: Returns initial game board state and round details

### Get Round Status

- **Endpoint**: `GET /api/rooms/{roomId}/rounds/current`
- **Purpose**: Get current round status
- **Response**: Returns current round details including:
  - Board state
  - Time remaining
  - Player scores
  - Round status

### Submit Solution

- **Endpoint**: `POST /api/rooms/{roomId}/rounds/current/solutions`
- **Purpose**: Submit completed solution for validation
- **Request Body**:
  ```json
  {
    "board": "array", // 2D array representing board state
    "timeSpent": "number" // time taken to solve in seconds
  }
  ```
- **Response**: Returns validation result and score if valid

## Leaderboards

### Get Room Leaderboard

- **Endpoint**: `GET /api/rooms/{roomId}/leaderboard`
- **Purpose**: Get leaderboard for a specific room
- **Query Parameters**:
  - `timeframe`: Filter by timeframe ("all-time", "monthly", "weekly")
- **Response**: Returns room leaderboard with player rankings

### Get Global Leaderboard

- **Endpoint**: `GET /api/leaderboard`
- **Purpose**: Get global leaderboard across all rooms
- **Query Parameters**:
  - `timeframe`: Filter by timeframe ("all-time", "monthly", "weekly")
  - `boardSize`: Filter by board size
- **Response**: Returns global leaderboard with player rankings

## WebSocket Events

### Room Events

- `room:player_joined` - New player joined room
- `room:player_left` - Player left room
- `room:settings_updated` - Room settings changed

### Round Events

- `round:started` - New round started
- `round:ended` - Round ended
- `round:time_updated` - Time remaining updated
- `round:solution_submitted` - Player submitted solution
- `round:winner_declared` - Winner determined for round

### Player Events

- `player:ready` - Player marked as ready
- `player:score_updated` - Player's score updated

## Error Responses

All endpoints may return the following error responses:

- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - User lacks permission
- `404 Not Found` - Resource not found
- `409 Conflict` - Request conflicts with current state (e.g., trying to start round with insufficient players)
- `500 Internal Server Error` - Server error

## Authentication

All endpoints require authentication via Bearer token:

```
Authorization: Bearer <token>
```

## Rate Limiting

- API endpoints are rate limited to 100 requests per minute per user
- WebSocket connections are limited to 5 concurrent connections per user

## Player Settings

### Update Player Settings

- **Endpoint**: `PUT /api/players/settings`
- **Purpose**: Update player preferences and settings
- **Request Body**:
  ```json
  {
    "autoJoin": "boolean", // whether to automatically join new rounds
    "boardSize": "number" // preferred board size for new rounds
  }
  ```
- **Response**: Returns updated player settings

### Get Player Settings

- **Endpoint**: `GET /api/players/settings`
- **Purpose**: Get current player settings
- **Response**: Returns player settings including autoJoin and boardSize preferences
