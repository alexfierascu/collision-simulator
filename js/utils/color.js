export function hslToColor(h) {
  return {
    main: `hsl(${h}, 100%, 60%)`,
    glow: `hsla(${h}, 100%, 60%, 0.6)`,
  };
}
