import { SPAWN_FADE_DURATION } from '../config/constants.js';
import { CONFIG } from '../config/config.js';
import { hslToColor } from '../utils/color.js';
import { distance } from '../utils/math.js';
import { boundaryStrategies } from '../physics/boundaryStrategies.js';
import { getActiveColors } from '../state/ThemeState.js';
import { getTimeScale } from '../state/TimeState.js';

export class Ball {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = CONFIG.ballRadius;
    const colors = getActiveColors();
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.id = Math.random().toString(36).substr(2, 9);
    this.hue = Math.random() * 360;
    this.createdAt = Date.now();
    this.collisionCount = 0;
  }

  getSpawnOpacity() {
    const age = Date.now() - this.createdAt;
    return age >= SPAWN_FADE_DURATION ? 1 : age / SPAWN_FADE_DURATION;
  }

  changeColor(rainbowMode) {
    if (rainbowMode) {
      this.hue = (this.hue + 30) % 360;
      this.color = hslToColor(this.hue);
    } else {
      const colors = getActiveColors();
      let newColor;
      do {
        newColor = colors[Math.floor(Math.random() * colors.length)];
      } while (newColor.main === this.color.main && colors.length > 1);
      this.color = newColor;
    }
  }

  getSpeed() {
    return distance(this.vx, this.vy);
  }

  update(centerX, centerY, boundaryRadius, rainbowMode) {
    if (rainbowMode) {
      this.hue = (this.hue + 1) % 360;
      this.color = hslToColor(this.hue);
    }

    const ts = getTimeScale();
    this.x += this.vx * ts;
    this.y += this.vy * ts;

    const strategy = boundaryStrategies[CONFIG.boundaryShape];
    if (strategy) strategy.bounce(this, centerX, centerY, boundaryRadius);

    this._clampSpeed();
    return this.getSpeed();
  }

  _clampSpeed() {
    const speed = this.getSpeed();
    if (speed > CONFIG.maxSpeed) {
      this.vx = (this.vx / speed) * CONFIG.maxSpeed;
      this.vy = (this.vy / speed) * CONFIG.maxSpeed;
    }
    if (speed < CONFIG.minSpeed && speed > 0) {
      this.vx = (this.vx / speed) * CONFIG.minSpeed;
      this.vy = (this.vy / speed) * CONFIG.minSpeed;
    }
  }
}
