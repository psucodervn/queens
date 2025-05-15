export class EloService {
  private static readonly K_FACTOR = 32;

  /**
   * Calculate new Elo ratings for two players based on game outcome
   * @param rating1 Player 1's current rating
   * @param rating2 Player 2's current rating
   * @param score1 Player 1's score (1 for win, 0.5 for draw, 0 for loss)
   * @returns [newRating1, newRating2]
   */
  static calculateNewRatings(
    rating1: number,
    rating2: number,
    score1: number
  ): [number, number] {
    const expectedScore1 = 1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
    const expectedScore2 = 1 - expectedScore1;
    const score2 = 1 - score1;

    const newRating1 = Math.round(rating1 + this.K_FACTOR * (score1 - expectedScore1));
    const newRating2 = Math.round(rating2 + this.K_FACTOR * (score2 - expectedScore2));

    return [newRating1, newRating2];
  }

  /**
   * Calculate new Elo ratings for multiple players based on their finishing positions
   * @param players Array of [playerId, currentRating]
   * @param finishOrder Array of playerIds in order of finish (best to worst)
   * @returns Map of playerId to new rating
   */
  static calculateMultiPlayerRatings(
    players: [string, number][],
    finishOrder: string[]
  ): Map<string, number> {
    const playerMap = new Map(players);
    const newRatings = new Map(players);

    // Compare each player against every other player
    for (let i = 0; i < finishOrder.length; i++) {
      const player1Id = finishOrder[i];
      const rating1 = playerMap.get(player1Id)!;

      for (let j = i + 1; j < finishOrder.length; j++) {
        const player2Id = finishOrder[j];
        const rating2 = playerMap.get(player2Id)!;

        // Player who finished first (lower index) gets score of 1
        const [newRating1, newRating2] = this.calculateNewRatings(rating1, rating2, 1);

        // Update running totals
        newRatings.set(
          player1Id,
          Math.round((newRatings.get(player1Id)! + newRating1) / 2)
        );
        newRatings.set(
          player2Id,
          Math.round((newRatings.get(player2Id)! + newRating2) / 2)
        );
      }
    }

    return newRatings;
  }
}
