import { AssetLoader } from "../assets/AssetLoader.js";
import { InputManager } from "./InputManager.js";
import { EntityManager } from "./EntityManager.js";
import { CollisionSystem } from "./CollisionSystem.js";
import { Renderer } from "./Renderer.js";
import { EventBus } from "./EventBus.js";
import { Player } from "../entities/Player.js";
import { Egg } from "../entities/Egg.js";
import { Globs } from "../entities/Glob.js";
import { Obstacle } from "../entities/Obstacle.js";
import { TOP_MARGIN, DEFAULT_EGG_INTERVAL, MAX_EGGS, DEFAULT_OBSTACLE_COUNT, WIN_SCORE } from "../utils/Constants.js";
import { GameLoop } from "./GameLoop.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.assets = new AssetLoader(document).load();
    this.renderer = new Renderer(this.canvas.getContext("2d"));
    this.eventBus = new EventBus();
    this.entityManager = new EntityManager(this);
    this.collisionSystem = new CollisionSystem(this);
    this.inputManager = new InputManager(this, canvas);
    this.player = new Player(this);
    this.numberOfObstacles = DEFAULT_OBSTACLE_COUNT;
    this.maxEggs = MAX_EGGS;
    this.debug = false;
    this.eggTimer = 0;
    this.eggInterval = DEFAULT_EGG_INTERVAL;
    this.obstacles = [];
    this.eggs = [];
    this.globs = [];
    this.gameOver = false;
    this.casualties = 0;
    this.score = 0;
    this.gameObjects = [this.player, ...this.eggs, ...this.obstacles, ...this.globs];
    this.mouse = { x: this.canvas.width / 2, y: this.canvas.height / 2, pressed: false };
    this.hatchling = [];
    this.topMargin = TOP_MARGIN;
    this.particles = [];
    this.winingScore = WIN_SCORE;
    this.loop = new GameLoop(this, this.renderer.context, canvas);
  }

  render(context) {
    this.gameObjects = [this.player, ...this.eggs, ...this.obstacles, ...this.globs, ...this.hatchling, ...this.particles];
    this.gameObjects.sort((a, b) => a.collisionY - b.collisionY);
    this.gameObjects.forEach((object) => {
      object.update();
      object.draw(context);
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

  createEgg() {
    return new Egg(this);
  }

  addEgg() {
    this.eggs.push(this.createEgg());
  }

  addGlob() {
    this.globs.push(new Globs(this));
  }

  removeGameObject() {
    this.entityManager.removeMarked();
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

  reset() {
    this.gameOver = false;
    this.score = 0;
    this.casualties = 0;
    this.eggTimer = 0;
    this.eggs = [];
    this.globs = [];
    this.obstacles = [];
    this.hatchling = [];
    this.particles = [];
    this.player.collisionX = this.width / 2;
    this.player.collisionY = this.height / 2;
    this.player.speedX = 0;
    this.player.speedY = 0;
    this.player.spriteX = this.player.collisionX - this.player.width * 0.5;
    this.player.spriteY = this.player.collisionY - this.player.height * 0.5;
    this.gameObjects = [this.player];
    this.init();
    this.loop.start();
  }

  start() {
    this.loop.start();
  }
}
