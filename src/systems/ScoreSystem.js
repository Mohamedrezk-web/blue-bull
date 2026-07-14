export class ScoreSystem {
  constructor(game) {
    this.game = game;
  }

  incrementScore() {
    this.game.score += 1;
  }

  incrementCasualties() {
    this.game.casualties += 1;
  }
}
