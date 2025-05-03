import { JWT } from "@colyseus/auth";
import {
  AuthContext,
  Client,
  Delayed,
  Room,
  RoomException,
} from "@colyseus/core";
import { levels } from "../game/levels";
import { Player, PlayerStatus } from "./schema/Player";
import {
  GameStatus,
  QueenLeaderboardRecord,
  QueenRoomState,
} from "./schema/QueenRoomState";

interface QueenRoomMetadata {
  displayName: string;
}

const TIMEOUT_DISCONNECT = 1000 * 10; // 10 seconds
const DEFAULT_GAME_TIME = 1000 * 60 * 1; // 1 minutes
const DEFAULT_COUNTDOWN_TIME = 1000 * 5; // 5 seconds
const DEFAULT_NEW_GAME_THRESHOLD = 1000 * 5; // 5 seconds

export class QueenRoom extends Room<QueenRoomState, QueenRoomMetadata> {
  maxClients = 20;
  autoDispose: boolean = false;
  state = new QueenRoomState();
  clearInactivePlayers = new Map<string, Delayed>();

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

    this.onMessage("new-game", this.onNewGame.bind(this));
    this.onMessage("ready", this.onReady.bind(this));
    this.onMessage("start", this.onStart.bind(this));
    this.onMessage("submit", this.onSubmit.bind(this));

    this.clock.start();
  }

  onJoin(client: Client, options: any) {
    console.log("client joined", client.auth.id);
    const userId = client.auth.id;

    let player = this.state.players.get(userId);
    if (!player) {
      player = new Player(userId, client.auth.username);
      this.state.players.set(userId, player);
    }
    player.active = true;

    // clear timeout for inactive player
    let timeout = this.clearInactivePlayers.get(userId);
    if (!timeout) {
      timeout = this.clock.setTimeout(() => {
        this.removePlayer(userId);
      }, TIMEOUT_DISCONNECT);
      this.clearInactivePlayers.set(userId, timeout);
    }
    timeout.pause();
    timeout.reset();
  }

  onLeave(client: Client, consented: boolean) {
    console.log("client left", client.auth.id, consented);

    const userId = client.auth.id;
    const player = this.state.players.get(userId);
    if (!player) {
      return;
    }

    if (player.status === PlayerStatus.CONNECTED) {
      this.removePlayer(userId);
      return;
    }

    // clear inactive player after timeout
    this.clearInactivePlayers.get(userId).resume();

    // flag client as inactive for other users
    player.active = false;
  }

  onNewGame(client: Client, message: any) {
    if (![GameStatus.LOBBY, GameStatus.FINISHED].includes(this.state.status)) {
      throw new Error("Game is not in lobby or finished");
    }

    const newGameThreshold =
      this.state.players.size * DEFAULT_NEW_GAME_THRESHOLD;
    if (Date.now() - this.state.gameFinishedAt < newGameThreshold) {
      throw new Error("New game threshold not met");
    }

    // reset all players ready status
    this.state.players.forEach((player, id) => {
      player.status =
        id === client.auth.id ? PlayerStatus.READY : PlayerStatus.CONNECTED;
      player.submittedAt = 0;
      player.submitted = "";
    });

    this.state.status = GameStatus.WAITING;
    this.state.clearLeaderboard();
  }

  onStart(client: Client, message: any) {
    if (this.state.status !== GameStatus.WAITING) {
      throw new Error("Game is not in waiting state");
    }

    if (this.state.players.size < 2) {
      throw new Error("Not enough players");
    }

    this.state.status = GameStatus.COUNTDOWNING;
    this.state.gameStartedAt = Date.now() + DEFAULT_COUNTDOWN_TIME;

    this.clock.setTimeout(() => {
      this.startGame();
    }, DEFAULT_COUNTDOWN_TIME);
  }

  removePlayer(userId: string) {
    this.state.players.delete(userId);
    this.clearInactivePlayers.get(userId)?.clear();
    this.clearInactivePlayers.delete(userId);
  }

  startGame() {
    // pick a random level
    const levelValues = Object.values(levels);
    const randomLevel =
      levelValues[Math.floor(Math.random() * levelValues.length)];

    this.state.test = JSON.stringify(randomLevel);
    this.state.status = GameStatus.PLAYING;
    this.state.gameStartedAt = Date.now();

    this.state.players.forEach((player, id) => {
      if (player.status === PlayerStatus.READY) {
        player.status = PlayerStatus.PLAYING;
      }
    });

    this.clock.setTimeout(() => {
      this.endGame();
    }, DEFAULT_GAME_TIME);
  }

  endGame() {
    if (this.state.status !== GameStatus.PLAYING) {
      return;
    }

    this.state.status = GameStatus.FINISHED;
    this.state.gameFinishedAt = Date.now();

    this.state.players.forEach((player, id) => {
      if (player.status < PlayerStatus.PLAYING) {
        return;
      }

      if (player.status !== PlayerStatus.SUBMITTED) {
        player.status = PlayerStatus.DID_NOT_FINISH;
      }

      this.state.addLeaderboardRecord(
        new QueenLeaderboardRecord(
          id,
          player.name,
          player.status,
          player.submittedAt - this.state.gameStartedAt
        )
      );
    });
  }

  onReady(client: Client, message: any) {
    this.state.players.get(client.auth.id).status = PlayerStatus.READY;
  }

  onSubmit(client: Client, message: any) {
    const player = this.state.players.get(client.auth.id);
    if (!player) {
      throw new Error("Player not found");
    }

    if (player.submittedAt > 0) {
      console.warn("player already submitted", client.auth.id);
      return;
    }

    player.submitted = message;
    player.submittedAt = Date.now();
    player.status = PlayerStatus.SUBMITTED;

    this.checkForFinish();
  }

  checkForFinish() {
    const allPlayersSubmitted = Array.from(this.state.players.values()).every(
      (player) => player.status === PlayerStatus.SUBMITTED
    );

    if (allPlayersSubmitted) {
      this.endGame();
    }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  onUncaughtException(
    error: RoomException<this>,
    methodName:
      | "onCreate"
      | "onAuth"
      | "onJoin"
      | "onLeave"
      | "onDispose"
      | "onMessage"
      | "setSimulationInterval"
      | "setInterval"
      | "setTimeout"
  ): void {
    console.error("Uncaught exception in room", this.roomId, methodName, error);
  }
}
