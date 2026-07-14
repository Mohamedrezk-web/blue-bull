import { Entity } from "../entities/Entity.js";

export class Particle extends Entity {
  constructor(game, x, y, color) {
    super(game);
    this.collisionX = x;
    this.collisionY = y;
    this.color = color;
    this.radios = Math.floor(Math.random() * 10 + 5);
    this.speedX = Math.random() * 6 - 3;
    this.speedY = Math.random() * 2 + 0.5;
    this.angel = 0;
    this.va = Math.random() * 0.1 + 0.01;
  }

  draw(context) {
    context.save();
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.collisionX, this.collisionY, this.radios, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.restore();
  }
}
