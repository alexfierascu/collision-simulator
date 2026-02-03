export class SpatialGrid {
  constructor(width, height, cellSize) {
    this.cellSize = cellSize;
    this.cols = Math.ceil(width / cellSize) + 1;
    this.rows = Math.ceil(height / cellSize) + 1;
    this.cells = new Array(this.cols * this.rows);
    this.clear();
  }

  clear() {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i] = null;
    }
  }

  _key(col, row) {
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return -1;
    return col * this.rows + row;
  }

  insert(ball) {
    const col = Math.floor(ball.x / this.cellSize);
    const row = Math.floor(ball.y / this.cellSize);
    const key = this._key(col, row);
    if (key < 0) return;
    if (!this.cells[key]) this.cells[key] = [];
    this.cells[key].push(ball);
  }

  /**
   * Calls callback(a, b) for every unique pair of balls in the same
   * or adjacent cells.  Each pair is visited exactly once.
   */
  forEachPair(callback) {
    // "Forward" neighbor offsets so each pair is seen once
    const FWD = [[1, 0], [0, 1], [1, 1], [1, -1]];

    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        const key = this._key(col, row);
        const cell = this.cells[key];
        if (!cell) continue;

        // Pairs within this cell
        for (let i = 0; i < cell.length; i++) {
          for (let j = i + 1; j < cell.length; j++) {
            callback(cell[i], cell[j]);
          }
        }

        // Pairs with forward-neighbor cells
        for (const [dc, dr] of FWD) {
          const nk = this._key(col + dc, row + dr);
          if (nk < 0) continue;
          const ncell = this.cells[nk];
          if (!ncell) continue;
          for (let i = 0; i < cell.length; i++) {
            for (let j = 0; j < ncell.length; j++) {
              callback(cell[i], ncell[j]);
            }
          }
        }
      }
    }
  }
}
