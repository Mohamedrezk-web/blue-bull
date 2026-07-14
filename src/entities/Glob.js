import { Entity } from "./Entity.js";
import { randomInt } from "../utils/Random.js";

export class Globs extends Entity {
  constructor(game) {
    super(game);
    this.collisionRadius = 30;
    this.spriteWidth = 140;
    this.spriteHeight = 260;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5;
    this.collisionY = this.game.topMargin + Math.random() * (this.game.height - this.game.topMargin);
    this.speedX = Math.random() * 3 + 0.5;
    this.image = this.game.assets.globs;
    this.frameY = randomInt(4);
  }

  draw(context) {
    context.drawImage(this.image, 0, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);

    if (this.game.debug) {
      context.beginPath();
      context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
      context.save();
      context.globalAlpha = 0.5;
      context.fill();
      context.restore();
      context.stroke();
    }
  }

  update() {
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height + 40;
    this.collisionX -= this.speedX;
    if (this.collisionX + this.width < 0) {
      this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5;
      this.collisionY = this.game.topMargin + Math.random() * (this.game.height - this.game.topMargin);
      this.frameY = randomInt(4);
    }

    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 20;
    const collisionObjects = [this.game.player, ...this.game.obstacles];
    collisionObjects.forEach((object) => {
      this.game.collisionSystem.resolve(this, object);
    });
  }
}
