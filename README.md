# N-Queens Multiplayer Game

## Overview

A web-based multiplayer N-Queens puzzle game that challenges players to solve chess board configurations where N queens can be placed without attacking each other. The project features both single-player practice and competitive multiplayer modes.

## Tech Stack

- **Frontend**: React SPA (Single Page Application)
- **Backend**: Golang
- **Real-time Communication**: WebSockets
- **Deployment**: Docker Compose

## Project Structure

```
queens/
├── server/           # Golang backend server
│   ├── src/          # Server source code
│   │   ├── game/     # Game logic
│   │   └── rooms/    # Multiplayer room management
│   └── test/         # Server tests
│
├── web-spa/          # React frontend
│   ├── src/          # Frontend source code
│   │   ├── components/
│   │   ├── pages/
│   │   └── lib/
│   └── public/       # Static assets
│
└── scripts/          # Utility scripts
```

## Features

- Single-player practice mode
- Real-time multiplayer rooms
- Dynamic N-Queens board generation
- User authentication
- Responsive design
- Global leaderboard

## Development Setup

### Prerequisites

- Node.js
- Go
- Docker (optional)

### Local Development

1. Clone the repository

```bash
git clone https://github.com/your-username/queens.git
cd queens
```

2. Install frontend dependencies

```bash
cd web-spa
npm install
npm start
```

3. Run backend server

```bash
cd ../server
go mod tidy
go run main.go
```

## Docker Deployment

```bash
docker-compose up --build
```

## API Endpoints

- Authentication endpoints
- Game room management
- Leaderboard retrieval

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT License - see `LICENSE` file for details.- **POST** `/api/collections/game_rounds/records`: Start a new game round.

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
