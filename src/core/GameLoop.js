export class GameLoop {
  constructor(game, context, canvas) {
    this.game = game;
    this.context = context;
    this.canvas = canvas;
    this.running = false;
  }

  start() {
    if (this.running) return;
    this.running = true;
    const animate = () => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.game.render(this.context);
      if (!this.game.gameOver) {
        requestAnimationFrame(animate);
      } else {
        this.running = false;
      }
    };
    animate();
  }
}
