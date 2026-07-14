export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export function randomInt(max) {
  return Math.floor(Math.random() * max);
}
