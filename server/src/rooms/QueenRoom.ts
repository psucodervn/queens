import { JWT } from "@colyseus/auth";
import {
  AuthContext,
  Client,
  Delayed,
  logger,
  Room,
  RoomException,
} from "@colyseus/core";
import { EloService } from "../services/EloService";
import { Player, PlayerStatus } from "./schema/Player";
import {
  GameStatus,
  QueenLeaderboardRecord,
  QueenRoomState,
} from "./schema/QueenRoomState";
import { Message } from "./schema/Message";
import { getRandomLevel } from "../game";

interface QueenRoomMetadata {
  displayName: string;
  gameTime?: number;
}

const TIMEOUT_DISCONNECT = 1000 * 5; // 5 seconds
const DEFAULT_GAME_TIME = 1000 * 60 * 3; // 3 minutes default
const MIN_GAME_TIME = 1000 * 30; // Minimum 30 seconds
const MAX_GAME_TIME = 1000 * 60 * 30; // Maximum 30 minutes
const DEFAULT_COUNTDOWN_TIME = 1000 * 5; // 5 seconds
const DEFAULT_NEW_GAME_THRESHOLD = 1000 * 5; // 5 seconds
const MAX_CHAT_HISTORY = 50;
const MAX_MESSAGE_LENGTH = 200;

export class QueenRoom extends Room<QueenRoomState, QueenRoomMetadata> {
  maxClients = 20;
  autoDispose: boolean = false;
  state = new QueenRoomState();
  clearInactivePlayers = new Map<string, Delayed>();
  clockEndGame: Delayed | null = null;
  clockStartGame: Delayed | null = null;

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
    let gameTime = options.gameTime || DEFAULT_GAME_TIME;
    gameTime = Math.min(Math.max(gameTime, MIN_GAME_TIME), MAX_GAME_TIME);

    this.setMetadata({
      displayName: options.roomName,
      gameTime: gameTime,
    });
    this.state.displayName = options.roomName || "Anonymous Room";
    this.state.status = GameStatus.LOBBY;

    // Configure game time
    this.state.gameTime = gameTime;

    this.onMessage("new-game", this.onNewGame.bind(this));
    this.onMessage("ready", this.onReady.bind(this));
    this.onMessage("start", this.onStart.bind(this));
    this.onMessage("submit", this.onSubmit.bind(this));
    this.onMessage("chat", this.onChat.bind(this));

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
        this.checkForFinish();
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
      logger.warn("Game is not in lobby or finished");
      return;
    }

    // reset all players ready status
    this.state.players.forEach((player, id) => {
      player.status =
        id === client.auth.id ? PlayerStatus.READY : PlayerStatus.CONNECTED;
      player.submittedAt = 0;
      player.submitted = "";
    });

    this.state.status = GameStatus.WAITING;
  }

  onStart(client: Client, message: any) {
    if (this.state.status !== GameStatus.WAITING) {
      logger.warn("Game is not in waiting state", this.state.status);
      return;
    }

    if (this.state.players.size < 2) {
      logger.warn("Not enough players", this.state.players.size);
      return;
    }

    const player = this.state.players.get(client.auth.id);
    if (!player) {
      logger.warn("Player not found", client.auth.id);
      return;
    }

    if (player.status !== PlayerStatus.READY) {
      logger.warn("Player is not ready", player.status);
      return;
    }

    this.state.status = GameStatus.COUNTDOWNING;
    this.state.gameStartedAt = Date.now() + DEFAULT_COUNTDOWN_TIME;

    this.clockStartGame = this.clock.setTimeout(() => {
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
    const randomLevel = getRandomLevel({});

    this.state.test = JSON.stringify(randomLevel);
    this.state.status = GameStatus.PLAYING;
    this.state.gameStartedAt = Date.now();
    this.state.gameFinishedAt = 0;
    this.state.clearLeaderboard();

    this.state.players.forEach((player, id) => {
      if (player.status === PlayerStatus.READY) {
        player.status = PlayerStatus.PLAYING;
      }
      player.submitted = "";
      player.submittedAt = 0;
    });

    this.clockEndGame = this.clock.setTimeout(() => {
      this.endGame();
    }, this.state.gameTime);
  }

  endGame() {
    if (this.state.status !== GameStatus.PLAYING) {
      return;
    }

    if (this.clockEndGame) {
      this.clockEndGame.clear();
      this.clockEndGame = null;
    }

    this.state.status = GameStatus.FINISHED;
    this.state.gameFinishedAt = Date.now();

    // Collect players who participated
    const activePlayers: [string, Player][] = [];
    this.state.players.forEach((player, id) => {
      if (player.status < PlayerStatus.PLAYING) {
        return;
      }

      if (player.status !== PlayerStatus.SUBMITTED) {
        player.status = PlayerStatus.DID_NOT_FINISH;
        player.submittedAt = Infinity;
      }

      this.state.addLeaderboardRecord(
        new QueenLeaderboardRecord(
          id,
          player.name,
          player.status,
          player.submittedAt - this.state.gameStartedAt,
          player.eloRating
        )
      );

      activePlayers.push([id, player]);
    });

    // Update Elo ratings if there are at least 2 active players
    if (activePlayers.length >= 2) {
      const playerRatings = activePlayers.map(
        ([id, player]) => player.eloRating
      );
      const times = activePlayers.map(
        ([id, player]) => player.submittedAt - this.state.gameStartedAt
      );

      const newRatings = EloService.calculateMultiPlayerRatings(
        playerRatings,
        times
      );

      // Update player ratings and leaderboard records
      newRatings.forEach((newRating, index) => {
        const playerId = activePlayers[index][0];
        const player = this.state.players.get(playerId);
        if (player) {
          const eloChange = newRating - player.eloRating;
          player.eloRating = newRating;

          // Update the leaderboard record with new rating and change
          const record = this.state.leaderboard.find((r) => r.id === playerId);
          if (record) {
            record.eloRating = newRating;
            record.eloChange = eloChange;
          }
        }
      });
    }

    this.clock.setTimeout(() => {
      this.state.status = GameStatus.LOBBY;
    }, DEFAULT_NEW_GAME_THRESHOLD);
  }

  onReady(client: Client, message: any) {
    const player = this.state.players.get(client.auth.id);
    if (!player) {
      logger.warn("Player not found", client.auth.id);
      return;
    }

    if (this.state.status === GameStatus.WAITING) {
      player.status = PlayerStatus.READY;
    } else if (this.state.status === GameStatus.COUNTDOWNING) {
      player.status = PlayerStatus.READY;
      this.clockStartGame?.clear();
      this.state.gameStartedAt = Date.now() + DEFAULT_COUNTDOWN_TIME;
      this.clockStartGame = this.clock.setTimeout(() => {
        this.startGame();
      }, DEFAULT_COUNTDOWN_TIME);
    } else {
      logger.warn(
        "Game is not in waiting or countdowning state",
        this.state.status
      );
    }
  }

  onSubmit(client: Client, message: any) {
    const player = this.state.players.get(client.auth.id);
    if (!player) {
      logger.warn("Player not found", client.auth.id);
      return;
    }

    if (player.submittedAt > 0) {
      logger.warn("player already submitted", client.auth.id);
      return;
    }

    player.submitted = message;
    player.submittedAt = Date.now();
    player.status = PlayerStatus.SUBMITTED;

    this.checkForFinish();
  }

  checkForFinish() {
    if (this.state.status !== GameStatus.PLAYING) {
      return;
    }

    const allPlayersSubmitted = Array.from(this.state.players.values()).every(
      (player) =>
        player.status <= PlayerStatus.READY ||
        player.status === PlayerStatus.SUBMITTED
    );

    if (allPlayersSubmitted) {
      this.endGame();
    }
  }

  onChat(client: Client, message: string) {
    if (message.length > MAX_MESSAGE_LENGTH) {
      return;
    }

    if (this.state.chats.length >= MAX_CHAT_HISTORY) {
      this.state.chats.shift();
    }

    const player = this.state.players.get(client.auth.id);
    if (!player) {
      logger.warn("Player not found", client.auth.id);
      return;
    }

    this.state.chats.push(new Message(player.id, player.name, message));
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
