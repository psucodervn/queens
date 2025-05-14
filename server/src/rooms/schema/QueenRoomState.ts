import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { Player, PlayerStatus } from "./Player";
import { Message } from "./Message";

export enum GameStatus {
  LOBBY = 0,
  WAITING = 1,
  COUNTDOWNING = 2,
  PLAYING = 3,
  FINISHED = 4,
}

export class QueenLeaderboardRecord extends Schema {
  @type("string") id: string;
  @type("string") name: string;
  @type("uint8") status: PlayerStatus;
  @type("int64") durationInMs: number;

  constructor(
    id: string,
    name: string,
    status: PlayerStatus,
    durationInMs: number
  ) {
    super();

    this.id = id;
    this.name = name;
    this.status = status;
    this.durationInMs = durationInMs;
  }
}

export class QueenRoomState extends Schema {
  @type("string") displayName: string;
  @type({ map: Player }) players = new MapSchema<Player>();
  @type("uint8") status: GameStatus;
  @type("string") test: string;
  @type("int64") gameStartedAt: number;
  @type("int64") gameFinishedAt: number;
  @type("int64") gameTime: number;
  @type([Message]) chats = new ArraySchema<Message>();

  @type([QueenLeaderboardRecord]) leaderboard =
    new ArraySchema<QueenLeaderboardRecord>();

  addLeaderboardRecord(record: QueenLeaderboardRecord) {
    if (
      ![PlayerStatus.SUBMITTED, PlayerStatus.DID_NOT_FINISH].includes(
        record.status
      )
    ) {
      return this;
    }

    this.leaderboard.push(record);

    this.leaderboard.sort((a, b) => {
      if (
        a.status === PlayerStatus.SUBMITTED &&
        b.status === PlayerStatus.SUBMITTED
      ) {
        return a.durationInMs - b.durationInMs;
      }
      return a.status - b.status;
    });

    return this;
  }

  clearLeaderboard() {
    this.leaderboard.clear();
    return this;
  }
}
