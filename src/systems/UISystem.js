export class UISystem {
  constructor(game) {
    this.game = game;
  }

  draw(context) {
    context.fillText(`Score: ${this.game.score}`, 25, 50);
  }
}
