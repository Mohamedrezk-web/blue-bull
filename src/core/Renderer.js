export class Renderer {
  constructor(context) {
    this.context = context;
  }

  clear() {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
  }

  drawText(text, x, y, size = 20, color = "white") {
    this.context.save();
    this.context.fillStyle = color;
    this.context.font = `${size}px Helvetica`;
    this.context.fillText(text, x, y);
    this.context.restore();
  }
}
