export class Entity {
  constructor(game) {
    this.game = game;
    this.collisionX = 0;
    this.collisionY = 0;
    this.collisionRadius = 0;
    this.spriteX = 0;
    this.spriteY = 0;
    this.width = 0;
    this.height = 0;
    this.markForDeletion = false;
  }

  draw() {}
  update() {}
}
