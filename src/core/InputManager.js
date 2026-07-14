export class InputManager {
  constructor(game, canvas) {
    this.game = game;
    this.canvas = canvas;
    this.bindEvents();
  }

  bindEvents() {
    const updatePointer = (x, y, pressed) => {
      this.game.mouse.pressed = pressed;
      this.game.mouse.x = x;
      this.game.mouse.y = y;
    };

    this.canvas.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      updatePointer(e.offsetX, e.offsetY, true);
    });

    this.canvas.addEventListener("pointerup", (e) => {
      e.preventDefault();
      updatePointer(e.offsetX, e.offsetY, false);
    });

    this.canvas.addEventListener("pointermove", (e) => {
      if (this.game.mouse.pressed) {
        updatePointer(e.offsetX, e.offsetY, true);
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
