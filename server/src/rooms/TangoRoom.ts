import { Client, Room } from "@colyseus/core";
import { Player, TangoRoomState } from "./schema/TangoRoomState";

export class TangoRoom extends Room<TangoRoomState> {
  maxClients = 10;
  state = new TangoRoomState();

  onCreate(options: any) {
    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, options, "joined!");

    const { name } = options;
    const player = new Player(name);
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
