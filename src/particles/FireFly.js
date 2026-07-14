import { Particle } from "./Particle.js";

export class FireFly extends Particle {
  update() {
    this.angel += this.va;
    this.collisionX += Math.cos(this.angel) * this.speedX;
    this.collisionY -= this.speedY;
    if (this.collisionY < 0 - this.radios) {
      this.markForDeletion = true;
      this.game.removeGameObject();
    }
  }
}
