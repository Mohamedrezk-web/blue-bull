import { Entity } from "./Entity.js";
import { FireFly } from "../particles/FireFly.js";
import { Spark } from "../particles/Spark.js";

export class Larva extends Entity {
  constructor(game, x, y) {
    super(game);
    this.collisionRadius = 30;
    this.collisionX = x;
    this.collisionY = y;
    this.image = this.game.assets.larval;
    this.spriteWidth = 150;
    this.spriteHeight = 150;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 50;
    this.speedY = Math.random() + 1;
    this.frameY = Math.floor(Math.random() * 2);
    this.frameX = 0;
  }

  draw(context) {
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height,
    );

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
    if (this.game.gameOver) return;
    this.collisionY -= this.speedY;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 50;
    if (this.collisionY < this.game.topMargin) {
      this.markForDeletion = true;
      this.game.removeGameObject();
      this.game.score++;
      for (let i = 0; i < 5; i++) {
        this.game.particles.push(new FireFly(this.game, this.collisionX, this.collisionY, "black"));
      }
    }

    const collisionObjects = [this.game.player, ...this.game.obstacles];
    collisionObjects.forEach((object) => {
      this.game.collisionSystem.resolve(this, object);
    });

    this.game.globs.forEach((glob) => {
      if (this.game.collisionSystem.resolve(this, glob)) {
        this.markForDeletion = true;
        this.game.removeGameObject();
        this.game.casualties++;
        for (let i = 0; i < 5; i++) {
          this.game.particles.push(new Spark(this.game, this.collisionX, this.collisionY, "red"));
        }
      }
    });
  }
}
