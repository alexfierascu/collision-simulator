let selectedBallId = null;

export function getSelectedBallId() {
  return selectedBallId;
}

export function selectBall(id) {
  selectedBallId = id;
}

export function clearSelection() {
  selectedBallId = null;
}
