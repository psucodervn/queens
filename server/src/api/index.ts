import express from "express";
import { levels } from "../game/levels";

const apiRouter = express.Router();
const levelsArray = Object.values(levels);

apiRouter.get("/levels/random", (req, res) => {
  const level = levelsArray[Math.floor(Math.random() * levelsArray.length)];
  res.json(level);
});

export default apiRouter;
