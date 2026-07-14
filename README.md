# Blue Bull

A browser-based JavaScript canvas game built with a custom entity system.

## Project Structure

- `index.html` - Main game entry point.
- `style.css` - Game styling.
- `src/` - Source JavaScript files.
  - `assets/` - Asset loading logic.
  - `core/` - Game engine, loop, renderer, input, and collision logic.
  - `entities/` - Game object classes like `Player`, `Egg`, `Larva`, `Glob`, `Obstacle`.
  - `particles/` - Particle effects.
  - `states/` - Game state classes.
  - `systems/` - Systems for physics, scoring, spawning, and UI.
  - `utils/` - Utility helpers and constants.

## How to Run

1. Open `index.html` in a web browser.
2. Use mouse input to control the player.
3. Press `R` to reset the game after game over.

## Notes

- The game uses a canvas-based render loop in `src/core/GameLoop.js`.
- Game entities are updated before rendering to avoid flash artifacts.
- Restart logic is handled in `src/core/Game.js` and listens for the `r` key.

## Development

No build tools are required. Edit the source files directly and refresh the browser to see changes.
