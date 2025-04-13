# Database Schema for Multiplayer N-Queens Puzzle

This document outlines the database schema for the Multiplayer N-Queens Puzzle application.

## Collections

### Players

Stores information about registered players.

| Field    | Type    | Description                                    |
| -------- | ------- | ---------------------------------------------- |
| id       | text    | Primary key, auto-generated                    |
| username | text    | Player's display name                          |
| score    | number  | Player's cumulative score                      |
| roomId   | text    | ID of the room the player is currently in      |
| ready    | boolean | Whether the player is ready for the next round |
| created  | date    | When the player account was created            |
| updated  | date    | When the player record was last updated        |

### PlayerSettings

Stores player preferences and settings.

| Field     | Type    | Description                              |
| --------- | ------- | ---------------------------------------- |
| id        | text    | Primary key, auto-generated              |
| playerId  | text    | Reference to the player                  |
| autoJoin  | boolean | Whether to automatically join new rounds |
| boardSize | number  | Preferred board size for new rounds      |
| created   | date    | When the settings were created           |
| updated   | date    | When the settings were last updated      |

### Rooms

Stores information about game rooms.

| Field      | Type   | Description                              |
| ---------- | ------ | ---------------------------------------- |
| id         | text   | Primary key, auto-generated              |
| name       | text   | Room name                                |
| maxPlayers | number | Maximum number of players allowed        |
| timeLimit  | number | Time limit for rounds in seconds         |
| status     | text   | Room status (waiting, playing, finished) |
| players    | json   | Array of player IDs in the room          |
| createdBy  | text   | ID of the player who created the room    |
| created    | date   | When the room was created                |
| updated    | date   | When the room was last updated           |

### Rounds

Stores information about game rounds.

| Field     | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| id        | text   | Primary key, auto-generated          |
| roomId    | text   | Reference to the room                |
| boardSize | number | Size of the board for this round     |
| timeLimit | number | Time limit for this round in seconds |
| startTime | date   | When the round started               |
| endTime   | date   | When the round ended                 |
| status    | text   | Round status (active, completed)     |
| created   | date   | When the round was created           |
| updated   | date   | When the round was last updated      |

### Solutions

Stores player solutions for rounds.

| Field     | Type    | Description                        |
| --------- | ------- | ---------------------------------- |
| id        | text    | Primary key, auto-generated        |
| roundId   | text    | Reference to the round             |
| playerId  | text    | Reference to the player            |
| board     | json    | 2D array representing the solution |
| timeSpent | number  | Time taken to solve in seconds     |
| isValid   | boolean | Whether the solution is valid      |
| score     | number  | Score for this solution            |
| created   | date    | When the solution was submitted    |

### Leaderboards

Stores leaderboard entries.

| Field     | Type   | Description                             |
| --------- | ------ | --------------------------------------- |
| id        | text   | Primary key, auto-generated             |
| playerId  | text   | Reference to the player                 |
| roomId    | text   | Reference to the room (null for global) |
| boardSize | number | Board size for this entry               |
| score     | number | Player's score                          |
| timeframe | text   | Timeframe (all-time, monthly, weekly)   |
| created   | date   | When the entry was created              |
| updated   | date   | When the entry was last updated         |

## Relationships

- **Players** to **PlayerSettings**: One-to-one relationship via playerId
- **Players** to **Rooms**: Many-to-one relationship via roomId
- **Rooms** to **Rounds**: One-to-many relationship via roomId
- **Rounds** to **Solutions**: One-to-many relationship via roundId
- **Players** to **Solutions**: One-to-many relationship via playerId
- **Players** to **Leaderboards**: One-to-many relationship via playerId
- **Rooms** to **Leaderboards**: One-to-many relationship via roomId

## Indexes

- **Players**: username (unique)
- **PlayerSettings**: playerId (unique)
- **Rooms**: status, createdBy
- **Rounds**: roomId, status
- **Solutions**: roundId, playerId
- **Leaderboards**: playerId, roomId, timeframe, boardSize
