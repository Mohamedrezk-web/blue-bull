import { Game } from "./core/Game.js";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("mainCanvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = Math.max(800, window.innerWidth - 40);
    canvas.height = Math.max(500, window.innerHeight - 40);
  }

  resizeCanvas();
  const game = new Game(canvas);
  game.resize(canvas.width, canvas.height);

  window.addEventListener("resize", () => {
    resizeCanvas();
    game.resize(canvas.width, canvas.height);
  });

  ctx.fillStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "white";

  game.init();
  game.start();
});
