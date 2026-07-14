export class InputManager {
  constructor(game, canvas) {
    this.game = game;
    this.canvas = canvas;
    this._handlers = [];
    this.bindEvents();
  }

  _on(target, event, handler) {
    target.addEventListener(event, handler);
    this._handlers.push([target, event, handler]);
  }

  bindEvents() {
    const updatePointer = (x, y, pressed) => {
      this.game.mouse.pressed = pressed;
      this.game.mouse.x = x;
      this.game.mouse.y = y;
    };

    this._on(this.canvas, "pointerdown", (e) => {
      e.preventDefault();
      updatePointer(e.offsetX, e.offsetY, true);
    });

    this._on(this.canvas, "pointerup", (e) => {
      e.preventDefault();
      updatePointer(e.offsetX, e.offsetY, false);
    });

    this._on(this.canvas, "pointermove", (e) => {
      if (this.game.mouse.pressed) {
        updatePointer(e.offsetX, e.offsetY, true);
      }
    });

    this._on(window, "keydown", (e) => {
      if (e.key === "d") {
        this.game.debug = !this.game.debug;
      }
      if (e.key.toLowerCase() === "r") {
        this.game.reset();
      }
    });
  }

  destroy() {
    this._handlers.forEach(([target, event, handler]) => {
      target.removeEventListener(event, handler);
    });
    this._handlers = [];
  }
}
