/**
 * gameOver.js
 *
 * Controla a tela de Game Over (html/gameOver.html).
 * Lê pontuação final e melhor pontuação do sessionStorage.
 */
class GameOverScreen {

    constructor(elements) {
        this.scoreDisplay = document.querySelector(elements.scoreDisplay);
        this.melhorDisplay = document.querySelector(elements.melhorDisplay);
        this.restartBtn    = document.querySelector(elements.restartBtn);
        this.backBtn       = document.querySelector(elements.backBtn);
    }

    mostrarPontuacao(score) {
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = score;
        }
    }

    mostrarMelhor(score) {
        if (this.melhorDisplay) {
            this.melhorDisplay.textContent = score;
        }
    }

    onRestart(callback) {
        if (this.restartBtn) {
            this.restartBtn.addEventListener("click", callback);
        }
    }

    onBack(callback) {
        if (this.backBtn) {
            this.backBtn.addEventListener("click", callback);
        }
    }

}

const gameOverUI = new GameOverScreen({
    scoreDisplay:  "#conter",
    melhorDisplay: "#melhor-conter",
    restartBtn:    "#restart-btn",
    backBtn:       "#back-btn"
});

const pontuacaoFinal  = parseInt(sessionStorage.getItem("pontuacaoFinal"),  10) || 0;
const melhorPontuacao = parseInt(sessionStorage.getItem("melhorPontuacao"), 10) || 0;

gameOverUI.mostrarPontuacao(pontuacaoFinal);
gameOverUI.mostrarMelhor(melhorPontuacao);

gameOverUI.onRestart(() => {
    window.location.href = "jogarSolo.html";
});

gameOverUI.onBack(() => {
    window.location.href = "../index.html";
});