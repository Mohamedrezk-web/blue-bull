import { Entity } from "./Entity.js";

export class Player extends Entity {
  constructor(game) {
    super(game);
    this.collisionX = this.game.width / 2;
    this.collisionY = this.game.height / 2;
    this.collisionRadius = 40;
    this.speedX = 0;
    this.speedY = 0;
    this.dx = 0;
    this.dy = 0;
    this.speedModifier = 5;
    this.spriteWidth = 255;
    this.spriteHeight = 255;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5;
    this.frameX = 0;
    this.frameY = 0;
    this.image = this.game.assets.bull;
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
      context.arc(this.collisionX, this.collisionY, 50, 0, Math.PI * 2);
      context.save();
      context.globalAlpha = 0.5;
      context.fill();
      context.restore();
      context.stroke();
      context.beginPath();
      context.moveTo(this.collisionX, this.collisionY);
      context.lineTo(this.game.mouse.x, this.game.mouse.y);
      context.stroke();
    }
  }

  update() {
    this.dx = this.game.mouse.x - this.collisionX;
    this.dy = this.game.mouse.y - this.collisionY;
    const angle = Math.atan2(this.dy, this.dx);
    if (angle < -2.74 || angle > 2.74) this.frameY = 6;
    else if (angle < -1.96) this.frameY = 7;
    else if (angle < -1.17) this.frameY = 0;
    else if (angle < -0.39) this.frameY = 1;
    else if (angle < 0.39) this.frameY = 2;
    else if (angle < 1.17) this.frameY = 3;
    else if (angle < 1.96) this.frameY = 4;
    else if (angle < 2.74) this.frameY = 5;

    this.dx = this.game.mouse.x - this.collisionX;
    this.dy = this.game.mouse.y - this.collisionY;
    const distance = Math.hypot(this.dy, this.dx);

    if (distance > this.speedModifier) {
      this.speedX = this.dx / distance || 0;
      this.speedY = this.dy / distance || 0;
    } else {
      this.speedX = 0;
      this.speedY = 0;
    }

    this.collisionX += this.speedX * this.speedModifier;
    this.collisionY += this.speedY * this.speedModifier;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5;

    if (this.collisionX < 0 + this.collisionRadius) this.collisionX = 0 + this.collisionRadius;
    else if (this.collisionX > this.game.width - this.collisionRadius) this.collisionX = this.game.width - this.collisionRadius;

    if (this.collisionY < this.game.topMargin + this.collisionRadius) this.collisionY = this.game.topMargin + this.collisionRadius;
    else if (this.collisionY > this.game.height - this.collisionRadius) this.collisionY = this.game.height - this.collisionRadius;

    this.game.obstacles.forEach((obstacle) => {
      if (this.game.collisionSystem.resolve(this, obstacle)) {
        return;
      }
    });
  }
}
