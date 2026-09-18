// ==========================================
// MODEL (Lógica de Jogo, Estado e Score)
// ==========================================
class GameModel {
  constructor() {
    this.size = 4;
    this.grid = Array(this.size)
      .fill()
      .map(() => Array(this.size).fill(0));
    this.score = 0;
    this.gameOver = false;

    // Iniciar com 2 blocos
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    let emptyCells = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length > 0) {
      let randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.grid[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  // Move e funde os blocos de uma linha para a esquerda
  slideAndCombine(row) {
    let filtered = row.filter((val) => val !== 0); // Remove zeros
    let scoreIncrease = 0;

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] !== 0 && filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        scoreIncrease += filtered[i];
        filtered.splice(i + 1, 1);
      }
    }

    while (filtered.length < this.size) {
      filtered.push(0); // Preenche o resto com zeros
    }
    return { newRow: filtered, scoreIncrease };
  }

  // Roda a matriz 90 graus à direita (simplifica a lógica de movimento)
  rotateRight(matrix) {
    let result = Array(this.size)
      .fill()
      .map(() => Array(this.size).fill(0));
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        result[c][this.size - 1 - r] = matrix[r][c];
      }
    }
    return result;
  }

  move(direction) {
    if (this.gameOver) return false;

    let moved = false;
    let newGrid = JSON.parse(JSON.stringify(this.grid)); // Clone

    // Mapear direções para rotações necessárias para que o movimento seja sempre "Esquerda"
    const rotations = { ArrowLeft: 0, ArrowDown: 1, ArrowRight: 2, ArrowUp: 3 };
    let numRotations = rotations[direction];

    if (numRotations === undefined) return false; // Tecla inválida

    // Rodar
    for (let i = 0; i < numRotations; i++) newGrid = this.rotateRight(newGrid);

    // Deslizar e combinar (sempre para a esquerda após rotação)
    for (let r = 0; r < this.size; r++) {
      let { newRow, scoreIncrease } = this.slideAndCombine(newGrid[r]);
      if (newGrid[r].toString() !== newRow.toString()) moved = true;
      newGrid[r] = newRow;
      this.score += scoreIncrease;
    }

    // Desfazer rotação
    let unrotations = (4 - numRotations) % 4;
    for (let i = 0; i < unrotations; i++) newGrid = this.rotateRight(newGrid);

    if (moved) {
      this.grid = newGrid;
      this.addRandomTile();
      this.checkGameOver();
    }

    return moved;
  }

  checkGameOver() {
    // Se houver espaço vazio, não é game over
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === 0) return;
      }
    }
    // Verificar se há blocos adjacentes iguais
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        let current = this.grid[r][c];
        if (
          (r < this.size - 1 && this.grid[r + 1][c] === current) ||
          (c < this.size - 1 && this.grid[r][c + 1] === current)
        ) {
          return;
        }
      }
    }
    this.gameOver = true;
  }
}
