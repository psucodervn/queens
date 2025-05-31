import express from "express";
import { getRandomLevel, getLevelById } from "../game";
import { EloService } from "../services/EloService";

const apiRouter = express.Router();

apiRouter.get("/levels/random", (req, res) => {
  const level = getRandomLevel({});
  res.json(level);
});

apiRouter.get("/levels/:id", (req, res) => {
  const level = getLevelById(req.params.id);
  res.json(level);
});

interface Player {
  id: number;
  rating: number;
  newRating?: number;
  dnf: boolean;
  finishTime?: number;
}

apiRouter.post("/elo/calculate", (req, res) => {
  const { players }: { players: Player[] } = req.body;

  const ratings = players.map((player) => player.rating);
  const times = players.map((player) =>
    player.dnf ? Infinity : player.finishTime!
  );

  const newRatings = EloService.calculateMultiPlayerRatings(ratings, times);

  const newPlayers = players.map((player, index) => {
    const newRating = newRatings[index];
    return {
      ...player,
      newRating,
    };
  });

  res.json(newPlayers);
});

export default apiRouter;
