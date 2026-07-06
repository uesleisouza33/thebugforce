/**
 * Tela de Game Over (html/gameOver.html)
 *
 * Esta página é aberta pelo game.js (window.location.href) quando
 * o jogador morre. A pontuação final é lida do sessionStorage,
 * onde o game.js a salvou antes de navegar para cá.
 */
class GameOverScreen {

    constructor(elements) {
        this.scoreDisplay = document.querySelector(elements.scoreDisplay);
        this.restartBtn   = document.querySelector(elements.restartBtn);
        this.backBtn      = document.querySelector(elements.backBtn);
    }

    /** Exibe a pontuação recebida. */
    mostrarPontuacao(score) {
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = score;
        }
    }

    /** Registra o callback do botão "Yes". */
    onRestart(callback) {
        if (this.restartBtn) {
            this.restartBtn.addEventListener("click", callback);
        }
    }

    /** Registra o callback do botão "No". */
    onBack(callback) {
        if (this.backBtn) {
            this.backBtn.addEventListener("click", callback);
        }
    }
}

/* ============================================================
   PÁGINA
   ============================================================ */

const gameOverUI = new GameOverScreen({
    scoreDisplay: "#conter",
    restartBtn: "#restart-btn",
    backBtn: "#back-btn"
});

const pontuacaoFinal = parseInt(sessionStorage.getItem("pontuacaoFinal"), 10) || 0;

gameOverUI.mostrarPontuacao(pontuacaoFinal);

gameOverUI.onRestart(() => {
    window.location.href = "jogarSolo.html";
});

gameOverUI.onBack(() => {
    window.location.href = "../index.html";
});