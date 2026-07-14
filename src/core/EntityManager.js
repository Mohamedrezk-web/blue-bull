export class EntityManager {
  constructor(game) {
    this.game = game;
  }

  add(entity) {
    this.game.gameObjects.push(entity);
  }

  removeMarked() {
    this.game.eggs = this.game.eggs.filter((egg) => !egg.markForDeletion);
    this.game.hatchling = this.game.hatchling.filter((larval) => !larval.markForDeletion);
    this.game.particles = this.game.particles.filter((particle) => !particle.markForDeletion);
  }
}
