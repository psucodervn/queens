import express from "express";
import { getRandomLevel } from "../game";
import { EloService } from "../services/EloService";

const apiRouter = express.Router();

apiRouter.get("/levels/random", (req, res) => {
  const level = getRandomLevel({});
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
  players.sort((a, b) => {
    if (a.dnf && !b.dnf) return 1;
    if (!a.dnf && b.dnf) return -1;
    if (a.dnf && b.dnf) return 0;
    return a.finishTime! - b.finishTime!;
  });

  const dnfPlayers = players
    .filter((player) => player.dnf)
    .map((player) => player.id.toString());

  const pos = new Array(players.length).fill(0);
  pos[0] = 0;
  for (let i = 1; i < players.length; i++) {
    const player = players[i];
    if (player.finishTime! > players[i - 1].finishTime!) {
      pos[i] = pos[i - 1] + 1;
    } else {
      pos[i] = pos[i - 1];
    }
  }

  const newRatings = EloService.calculateMultiPlayerRatings(
    players.map((player) => [player.id.toString(), player.rating]),
    pos,
    new Set(dnfPlayers)
  );

  const newPlayers = players.map((player) => {
    const newRating = newRatings.get(player.id.toString());
    return {
      ...player,
      newRating,
    };
  });

  res.json(newPlayers);
});

export default apiRouter;
