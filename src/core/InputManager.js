export class InputManager {
  constructor(game, canvas) {
    this.game = game;
    this.canvas = canvas;
    this.bindEvents();
  }

  bindEvents() {
    this.canvas.addEventListener("mousedown", (e) => {
      this.game.mouse.pressed = true;
      this.game.mouse.x = e.offsetX;
      this.game.mouse.y = e.offsetY;
    });

    this.canvas.addEventListener("mouseup", (e) => {
      this.game.mouse.pressed = false;
      this.game.mouse.x = e.offsetX;
      this.game.mouse.y = e.offsetY;
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.game.mouse.pressed) {
        this.game.mouse.x = e.offsetX;
        this.game.mouse.y = e.offsetY;
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "d") {
        this.game.debug = !this.game.debug;
      }
      if (e.key.toLowerCase() === "r") {
        this.game.reset();
      }
    });
  }
}
