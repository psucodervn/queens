import { JWT } from "@colyseus/auth";
import { AuthContext, Client, Room } from "@colyseus/core";
import { Player, QueenRoomState } from "./schema/QueenRoomState";

interface QueenRoomMetadata {
  displayName: string;
}

export class QueenRoom extends Room<QueenRoomState, QueenRoomMetadata> {
  maxClients = 10;
  autoDispose: boolean = false;
  state = new QueenRoomState();

  static async onAuth(
    token: string,
    options: any,
    context: AuthContext
  ): Promise<unknown> {
    // validate the token
    const userdata: any = await JWT.verify(token);

    if (userdata.anonymous) {
      userdata.id = userdata.id || userdata.anonymousId;
    }

    // return userdata
    return userdata;
  }

  onCreate(options: any) {
    this.setMetadata({
      displayName: options.roomName,
    });
    this.state.displayName = options.roomName;
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, options, "joined!");

    const player = new Player(client.auth.username);
    this.state.players.set(client.auth.id, player);
  }

  async onLeave(client: Client, consented: boolean) {
    // flag client as inactive for other users
    this.state.players.get(client.auth.id).connected = false;

    this.state.players.delete(client.auth.id);
    return;

    try {
      if (consented) {
        throw new Error("consented leave");
      }

      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 10);

      // client returned! let's re-activate it.
      this.state.players.get(client.auth.id).connected = true;
    } catch (e) {
      // 20 seconds expired. let's remove the client.
      this.state.players.delete(client.auth.id);
    }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
