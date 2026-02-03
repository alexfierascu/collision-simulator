/**
 * Registry of 5 color themes for ball palettes.
 * Each theme has an array of ball colors and accent overrides.
 */
export const COLOR_THEMES = {
  neon: {
    name: 'Neon',
    colors: [
      { main: '#00fff2', glow: 'rgba(0, 255, 242, 0.6)' },
      { main: '#ff00aa', glow: 'rgba(255, 0, 170, 0.6)' },
      { main: '#ffea00', glow: 'rgba(255, 234, 0, 0.6)' },
      { main: '#00ff88', glow: 'rgba(0, 255, 136, 0.6)' },
      { main: '#ff6b35', glow: 'rgba(255, 107, 53, 0.6)' },
      { main: '#a855f7', glow: 'rgba(168, 85, 247, 0.6)' },
    ],
    accents: { cyan: '#00fff2', magenta: '#ff00aa', yellow: '#ffea00', green: '#00ff88' },
  },
  retro: {
    name: 'Retro',
    colors: [
      { main: '#ff6347', glow: 'rgba(255, 99, 71, 0.6)' },
      { main: '#ffa500', glow: 'rgba(255, 165, 0, 0.6)' },
      { main: '#32cd32', glow: 'rgba(50, 205, 50, 0.6)' },
      { main: '#1e90ff', glow: 'rgba(30, 144, 255, 0.6)' },
      { main: '#ff1493', glow: 'rgba(255, 20, 147, 0.6)' },
      { main: '#ffd700', glow: 'rgba(255, 215, 0, 0.6)' },
    ],
    accents: { cyan: '#1e90ff', magenta: '#ff1493', yellow: '#ffd700', green: '#32cd32' },
  },
  monochrome: {
    name: 'Mono',
    colors: [
      { main: '#ffffff', glow: 'rgba(255, 255, 255, 0.5)' },
      { main: '#cccccc', glow: 'rgba(204, 204, 204, 0.5)' },
      { main: '#999999', glow: 'rgba(153, 153, 153, 0.5)' },
      { main: '#e0e0e0', glow: 'rgba(224, 224, 224, 0.5)' },
      { main: '#b0b0b0', glow: 'rgba(176, 176, 176, 0.5)' },
      { main: '#f5f5f5', glow: 'rgba(245, 245, 245, 0.5)' },
    ],
    accents: { cyan: '#ffffff', magenta: '#cccccc', yellow: '#e0e0e0', green: '#b0b0b0' },
  },
  ocean: {
    name: 'Ocean',
    colors: [
      { main: '#00bcd4', glow: 'rgba(0, 188, 212, 0.6)' },
      { main: '#0077b6', glow: 'rgba(0, 119, 182, 0.6)' },
      { main: '#48cae4', glow: 'rgba(72, 202, 228, 0.6)' },
      { main: '#90e0ef', glow: 'rgba(144, 224, 239, 0.6)' },
      { main: '#00b4d8', glow: 'rgba(0, 180, 216, 0.6)' },
      { main: '#023e8a', glow: 'rgba(2, 62, 138, 0.6)' },
    ],
    accents: { cyan: '#48cae4', magenta: '#0077b6', yellow: '#90e0ef', green: '#00bcd4' },
  },
  sunset: {
    name: 'Sunset',
    colors: [
      { main: '#ff6b6b', glow: 'rgba(255, 107, 107, 0.6)' },
      { main: '#ee5a24', glow: 'rgba(238, 90, 36, 0.6)' },
      { main: '#f9ca24', glow: 'rgba(249, 202, 36, 0.6)' },
      { main: '#e056a0', glow: 'rgba(224, 86, 160, 0.6)' },
      { main: '#ff9f43', glow: 'rgba(255, 159, 67, 0.6)' },
      { main: '#c44569', glow: 'rgba(196, 69, 105, 0.6)' },
    ],
    accents: { cyan: '#ff9f43', magenta: '#e056a0', yellow: '#f9ca24', green: '#ff6b6b' },
  },
};

export const THEME_KEYS = Object.keys(COLOR_THEMES);
