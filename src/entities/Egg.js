import { Entity } from "./Entity.js";
import { Larva } from "./Larva.js";

export class Egg extends Entity {
  constructor(game) {
    super(game);
    this.collisionRadius = 40;
    this.margin = this.collisionRadius * 2;
    this.collisionX = this.margin + Math.random() * (this.game.width - this.margin * 2);
    this.collisionY = this.game.topMargin + Math.random() * (this.game.height - this.game.topMargin - this.margin);
    this.image = this.game.assets.egg;
    this.spriteWidth = 110;
    this.spriteHeight = 135;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 20;
    this.hatchTimer = 0;
    this.hatchInterval = 5000;
  }

  draw(context) {
    context.drawImage(this.image, this.spriteX, this.spriteY, this.width, this.height);

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
    this.spriteY = this.collisionY - this.height * 0.5 - 20;
    const collisionObjects = [this.game.player, ...this.game.obstacles, ...this.game.globs];
    collisionObjects.forEach((object) => {
      this.game.collisionSystem.resolve(this, object);
    });

    if (this.hatchTimer > this.hatchInterval) {
      this.game.hatchling.push(new Larva(this.game, this.collisionX, this.collisionY));
      this.markForDeletion = true;
      this.game.removeGameObject();
    } else {
      this.hatchTimer += 16.66;
    }
  }
}
