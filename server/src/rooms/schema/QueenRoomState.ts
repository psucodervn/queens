import { MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") name: string;
  @type("boolean") connected: boolean;
  @type("boolean") ready: boolean;
  @type("string") submitted: string;
  @type("int64") submittedAt: number;

  constructor(name: string) {
    super();
    this.name = name;
    this.connected = true;
    this.ready = false;
    this.submitted = "";
    this.submittedAt = 0;
  }
}

export enum GameStatus {
  LOBBY = 0,
  WAITING = 1,
  PLAYING = 2,
  ENDED = 3,
}

export class QueenRoomState extends Schema {
  @type("string") displayName: string;
  @type({ map: Player }) players = new MapSchema<Player>();
  @type("uint8") status: number;
  @type("string") test: string;
  @type("int64") gameStartedAt: number;
  @type("int64") gameEndedAt: number;
}
