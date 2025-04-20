import { MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") name: string;
  @type("boolean") connected: boolean;
  @type("boolean") ready: boolean;

  constructor(name: string) {
    super();
    this.name = name;
    this.connected = true;
    this.ready = false;
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
}
