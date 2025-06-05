import { auth } from "@colyseus/auth";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import config from "@colyseus/tools";
import { BunWebSockets } from "@colyseus/bun-websockets";
import express from "express";
import path from "path";

/**
 * Import your Room files
 */
import { LobbyRoom, RedisDriver, RedisPresence } from "colyseus";
import { QueenRoom } from "./rooms/QueenRoom";
import apiRouter from "./api";

export default config({
  initializeTransport: (options) => {
    return new BunWebSockets(options);
  },

  initializeGameServer: (gameServer) => {
    // Expose the LobbyRoom
    gameServer.define("lobby", LobbyRoom);

    /**
     * Define your room handlers:
     */
    gameServer.define("queen", QueenRoom).enableRealtimeListing();
  },

  initializeExpress: (app) => {
    /**
     * Use @colyseus/playground
     * (It is not recommended to expose this route in a production environment)
     */
    app.use("/cs/playground", playground());

    /**
     * Use @colyseus/monitor
     * It is recommended to protect this route with a password
     * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
     */
    app.use(
      "/cs/monitor",
      monitor({
        columns: [
          "roomId",
          "name",
          {
            metadata: "displayName",
          },
          "clients",
          "maxClients",
          "locked",
          "elapsedTime",
          "processId",
        ],
      })
    );

    /**
     * Use @colyseus/auth
     * Read more: https://docs.colyseus.io/auth/module
     */
    app.use(auth.prefix, auth.routes());

    /**
     * Use custom API routes
     */
    app.use("/api", apiRouter);

    /**
     * Bind your custom express routes here:
     * Read more: https://expressjs.com/en/starter/basic-routing.html
     */
    app.use(express.static(path.resolve(__dirname, "../public")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../public/index.html"));
    });
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
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    }),
    driver: new RedisDriver({
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "12001"),
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    }),
  },
});
