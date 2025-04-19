import { MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}

export class TangoRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}
