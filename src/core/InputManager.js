// ============================================
// Input Manager — Keyboard & Mouse State
// ============================================

export class InputManager {
  constructor() {
    this.keys = {};
    this.mouse = { dx: 0, dy: 0, locked: false };
    this._mouseMoveAccum = { dx: 0, dy: 0 };
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onPointerLockChange = this._onPointerLockChange.bind(this);

    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('pointerlockchange', this._onPointerLockChange);
  }

  _onKeyDown(e) {
    this.keys[e.code] = true;
  }

  _onKeyUp(e) {
    this.keys[e.code] = false;
  }

  _onMouseMove(e) {
    if (this.mouse.locked) {
      this._mouseMoveAccum.dx += e.movementX || 0;
      this._mouseMoveAccum.dy += e.movementY || 0;
    }
  }



  _onPointerLockChange() {
    this.mouse.locked = document.pointerLockElement === document.body;
  }

  update() {
    this.mouse.dx = this._mouseMoveAccum.dx;
    this.mouse.dy = this._mouseMoveAccum.dy;
    this._mouseMoveAccum.dx = 0;
    this._mouseMoveAccum.dy = 0;
  }

  isKey(code) {
    return !!this.keys[code];
  }

  isKeyOnce(code) {
    if (this.keys[code]) {
      this.keys[code] = false;
      return true;
    }
    return false;
  }

  lockPointer() {
    document.body.requestPointerLock();
  }

  dispose() {
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup', this._onKeyUp);
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('pointerlockchange', this._onPointerLockChange);
  }
}
