import express from "express";
import { getRandomLevel } from "../game";

const apiRouter = express.Router();

apiRouter.get("/levels/random", (req, res) => {
  const level = getRandomLevel();
  res.json(level);
});

export default apiRouter;
