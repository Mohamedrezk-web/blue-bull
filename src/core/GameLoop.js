export class GameLoop {
  constructor(game, context, canvas) {
    this.game = game;
    this.context = context;
    this.canvas = canvas;
    this.running = false;
    this._stopped = false;
  }

  stop() {
    this._stopped = true;
    this.running = false;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this._stopped = false;
    const animate = () => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.game.render(this.context);
      if (!this.game.gameOver && !this._stopped) {
        requestAnimationFrame(animate);
      } else {
        this.running = false;
      }
    };
    animate();
  }
}
