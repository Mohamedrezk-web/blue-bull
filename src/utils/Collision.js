export function checkCollision(a, b) {
  const dx = a.collisionX - b.collisionX;
  const dy = a.collisionY - b.collisionY;
  const distance = Math.hypot(dy, dx);
  const sumOfRadii = a.collisionRadius + b.collisionRadius;
  return [distance < sumOfRadii, distance, sumOfRadii, dx, dy];
}
