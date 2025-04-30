import { MapSchema, Schema, type } from "@colyseus/schema";
import { Player } from "./Player";

export enum GameStatus {
  LOBBY = 0,
  WAITING = 1,
  PLAYING = 2,
  ENDED = 3,
}

export class QueenRoomState extends Schema {
  @type("string") displayName: string;
  @type({ map: Player }) players = new MapSchema<Player>();
  @type("uint8") status: GameStatus;
  @type("string") test: string;
  @type("int64") gameStartedAt: number;
  @type("int64") gameEndedAt: number;
}
