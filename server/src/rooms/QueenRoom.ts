import { Client, Room } from "@colyseus/core";
import { Player, QueenRoomState } from "./schema/QueenRoomState";

interface QueenRoomMetadata {
  displayName: string;
}

export class QueenRoom extends Room<QueenRoomState, QueenRoomMetadata> {
  maxClients = 10;
  autoDispose: boolean = false;
  state = new QueenRoomState();

  onCreate(options: any) {
    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });

    this.setMetadata({
      displayName: options.roomName,
    });
    this.state.displayName = options.roomName;
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, options, "joined!");

    const { name } = options;
    const player = new Player(name);
    this.state.players.set(client.sessionId, player);
  }

  async onLeave(client: Client, consented: boolean) {
    // flag client as inactive for other users
    this.state.players.get(client.sessionId).connected = false;

    try {
      if (consented) {
        throw new Error("consented leave");
      }

      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 10);

      // client returned! let's re-activate it.
      this.state.players.get(client.sessionId).connected = true;
    } catch (e) {
      // 20 seconds expired. let's remove the client.
      this.state.players.delete(client.sessionId);
    }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
