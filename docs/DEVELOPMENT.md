# DEVELOPMENT.md: Tech Stack and Tools

This document outlines the tech stack and tools used to develop the Multiplayer N-Queens Puzzle project. Each component plays a critical role in delivering the functionality, performance, and scalability of the application.

## Tech Stack

### 1. **Backend**
- **Language**: **Golang**
  - PocketBase is integrated as a Go package to handle database, user authentication, and real-time subscriptions.
  - Provides REST API endpoints and real-time WebSocket communication.
  - Statically compiled executable is created for easy deployment.

- **Framework**: **PocketBase**
  - Lightweight backend framework used to manage collections, users, and real-time data.
  - Eliminates the need for a separate database or external auth solution by embedding database and auth into the Go backend.

### 2. **Frontend**
- **Framework**: **ReactJS**
  - Modern JavaScript framework for building a responsive, dynamic, and user-friendly game interface.
  - Enables component-based architecture for modular and scalable frontend development.

- **UI Library**: **Shadcn UI**
  - A UI toolkit built on TailwindCSS, providing pre-built components with customizable styles.
  - Enhances the frontend with aesthetically pleasing and functional UI elements such as buttons, forms, and modals.

- **Styling**: **TailwindCSS**
  - Utility-first CSS framework that helps create custom UI designs quickly and efficiently.

### 3. **Real-Time Communication**
- **WebSockets (via PocketBase)**
  - Facilitates real-time interactions in multiplayer game rooms, including player updates and game state synchronization.

### 4. **Development Tools and Environment**
- **AI-Assisted IDE**: **Cursor**
  - AI-powered coding assistance to streamline backend and frontend development by generating, refining, and debugging code.

- **Package Manager**: **NPM** (for frontend dependencies)
  - Handles JavaScript and React dependencies.

- **Build Tools**:
  - **Golang Compiler**: To build statically linked backend executables.
  - **Vite** (optional): To improve development server performance for React frontend.

### 5. **Database and State Management**
- **PocketBase Database**
  - Embedded SQLite-based database managed through PocketBase, with collections for users, rooms, game rounds, and leaderboard entries.

- **Global State Management**: **React Context API**
  - Manages application state across components, such as user authentication and game progress.

### 6. **Deployment Tools**
- **Docker**
  - Containerization tool for packaging the Go backend and frontend into portable containers.

- **Hosting Options** (Future Deployment)
  - **Self-Hosting**: Deploy on a VPS (e.g., DigitalOcean, AWS EC2).
  - **Containerized Deployment**: Use Docker Compose to orchestrate backend and frontend services.

### 7. **Testing and Debugging Tools**
- **React Testing Library** (for frontend unit tests)
- **Go Testing Framework** (for backend unit tests)

### Summary
This tech stack ensures that the Multiplayer N-Queens Puzzle project is lightweight, fast, scalable, and responsive. The integration of PocketBase as a Go package simplifies backend management, while ReactJS and Shadcn UI enhance the frontend user experience.

