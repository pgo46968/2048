// ==========================================
// MANAGER (Controlador / Ligação UI)
// ==========================================
class GameManager {
  constructor(model) {
    this.model = model;
    this.boardElement = document.getElementById("game-board");
    this.scoreElement = document.getElementById("score");

    this.setupBoard();
    this.setupInput();
    this.render();
  }

  setupBoard() {
    for (let i = 0; i < this.model.size * this.model.size; i++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      this.boardElement.appendChild(cell);
    }
  }

  setupInput() {
    // Controlos de Teclado (PC)
    window.addEventListener("keydown", (e) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1
      ) {
        e.preventDefault();
      }
      this.handleMove(e.code);
    });

    // Controlos de Toque / Swipe (Telemóvel)
    let touchStartX = 0;
    let touchStartY = 0;

    window.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      },
      { passive: false },
    );

    window.addEventListener(
      "touchend",
      (e) => {
        let touchEndX = e.changedTouches[0].screenX;
        let touchEndY = e.changedTouches[0].screenY;

        this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
      },
      { passive: false },
    );

    // Prevenir scroll ao arrastar na grelha
    this.boardElement.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
      },
      { passive: false },
    );
  }

  // Lógica para detetar a direção do swipe
  handleSwipe(startX, startY, endX, endY) {
    let deltaX = endX - startX;
    let deltaY = endY - startY;

    // Exige um movimento mínimo para não detetar toques acidentais
    if (Math.abs(deltaX) < 30 && Math.abs(deltaY) < 30) return;

    let direction = "";

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Movimento Horizontal
      direction = deltaX > 0 ? "ArrowRight" : "ArrowLeft";
    } else {
      // Movimento Vertical
      direction = deltaY > 0 ? "ArrowDown" : "ArrowUp";
    }

    this.handleMove(direction);
  }

  // Função auxiliar para processar qualquer movimento (Teclado ou Swipe)
  handleMove(direction) {
    if (this.model.move(direction)) {
      this.render();
      if (this.model.gameOver) {
        setTimeout(
          () => alert(`Game Over! Score Final: ${this.model.score}`),
          100,
        );
      }
    }
  }

  getTileStyle(value) {
    const colors = {
      2: { bg: "#eee4da", color: "#776e65" },
      4: { bg: "#ede0c8", color: "#776e65" },
      8: { bg: "#f2b179", color: "#f9f6f2" },
      16: { bg: "#f59563", color: "#f9f6f2" },
      32: { bg: "#f67c5f", color: "#f9f6f2" },
      64: { bg: "#f65e3b", color: "#f9f6f2" },
      128: { bg: "#edcf72", color: "#f9f6f2" },
      256: { bg: "#edcc61", color: "#f9f6f2" },
      512: { bg: "#edc850", color: "#f9f6f2" },
      1024: { bg: "#edc53f", color: "#f9f6f2" },
      2048: { bg: "#edc22e", color: "#f9f6f2" },
    };
    return colors[value] || { bg: "#3c3a32", color: "#f9f6f2" };
  }

  render() {
    const cells = this.boardElement.children;
    let index = 0;

    // Atualizar Grid
    for (let r = 0; r < this.model.size; r++) {
      for (let c = 0; c < this.model.size; c++) {
        let val = this.model.grid[r][c];
        let cell = cells[index];

        if (val > 0) {
          cell.textContent = val;
          let style = this.getTileStyle(val);
          cell.style.backgroundColor = style.bg;
          cell.style.color = style.color;
          cell.style.fontSize = val > 1000 ? "20px" : "30px";
        } else {
          cell.textContent = "";
          cell.style.backgroundColor = "rgba(238, 228, 218, 0.35)";
        }
        index++;
      }
    }

    // Atualizar Score
    this.scoreElement.textContent = this.model.score;
  }
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================
window.onload = () => {
  // Como o model.js é carregado primeiro no HTML,
  // a classe GameModel já está disponível aqui.
  const gameModel = new GameModel();
  const gameManager = new GameManager(gameModel);
};
