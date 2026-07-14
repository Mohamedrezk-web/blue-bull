import { checkCollision } from "../utils/Collision.js";

export class CollisionSystem {
  constructor(game) {
    this.game = game;
  }

  resolve(entity, target) {
    const [collision, distance, sumOfRadii, dx, dy] = checkCollision(entity, target);
    if (!collision) return false;
    if (distance === 0) {
      entity.collisionX += 1;
      entity.collisionY += 1;
      return true;
    }
    const unitX = dx / distance;
    const unitY = dy / distance;
    entity.collisionX = target.collisionX + (sumOfRadii + 1) * unitX;
    entity.collisionY = target.collisionY + (sumOfRadii + 1) * unitY;
    return true;
  }
}
