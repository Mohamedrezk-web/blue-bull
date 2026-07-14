(function () {
  'use strict';

  window.__MFE_REGISTRY__ = window.__MFE_REGISTRY__ || {};

  // Capture BASE_URL at script-load time (currentScript is null inside async callbacks).
  const BASE_URL = (document.currentScript?.src ?? '').replace(/\/mfe-entry\.js.*$/, '');

  // IDs the game's AssetLoader fetches via document.getElementById.
  // We inject hidden <img> elements into document.body so the lookup works
  // even though the canvas lives inside the shell's DOM.
  const ASSETS = {
    overlay:   `${BASE_URL}/assets/overlay.png`,
    obstacles: `${BASE_URL}/assets/obstacles.png`,
    bull:      `${BASE_URL}/assets/bull.png`,
    egg:       `${BASE_URL}/assets/egg.png`,
    glob:      `${BASE_URL}/assets/glob.png`,
    globs:     `${BASE_URL}/assets/globs.png`,
    larval:    `${BASE_URL}/assets/larva.png`,
  };

  let _game = null;
  let _container = null;
  let _resizeHandler = null;

  function injectAssets() {
    if (document.getElementById('__mfe-game-assets__')) return;
    const wrapper = document.createElement('div');
    wrapper.id = '__mfe-game-assets__';
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.style.display = 'none';
    Object.entries(ASSETS).forEach(([id, src]) => {
      const img = document.createElement('img');
      img.id = id;
      img.src = src;
      img.alt = '';
      wrapper.appendChild(img);
    });
    document.body.appendChild(wrapper);
  }

  function removeAssets() {
    document.getElementById('__mfe-game-assets__')?.remove();
  }

  window.__MFE_REGISTRY__['game'] = {

    async bootstrap() {
      // Preload all images in parallel so the first frame renders without flicker.
      await Promise.all(
        Object.values(ASSETS).map(
          (src) => new Promise((done) => {
            const img = new Image();
            img.onload = img.onerror = done;
            img.src = src;
          })
        )
      );
    },

    async mount(container) {
      _container = container;
      _container.style.cssText = 'position:relative;overflow:hidden;min-height:540px;';

      // Canvas — background image applied via CSS so it renders even before
      // the game loop ticks for the first time.
      const canvas = document.createElement('canvas');
      canvas.style.cssText = [
        'display:block',
        'width:100%',
        'height:100%',
        'position:absolute',
        'inset:0',
        `background:url(${BASE_URL}/assets/background.png) no-repeat center center/cover`,
      ].join(';');
      _container.appendChild(canvas);

      // Decorative overlay (sits above canvas, pointer-events:none).
      const overlayEl = document.createElement('img');
      overlayEl.src = `${BASE_URL}/assets/overlay.png`;
      overlayEl.alt = '';
      overlayEl.style.cssText = [
        'position:absolute',
        'inset:0',
        'width:100%',
        'height:100%',
        'object-fit:cover',
        'pointer-events:none',
      ].join(';');
      _container.appendChild(overlayEl);

      // Hidden asset elements in document.body — required by AssetLoader.
      injectAssets();

      function sizeCanvas() {
        canvas.width  = _container.clientWidth  || 800;
        canvas.height = _container.clientHeight || 540;
      }
      sizeCanvas();

      // Dynamic import resolves all relative sub-imports relative to the
      // game's own deployment URL — no path rewriting needed.
      const { Game } = await import(`${BASE_URL}/src/core/Game.js`);

      _game = new Game(canvas);
      _game.resize(canvas.width, canvas.height);

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'white';

      _game.init();
      _game.start();

      _resizeHandler = () => {
        sizeCanvas();
        _game?.resize(canvas.width, canvas.height);
      };
      window.addEventListener('resize', _resizeHandler);
    },

    async unmount(_container) {
      if (_resizeHandler) {
        window.removeEventListener('resize', _resizeHandler);
        _resizeHandler = null;
      }
      if (_game) {
        _game.destroy(); // stops RAF loop + removes all event listeners
        _game = null;
      }
      removeAssets();
      if (_container) {
        _container.innerHTML = '';
        _container = null;
      }
    },
  };
})();
