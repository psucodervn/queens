import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import config from "@colyseus/tools";

/**
 * Import your Room files
 */
import { LobbyRoom, RedisDriver, RedisPresence } from "colyseus";
import { QueenRoom } from "./rooms/QueenRoom";
import { TangoRoom } from "./rooms/TangoRoom";

export default config({
  initializeGameServer: (gameServer) => {
    // Expose the LobbyRoom
    gameServer.define("lobby", LobbyRoom);

    /**
     * Define your room handlers:
     */
    gameServer.define("queen", QueenRoom).enableRealtimeListing();
    gameServer.define("tango", TangoRoom).enableRealtimeListing();
  },

  initializeExpress: (app) => {
    /**
     * Bind your custom express routes here:
     * Read more: https://expressjs.com/en/starter/basic-routing.html
     */
    app.get("/hello", (req, res) => {
      res.send("It's time to kick ass and chew bubblegum!");
    });

    /**
     * Use @colyseus/playground
     * (It is not recommended to expose this route in a production environment)
     */
    if (process.env.NODE_ENV !== "production") {
      app.use("/", playground());
    }

    /**
     * Use @colyseus/monitor
     * It is recommended to protect this route with a password
     * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
     */
    app.use("/monitor", monitor());
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  },

  options: {
    devMode: process.env.DEV_MODE === "true",
    presence: new RedisPresence({
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "12001"),
    }),
    driver: new RedisDriver({
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "12001"),
    }),
  },
});
