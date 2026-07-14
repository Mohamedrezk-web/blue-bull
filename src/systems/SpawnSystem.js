export class SpawnSystem {
  constructor(game) {
    this.game = game;
  }

  spawnEgg() {
    this.game.eggs.push(this.game.createEgg());
  }
}
