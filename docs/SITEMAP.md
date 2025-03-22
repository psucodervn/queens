# Site Map for Multiplayer N-Queens Puzzle Project

## Overview
This site map provides a structure of the web pages and routes for the Multiplayer N-Queens Puzzle project, designed to offer seamless navigation for both single-player and multiplayer modes, along with leaderboard and user management features.

## Pages and Routes

1. **Home Page (`/`)**
   - **Purpose**: Provide an overview of the game with options to log in, register, or explore game modes.
   - **Main Elements**:
     - Welcome message.
     - Links to Login, Sign-Up, and Game Modes.
   
   **Detailed Flow:**
   - **Step 1**: Users visit the homepage and can choose to log in, sign up, or explore features like the leaderboard.
   - **Step 2**: If users click “Login,” they are redirected to the login page. If they click “Sign-Up,” they are redirected to the registration page. Guests can optionally access the leaderboard or single-player mode.

2. **Login Page (`/login`)**
   - **Purpose**: Allow users to log in to their accounts.
   - **Main Elements**:
     - Email and password input fields.
     - Submit button.
     - Link to the registration page.
   
   **Detailed Flow:**
   - **Step 1**: Users input their email and password.
   - **Step 2**: Upon successful login, users are redirected to the dashboard.
   - **Step 3**: If login fails, users are shown an error message (e.g., “Invalid credentials”) and can retry or navigate to the registration page.

3. **Sign-Up Page (`/signup`)**
   - **Purpose**: Enable new users to create an account.
   - **Main Elements**:
     - Email, username, and password input fields.
     - Submit button.
     - Link to the login page.
   
   **Detailed Flow:**
   - **Step 1**: Users fill out the registration form.
   - **Step 2**: After successful registration, users are automatically logged in and redirected to the dashboard. If registration fails (e.g., duplicate email), users are shown an error message.

4. **Dashboard Page (`/dashboard`)** *(Accessible after login)*
   - **Purpose**: Provide access to game modes and display user stats.
   - **Main Elements**:
     - User profile with points and fastest solving time.
     - Links to single-player mode, multiplayer rooms, and leaderboard.

   **Detailed Flow:**
   - **Step 1**: After logging in, users access their dashboard.
   - **Step 2**: Users can choose from available options:
     - Start a single-player game.
     - Create a new multiplayer room.
     - Join a multiplayer room with a shared link.
     - View their stats or the leaderboard.

5. **Single-Player Page (`/single-player`)**
   - **Purpose**: Allow users to practice solving N-Queens puzzles alone.
   - **Main Elements**:
     - Game board (NxN size).
     - Timer to track solving time.
     - Option to generate a new board.
   
   **Detailed Flow:**
   - **Step 1**: Users navigate to the single-player page from the dashboard or home page.
   - **Step 2**: A new N-Queens board is generated, and the timer starts.
   - **Step 3**: Users solve the puzzle and can track their time. They may generate a new board at any time.

6. **Multiplayer Room Page (`/room/{room_id}`)**
   - **Purpose**: Enable users to join and compete in real-time multiplayer rooms.
   - **Main Elements**:
     - Real-time game board and status.
     - Player list showing who’s in the room.
     - Timer and live game updates.
   
   **Detailed Flow:**
   - **Step 1**: Users join a room using a shared link or by navigating to `/room/{room_id}`.
   - **Step 2**: The room displays the player list, showing who has joined.
   - **Step 3**: Users wait for enough players to join and for the host to start the game.
   - **Step 4**: When the game starts, all players receive the same randomly generated N-Queens board.
   - **Step 5**: Players race to solve the puzzle, and submissions are validated by the backend.
   - **Step 6**: The first player to submit a correct solution wins the round, and points are awarded. The game then transitions to the next round or ends, depending on the configuration.

7. **Leaderboard Page (`/leaderboard`)**
   - **Purpose**: Display top players based on points and solving times.
   - **Main Elements**:
     - Global leaderboard with player rankings.
     - Filter options (e.g., weekly, all-time).
   
   **Detailed Flow:**
   - **Step 1**: Users navigate to the leaderboard page.
   - **Step 2**: The page fetches and displays the top players.
   - **Step 3**: Users can filter results by time periods (e.g., weekly, monthly, or all-time).

8. **Profile Page (`/profile`)** *(Optional)*
   - **Purpose**: Show detailed player stats and achievements.
   - **Main Elements**:
     - Total games played, win/loss ratio, and achievements.
     - Option to edit profile information.
   
   **Detailed Flow:**
   - **Step 1**: Users navigate to their profile page.
   - **Step 2**: The page displays detailed stats such as total games played, win rate, and fastest solving time.
   - **Step 3**: Users can edit their profile information (e.g., update username).

9. **404 Error Page (`/404`)**
   - **Purpose**: Handle invalid routes with a friendly error message.
   - **Main Elements**:
     - Message: “Oops! Page not found.”
     - Link to return to the Home Page.
   
   **Detailed Flow:**
   - **Step 1**: Users enter an invalid URL.
   - **Step 2**: The system displays a 404 error message with a link to navigate back to the homepage.

---

## Navigation Flow
### Logged-Out Users:
1. Home → Login / Sign-Up → Dashboard (after login)
2. Home → Explore Single-Player Mode or Leaderboard (optional for guests)

### Logged-In Users:
1. Dashboard → Select Game Mode:
   - Single-Player Mode
   - Create Multiplayer Room → Share Room Link → Play
   - Join Multiplayer Room (via shared link)
   - View Leaderboard
   - Check Profile and Stats

This site map ensures intuitive navigation and enhances the user experience by providing easy access to core game features, authentication pages, and multiplayer functionality.

