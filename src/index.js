import { Game } from "./core/Game.js";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("mainCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 1280;
  canvas.height = 720;

  ctx.fillStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "white";

  const game = new Game(canvas);
  game.init();
  game.start();
});
