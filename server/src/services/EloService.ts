export class EloService {
  private static readonly K_FACTOR = 16;
  private static readonly DNF_PENALTY = 20; // Fixed penalty for DNF players

  /**
   * Calculate new Elo ratings for two players based on game outcome
   * @param rating1 Player 1's current rating
   * @param rating2 Player 2's current rating
   * @param time1 Player 1's finish time
   * @param time2 Player 2's finish time
   * @returns [newRating1, newRating2]
   */
  static calculateNewRatings(
    rating1: number,
    rating2: number,
    time1: number,
    time2: number
  ): [number, number] {
    const expectedScore1 = 1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
    const expectedScore2 = 1 - expectedScore1;
    const score2 = 1 - expectedScore1;

    const newRating1 = Math.round(
      rating1 + this.K_FACTOR * (score2 - expectedScore1)
    );
    const newRating2 = Math.round(
      rating2 + this.K_FACTOR * (score2 - expectedScore2)
    );

    return [newRating1, newRating2];
  }

  static expectedScore(rating1: number, rating2: number): number {
    return 1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
  }

  static actualScore(time1: number, time2: number): number {
    if (time1 === time2) return 0.5;
    if (time2 === Infinity) return 1;
    if (time1 === Infinity) return 0;
    if (time1 < time2) time2 *= 3;
    else time1 *= 3;
    return 0.8 / (1.0 + time1 / time2) + 0.1;
  }

  /**
   * Calculate new Elo ratings for multiple players based on their finishing positions
   * @param players Array of [playerId, currentRating]
   * @param times Array of finish time of each player
   * @returns Map of playerId to new rating
   */
  static calculateMultiPlayerRatings(
    currentRatings: number[],
    times: number[]
  ): number[] {
    const newRatings = currentRatings.map((rating) => rating);

    for (let i = 0; i < currentRatings.length; i++) {
      let ratingChange = 0;

      for (let j = 0; j < currentRatings.length; j++) {
        if (i === j) continue;

        const expected = this.expectedScore(
          currentRatings[i],
          currentRatings[j]
        );
        const actual = this.actualScore(times[i], times[j]);
        ratingChange += this.K_FACTOR * (actual - expected);
      }

      newRatings[i] += Math.round(ratingChange);
    }

    return newRatings;
  }
}
