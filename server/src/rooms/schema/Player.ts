import { Schema, type } from "@colyseus/schema";

export enum PlayerStatus {
  CONNECTED = 0,
  READY = 1,
  PLAYING = 2,
  SUBMITTED = 3,
}

export class Player extends Schema {
  @type("string") id: string;
  @type("string") name: string;
  @type("uint8") status: PlayerStatus = PlayerStatus.CONNECTED;
  @type("boolean") active: boolean = true;
  @type("string") submitted: string = "";
  @type("int64") submittedAt: number = 0;

  constructor(id: string, name: string) {
    super();
    this.id = id;
    this.name = name;
  }
}
