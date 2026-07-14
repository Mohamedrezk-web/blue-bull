import { Particle } from "./Particle.js";

export class Spark extends Particle {
  update() {
    this.angel += this.va * 0.5;
    this.collisionX += Math.cos(this.angel) * this.speedX;
    this.collisionY -= Math.sin(this.angel) * this.speedY;
    if (this.radios > 0.1) this.radios -= 0.05;
    if (this.radios < 0.2) {
      this.markForDeletion = true;
      this.game.removeGameObject();
    }
  }
}
