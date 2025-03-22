# FEATURES.md: Multiplayer N-Queens Puzzle Project

## Key Features
This project offers several exciting features to enhance the player experience in both single-player and multiplayer modes. Below is a detailed breakdown:

### 1. Game Modes
- **Single-Player Mode**: Players can practice solving N-Queens puzzles at their own pace, improving their problem-solving skills.
- **Multiplayer Mode**: Create rooms and compete in real-time with friends by sharing a room link.

### 2. Real-Time Functionality
- **Live Game Updates**: Players can see real-time updates when a game starts, when solutions are submitted, and when a round ends.
- **WebSocket Communication**: Real-time data synchronization ensures smooth multiplayer interaction.

### 3. Random Board Generation
- Each game round features a randomly generated N-Queens puzzle board, making every round unique and challenging.

### 4. Scoring and Leaderboard
- **Scoring System**: Points are awarded to the fastest player to solve the puzzle correctly in multiplayer mode.
- **Global Leaderboard**: Tracks and displays top players based on cumulative points and fastest solving times.

### 5. User Authentication
- **Login and Sign-Up**: Basic user authentication is handled using PocketBase’s built-in user system, ensuring player data security.
- **Profile Tracking**: Player stats, such as total points and fastest solving time, are linked to user profiles.

### 6. Responsive User Interface
- The frontend is designed to work seamlessly across desktop and mobile devices, allowing players to join and compete from any platform.

### 7. API and Backend Integration
- **REST API Endpoints**: PocketBase handles backend data storage with APIs for managing rooms, game rounds, and leaderboards.
- **Solution Validation**: Player solutions are validated on the backend to ensure correctness before awarding points.

### 8. Docker Support (Optional)
- A Dockerfile is provided to containerize the PocketBase backend and Node.js server, simplifying deployment and scalability.

### 9. AI-Assisted Development
- This project leverages **Cursor**, an AI-assisted IDE, to streamline coding, testing, and deployment, enhancing productivity.

## Planned Features (Future Enhancements)
- **Custom Board Sizes**: Allow room creators to choose different board sizes (e.g., 10x10, 12x12).
- **Player Stats and Achievements**: Add more detailed player stats and achievements to reward high performance.
- **In-Game Chat**: Implement a chat feature for multiplayer rooms to enhance social interaction.
- **Matchmaking (Optional)**: Automatic pairing of players with similar skill levels.

---
By focusing on these core and planned features, the Multiplayer N-Queens Puzzle Project aims to deliver a competitive, fun, and educational gaming experience for all players.

