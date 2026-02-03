import { GRAPH_DURATION } from '../config/constants.js';
import { $ } from '../ui/dom.js';
import { state } from '../state/SimulationState.js';
import { getGraphBg, getGraphGrid } from '../state/ThemeState.js';

export function initGraph() {
  const graphCanvas = $('graphCanvas');
  state.graphCtx = graphCanvas.getContext('2d');
  state.collisionHistory = [];
  state.graphStartIndex = 0;
}

function buildGraphPath(graphCtx, history, startIdx, now, width, height, maxCount) {
  graphCtx.beginPath();
  let first = true;
  for (let i = startIdx; i < history.length; i++) {
    const h = history[i];
    const x = ((h.time - (now - GRAPH_DURATION)) / GRAPH_DURATION) * width;
    const y = height - (h.count / maxCount) * (height - 10) - 5;
    if (first) {
      graphCtx.moveTo(x, y);
      first = false;
    } else {
      graphCtx.lineTo(x, y);
    }
  }
}

export function updateGraph() {
  const { graphCtx, collisionHistory, collisionTimestamps } = state;
  if (!graphCtx) return;

  const now = Date.now();
  const graphCanvas = $('graphCanvas');
  const width = graphCanvas.width;
  const height = graphCanvas.height;

  const currentRate = collisionTimestamps.filter(t => now - t < 1000).length;
  collisionHistory.push({ time: now, count: currentRate });

  // Advance start index past stale entries (O(1) amortised)
  while (
    state.graphStartIndex < collisionHistory.length &&
    now - collisionHistory[state.graphStartIndex].time >= GRAPH_DURATION
  ) {
    state.graphStartIndex++;
  }

  // Compact when start index drifts too far
  if (state.graphStartIndex > 500) {
    state.collisionHistory = state.collisionHistory.slice(state.graphStartIndex);
    state.graphStartIndex = 0;
  }

  const si = state.graphStartIndex;

  // Clear
  graphCtx.fillStyle = getGraphBg();
  graphCtx.fillRect(0, 0, width, height);

  // Grid
  graphCtx.strokeStyle = getGraphGrid();
  graphCtx.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    const y = (height / 4) * i;
    graphCtx.beginPath();
    graphCtx.moveTo(0, y);
    graphCtx.lineTo(width, y);
    graphCtx.stroke();
  }

  const hist = state.collisionHistory;
  if (hist.length - si < 2) return;

  let maxCount = 10;
  for (let i = si; i < hist.length; i++) {
    if (hist[i].count > maxCount) maxCount = hist[i].count;
  }

  // Glow pass
  graphCtx.strokeStyle = 'rgba(255, 0, 170, 0.3)';
  graphCtx.lineWidth = 6;
  buildGraphPath(graphCtx, hist, si, now, width, height, maxCount);
  graphCtx.stroke();

  // Line pass
  graphCtx.strokeStyle = '#ff00aa';
  graphCtx.lineWidth = 2;
  buildGraphPath(graphCtx, hist, si, now, width, height, maxCount);
  graphCtx.stroke();
}
