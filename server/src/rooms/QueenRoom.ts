import { JWT } from "@colyseus/auth";
import { AuthContext, Client, Room } from "@colyseus/core";
import { levels } from "../game/levels";
import { GameStatus, Player, QueenRoomState } from "./schema/QueenRoomState";

interface QueenRoomMetadata {
  displayName: string;
}

export class QueenRoom extends Room<QueenRoomState, QueenRoomMetadata> {
  maxClients = 20;
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
    this.state.status = GameStatus.LOBBY;

    this.onMessage("ready", (client, message) => {
      this.state.players.get(client.auth.id).ready = message;
    });

    this.onMessage("new-game", this.onNewGame.bind(this));
    this.onMessage("ready", this.onReady.bind(this));
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

  onNewGame(client: Client, message: any) {
    if (this.state.status !== GameStatus.LOBBY || this.state.players.size < 2) {
      throw new Error("Game is not in lobby or not enough players");
    }

    // reset all players ready status
    this.state.players.forEach((player, id) => {
      player.ready = id === client.auth.id;
    });

    this.state.status = GameStatus.WAITING;
  }

  startGame() {
    // pick a random level
    const levelValues = Object.values(levels);
    const randomLevel =
      levelValues[Math.floor(Math.random() * levelValues.length)];

    this.state.test = JSON.stringify(randomLevel);
    this.state.status = GameStatus.PLAYING;
  }

  onReady(client: Client, message: any) {
    this.state.players.get(client.auth.id).ready = message;

    // check if all players are ready
    const allPlayersReady = Array.from(this.state.players.values()).every(
      (player) => player.ready
    );

    if (allPlayersReady) {
      this.startGame();
    }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
