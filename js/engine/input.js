// Apex Descent - Input System
export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = {};
    this.keysJustPressed = {};
    this.mouse = { x: 0, y: 0, worldX: 0, worldY: 0, left: false, right: false, leftJust: false, rightJust: false };
    this.wheelDelta = 0;

    window.addEventListener('keydown', (e) => {
      if (!this.keys[e.code]) this.keysJustPressed[e.code] = true;
      this.keys[e.code] = true;
      if (['Space', 'Tab', 'KeyE', 'KeyI', 'KeyM', 'KeyB'].includes(e.code)) e.preventDefault();
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) { this.mouse.left = true; this.mouse.leftJust = true; }
      if (e.button === 2) { this.mouse.right = true; this.mouse.rightJust = true; }
    });

    canvas.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.mouse.left = false;
      if (e.button === 2) this.mouse.right = false;
    });

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    canvas.addEventListener('wheel', (e) => {
      this.wheelDelta += e.deltaY;
      e.preventDefault();
    }, { passive: false });
  }

  isDown(code) { return !!this.keys[code]; }
  justPressed(code) { return !!this.keysJustPressed[code]; }
  isMouseDown(button) { return button === 0 ? this.mouse.left : this.mouse.right; }
  justClicked(button) { return button === 0 ? this.mouse.leftJust : this.mouse.rightJust; }

  updateWorldMouse(camera) {
    this.mouse.worldX = this.mouse.x + camera.x;
    this.mouse.worldY = this.mouse.y + camera.y;
  }

  endFrame() {
    this.keysJustPressed = {};
    this.mouse.leftJust = false;
    this.mouse.rightJust = false;
    this.wheelDelta = 0;
  }
}
