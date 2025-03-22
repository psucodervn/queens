# README.md: Multiplayer N-Queens Puzzle Project

## Overview
This project is a multiplayer adaptation of the classic N-Queens Puzzle, designed to offer both single-player and multiplayer experiences. Players compete to solve randomly generated N-Queens boards, with real-time updates and a global leaderboard tracking top performances. The backend leverages **PocketBase** for user authentication, game state management, and REST APIs, while WebSockets ensure smooth real-time communication, powered by **Golang**.

## Key Features
- **Single-Player Mode**: Practice solving N-Queens puzzles to hone problem-solving skills.
- **Multiplayer Mode**: Create rooms, share links, and compete in real-time with friends.
- **Random Board Generation**: Unique puzzle boards for each game round.
- **Scoring and Leaderboard**: Earn points for winning rounds, with top players displayed on a global leaderboard.
- **Real-Time Updates**: Live game status and round results using WebSocket communication.
- **User Authentication**: Secure login and sign-up via PocketBase.
- **Responsive Design**: Play seamlessly on both desktop and mobile.
- **Docker Support**: Optional Dockerfile for easy deployment.

## Project Structure
```
nqueens/
├── backend/
│   ├── server.go      # Real-time WebSocket backend in Golang
│   └── pocketbase/    # PocketBase binary and data
├── frontend/
│   └── index.html     # Game UI
└── go.mod             # Golang module file
```

## Installation and Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd nqueens
```

### 2. Set Up PocketBase
Download and run PocketBase:
```bash
wget https://github.com/pocketbase/pocketbase/releases/download/v0.26.2/pocketbase_0.26.2_linux_amd64.zip
unzip pocketbase_0.26.2_linux_amd64.zip
./pocketbase serve
```
This will start the PocketBase server at `http://localhost:8090`.

### 3. Set Up Golang Backend

#### Install Go Modules and Run the Backend
```bash
cd backend
go mod tidy
go run server.go
```
This will start the WebSocket server for real-time game communication.

### 4. Open the Frontend
Open `frontend/index.html` in your browser to access the game interface.

## API Endpoints
The backend provides the following REST API endpoints:

### Authentication
- **POST** `/api/users/auth-via-email`: Player login.
- **POST** `/api/users`: Player registration.

### Room Management
- **POST** `/api/collections/rooms/records`: Create a new game room.
- **PATCH** `/api/collections/rooms/records/{room_id}`: Join an existing room.
- **GET** `/api/collections/rooms/records/{room_id}`: Fetch room details.

### Game Round Management
- **POST** `/api/collections/game_rounds/records`: Start a new game round.
- **PATCH** `/api/collections/game_rounds/records/{round_id}`: Submit a player’s solution.

### Leaderboard
- **GET** `/api/collections/leaderboard/records`: Retrieve the global leaderboard.

## Custom Prompts for Cursor
Since this project utilizes AI-assisted development through Cursor, here are some example prompts to guide the AI:

1. **API Route Generation Prompt**
   ```
   Generate a POST route in Golang to create a PocketBase game round. The request body should include `room_id`, `board_config` (JSON-encoded N-Queens board), and `status`. Validate the input and save the round in the `game_rounds` collection.
   ```

2. **Solution Validation Prompt**
   ```
   Implement a function `validateNQueens(board [][]int)` in Golang that takes an NxN board and returns `true` if the board configuration is a valid solution for the N-Queens puzzle.
   ```

## Deployment
For deployment, you can either self-host PocketBase and the backend or containerize the project using Docker.

### Example Dockerfile
```dockerfile
# Base image for PocketBase
FROM golang:1.24-alpine AS builder

# Set working directory
WORKDIR /app

# Copy Go backend and install dependencies
COPY backend/ .
RUN go mod tidy
RUN go build -o server .

# Stage 2: Final image for PocketBase and backend
FROM alpine:3.21

# Install PocketBase
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v0.26.2/pocketbase_0.26.2_linux_amd64.zip \
    && unzip pocketbase_0.26.2_linux_amd64.zip \
    && chmod +x pocketbase

# Copy Go binary
WORKDIR /app
COPY --from=builder /app/server .

# Expose ports for PocketBase and Go backend
EXPOSE 8090 8080

# Run both PocketBase and Golang server
CMD ./pocketbase serve & ./server
```

## Planned Features
- **Custom Board Sizes**: Enable room creators to set larger board sizes (e.g., 10x10, 12x12).
- **Player Stats and Achievements**: Track detailed player performance and unlock achievements.
- **In-Game Chat**: Add chat functionality in multiplayer rooms.
- **Matchmaking (Optional)**: Automatically pair players with similar skill levels.

## Contributing
Contributions are welcome! Feel free to open issues and submit pull requests.

## License
This project is licensed under the MIT License. See `LICENSE` for details.

