export class PhysicsSystem {
  constructor(game) {
    this.game = game;
  }

  update() {
    this.game.gameObjects.forEach((object) => object.update());
  }
}
