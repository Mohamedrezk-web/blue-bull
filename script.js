window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("mainCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 1280;
  canvas.height = 720;

  ctx.fillStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "white";

  class Player {
    constructor(game) {
      this.game = game;
      this.collisionX = this.game.width / 2;
      this.collisionY = this.game.height / 2;
      this.collisionRadius = 40;
      this.speedX = 0;
      this.speedY = 0;
      this.dx = 0;
      this.dy = 0;
      this.speedModifier = 5;
      this.spriteWidth = 255;
      this.spriteHeight = 255;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX;
      this.spriteY;
      this.frameX = 0;
      this.frameY = 0;
      this.image = document.getElementById("bull");
    }

    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.spriteX,
        this.spriteY,
        this.width,
        this.height,
      );
      if (this.game.debug) {
        context.beginPath();
        context.arc(this.collisionX, this.collisionY, 50, 0, Math.PI * 2);
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
        context.beginPath();
        context.moveTo(this.collisionX, this.collisionY);
        context.lineTo(this.game.mouse.x, this.game.mouse.y);
        context.stroke();
      }
    }

    update() {
      this.dx = this.game.mouse.x - this.collisionX;
      this.dy = this.game.mouse.y - this.collisionY;
      const angle = Math.atan2(this.dy, this.dx);
      if (angle < -2.74 || angle > 2.74) this.frameY = 6;
      else if (angle < -1.96) this.frameY = 7;
      else if (angle < -1.17) this.frameY = 0;
      else if (angle < -0.39) this.frameY = 1;
      else if (angle < 0.39) this.frameY = 2;
      else if (angle < 1.17) this.frameY = 3;
      else if (angle < 1.96) this.frameY = 4;
      else if (angle < 2.74) this.frameY = 5;

      this.dx = this.game.mouse.x - this.collisionX;
      this.dy = this.game.mouse.y - this.collisionY;

      const distance = Math.hypot(this.dy, this.dx);

      if (distance > this.speedModifier) {
        this.speedX = this.dx / distance || 0;
        this.speedY = this.dy / distance || 0;
      } else {
        this.speedX = 0;
        this.speedY = 0;
      }

      this.collisionX += this.speedX * this.speedModifier;
      this.collisionY += this.speedY * this.speedModifier;

      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5;

      if (this.collisionX < 0 + this.collisionRadius) this.collisionX = 0 + this.collisionRadius;
      else if (this.collisionX > this.game.width - this.collisionRadius) this.collisionX = this.game.width - this.collisionRadius;

      if (this.collisionY < this.game.topMargin + this.collisionRadius) this.collisionY = this.game.topMargin + this.collisionRadius;
      else if (this.collisionY > this.game.height - this.collisionRadius) this.collisionY = this.game.height - this.collisionRadius;

      this.game.obstacles.forEach((obstacle) => {
        if (this.game.checkCollision(this, obstacle)) {
          const [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, obstacle);
          if (collision) {
            const unit_x = dx / distance;
            const unit_y = dy / distance;
            this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;
            this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;
          }
        }
      });
    }
  }

  class Globs {
    constructor(game) {
      this.game = game;
      this.collisionRadius = 30;
      this.spriteWidth = 140;
      this.spriteHeight = 260;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5;
      this.collisionY = this.game.topMargin + Math.random() * (this.game.height - this.game.topMargin);
      this.speedX = Math.random() * 3 + 0.5;
      this.image = document.getElementById("globs");

      this.spriteX;
      this.spriteY;
      this.frameX = 0;
      this.frameY = Math.floor(Math.random() * 4);
    }

    draw(context) {
      context.drawImage(this.image, 0, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);

      if (this.game.debug) {
        context.beginPath();
        context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
      }
    }

    update() {
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height + 40;
      this.collisionX -= this.speedX;
      if (this.collisionX + this.width < 0) {
        this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5;
        this.collisionY = this.game.topMargin + Math.random() * (this.game.height - this.game.topMargin);
        this.frameY = Math.floor(Math.random() * 4);
      }

      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 20;
      const collisionObjects = [this.game.player, ...this.game.obstacles];
      collisionObjects.forEach((object) => {
        const [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, object);

        if (collision) {
          const unit_x = dx / distance;
          const unit_y = dy / distance;
          this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x;
          this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;
        }
      });
    }
  }

  class Larval {
    constructor(game, x, y) {
      this.game = game;
      this.collisionRadius = 30;
      this.collisionX = x;
      this.collisionY = y;

      this.image = document.getElementById("larval");
      this.spriteWidth = 150;
      this.spriteHeight = 150;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX;
      this.spriteY;
      this.speedY = Math.random() + 1;
      this.markForDeletion = false;
      this.frameY = Math.floor(Math.random() * 2);
      this.frameX = 0;
    }

    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.spriteX,
        this.spriteY,
        this.width,
        this.height,
      );

      if (this.game.debug) {
        context.beginPath();
        context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
      }
    }

    update() {
      if (this.game.gameOver) return;
      this.collisionY -= this.speedY;
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 50;
      if (this.collisionY < this.game.topMargin) {
        this.markForDeletion = true;
        this.game.removeGameObject();
        this.game.score++;
        for (let i = 0; i < 5; i++) {
          this.game.particles.push(new FireFly(this.game, this.collisionX, this.collisionY, "black"));
        }
      }

      const collisionObjects = [this.game.player, ...this.game.obstacles];
      collisionObjects.forEach((object) => {
        const [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, object);

        if (collision) {
          const unit_x = dx / distance;
          const unit_y = dy / distance;
          this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x;
          this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;
        }
      });

      this.game.globs.forEach((glob) => {
        const [collision] = this.game.checkCollision(this, glob);
        if (collision) {
          this.markForDeletion = true;
          this.game.removeGameObject();
          this.game.casualties++;
          for (let i = 0; i < 5; i++) {
            this.game.particles.push(new Spark(this.game, this.collisionX, this.collisionY, "red"));
          }
        }
      });
    }
  }

  class egg {
    constructor(game) {
      this.game = game;
      this.collisionRadius = 40;
      this.margin = this.collisionRadius * 2;
      this.collisionX = this.margin + Math.random() * (this.game.width - this.margin * 2);
      this.collisionY = this.game.topMargin + Math.random() * (this.game.height - this.game.topMargin - this.margin);
      this.image = document.getElementById("egg");
      this.spriteWidth = 110;
      this.spriteHeight = 135;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX;
      this.spriteY;
      this.hatchTimer = 0;
      this.hatchInterval = 5000;
      this.markForDeletion = false;
    }

    draw(context) {
      context.drawImage(this.image, this.spriteX, this.spriteY, this.width, this.height);

      if (this.game.debug) {
        context.beginPath();
        context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
      }
    }
    update() {
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 20;
      const collisionObjects = [this.game.player, ...this.game.obstacles, ...this.game.globs];
      collisionObjects.forEach((object) => {
        const [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, object);

        if (collision) {
          const unit_x = dx / distance;
          const unit_y = dy / distance;
          this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x;
          this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;
        }
      });

      if (this.hatchTimer > this.hatchInterval) {
        this.game.hatchling.push(new Larval(this.game, this.collisionX, this.collisionY));
        this.markForDeletion = true;
        this.game.removeGameObject();
      } else {
        this.hatchTimer += 16.66;
      }
    }
  }

  class Obstacle {
    constructor(game) {
      this.game = game;
      this.collisionX = Math.random() * this.game.width;
      this.collisionY = Math.random() * this.game.height;
      this.collisionRadius = 40;
      this.image = document.getElementById("obstacles");
      this.spriteWidth = 250;
      this.spriteHeight = 250;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 70;

      this.frameX = Math.floor(Math.random() * 4);
      this.frameY = Math.floor(Math.random() * 3);
    }

    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.spriteX,
        this.spriteY,
        this.width,
        this.height,
      );

      if (this.game.debug) {
        context.beginPath();
        context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
      }
    }

    update() {}
  }

  class Particle {
    constructor(game, x, y, color) {
      this.game = game;
      this.collisionX = x;
      this.collisionY = y;
      this.color = color;
      this.radios = Math.floor(Math.random() * 10 + 5);
      this.speedX = Math.random() * 6 - 3;
      this.speedY = Math.random() * 2 + 0.5;
      this.angel = 0;
      this.va = Math.random() * 0.1 + 0.01;
      this.markForDeletion = false;
    }

    draw(context) {
      context.save();
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(this.collisionX, this.collisionY, this.radios, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.restore();
    }
  }

  class FireFly extends Particle {
    update() {
      this.angel += this.va;
      this.collisionX += Math.cos(this.angel) * this.speedX;
      this.collisionY -= this.speedY;
      if (this.collisionY < 0 - this.radios) {
        this.markForDeletion = true;
        this.game.removeGameObject();
      }
    }
  }

  class Spark extends Particle {
    update() {
      this.angel += this.va * 0.5;
      this.collisionX += Math.cos(this.angel) * this.speedX;
      this.collisionY -= Math.sin(this.angel) * this.speedY;
      if (this.radios > 0.1) this.radios -= 0.05;
      if (this.radios < 0.2) {
        this.markForDeletion = true;
        this.game.removeGameObject();
      }
    }
  }

  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.player = new Player(this);
      this.numberOfObstacles = 3;
      this.maxEggs = 10;
      this.debug = false;
      this.eggTimer = 0;
      this.eggInterval = 1000;
      this.obstacles = [];
      this.eggs = [];
      this.globs = [];
      this.gameOver = false;
      this.casualties = 0;
      this.score = 0;
      this.gameObjects = [this.player, ...this.eggs, ...this.obstacles, ...this.globs];
      this.mouse = {
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        pressed: false,
      };
      this.hatchling = [];
      this.topMargin = 260;
      this.particles = [];
      this.winingScore = 15;

      // mouse interactivity
      canvas.addEventListener("mousedown", (e) => {
        this.mouse.pressed = true;
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
      });

      canvas.addEventListener("mouseup", (e) => {
        this.mouse.pressed = false;
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
      });

      canvas.addEventListener("mousemove", (e) => {
        if (this.mouse.pressed) {
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
        }
      });

      window.addEventListener("keydown", (e) => {
        if (e.key === "d") {
          this.debug = !this.debug;
        }
        if (e.key.toLowerCase() === "r") {
          this.reset();
        }
      });
    }

    render(context) {
      this.gameObjects = [this.player, ...this.eggs, ...this.obstacles, ...this.globs, ...this.hatchling, ...this.particles];

      this.gameObjects.sort((a, b) => a.collisionY - b.collisionY);
      this.gameObjects.forEach((object) => {
        object.draw(context);
        object.update();
      });
      if (this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs) {
        this.addEgg();
        this.eggTimer = 0;
      } else {
        this.eggTimer += 16.66;
      }

      context.fillText(`Score: ${this.score}`, 25, 50);

      if (this.score >= this.winingScore) {
        this.gameOver = true;
        context.save();
        context.fillStyle = "rgba(0,0,0,0.5)";
        context.fillRect(0, 0, this.width, this.height);
        context.fillStyle = "white";
        context.textAlign = "center";
        let m1;
        let m2;
        if (this.casualties <= 5) {
          m1 = "Perfect";
          m2 = "i'm proud of you";
        } else {
          m1 = "Too many Casualties";
          m2 = "Still proud of you DW do better next time, you lost " + this.casualties + " Larva";
        }
        context.font = "130px Helvetica";
        context.fillText(m1, this.width * 0.5, this.height * 0.5 - 20);
        context.font = "40px Helvetica";
        context.fillText(m2, this.width * 0.5, this.height * 0.5 + 30);
        context.fillText("Press R to start again", this.width * 0.5, this.height * 0.5 + 80);

        context.restore();
      }
    }

    addEgg() {
      this.eggs.push(new egg(this));
    }

    addGlob() {
      this.globs.push(new Globs(this));
    }

    removeGameObject(gameObject) {
      this.eggs = this.eggs.filter((egg) => !egg.markForDeletion);
      this.hatchling = this.hatchling.filter((larval) => !larval.markForDeletion);
      this.particles = this.particles.filter((particle) => !particle.markForDeletion);
    }

    init() {
      for (let i = 0; i < 5; i++) {
        this.addGlob();
      }
      let attempts = 0;
      while (this.obstacles.length < this.numberOfObstacles && attempts < 100) {
        const obstacle = new Obstacle(this);
        let overlapping = false;
        this.obstacles.forEach((existingObstacle) => {
          const distance = Math.hypot(obstacle.collisionX - existingObstacle.collisionX, obstacle.collisionY - existingObstacle.collisionY);
          if (distance < obstacle.collisionRadius + existingObstacle.collisionRadius) {
            overlapping = true;
          }
        });
        const margin = obstacle.collisionRadius * 3;
        if (
          !overlapping &&
          obstacle.spriteX > 0 &&
          obstacle.spriteX < this.width - obstacle.width &&
          obstacle.collisionY > this.topMargin + margin &&
          obstacle.collisionY < this.height - margin
        ) {
          this.obstacles.push(obstacle);
        }
        attempts++;
      }
    }
    checkCollision(a, b) {
      const dx = a.collisionX - b.collisionX;
      const dy = a.collisionY - b.collisionY;
      const distance = Math.hypot(dy, dx);
      const sumOfRadii = a.collisionRadius + b.collisionRadius;
      return [distance < sumOfRadii, distance, sumOfRadii, dx, dy];
    }
  }

  const game = new Game(canvas);

  game.init();
  function animate() {
    console.log(game.globs);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    if (!game.gameOver) requestAnimationFrame(animate);
  }

  animate();
});
