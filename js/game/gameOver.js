/**
 * GameOverScreen
 * Gerencia a exibição e ocultação da tela de Game Over no HTML.
 */
export default class GameOverScreen {
    constructor(elements) {
        this.container    = document.querySelector(elements.container);
        this.scoreDisplay = document.querySelector(elements.scoreDisplay);
        this.restartBtn   = document.querySelector(elements.restartBtn);
        this.backBtn      = document.querySelector(elements.backBtn);

        if (!this.container || !this.restartBtn) {
            console.error('GameOverScreen: elementos HTML obrigatórios não encontrados.');
        }
    }

    /** Exibe a tela de Game Over com a pontuação fornecida. */
    show(score = 0) {
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = score;
        }
        if (this.container) {
            this.container.classList.remove('hidden');
        }
    }

    /** Oculta a tela de Game Over. */
    hide() {
        if (this.container) {
            this.container.classList.add('hidden');
        }
    }

    /**
     * Registra o callback executado ao clicar em "Yes".
     * A tela é ocultada automaticamente antes de chamar o callback.
     */
    onRestart(callback) {
        if (this.restartBtn) {
            // Remove ouvintes antigos clonando o botão (evita múltiplos cliques acumulados)
            const novoBotao = this.restartBtn.cloneNode(true);
            this.restartBtn.parentNode.replaceChild(novoBotao, this.restartBtn);
            this.restartBtn = novoBotao;

            this.restartBtn.addEventListener('click', () => {
                this.hide();
                callback();
            });
        }
    }

    /**
     * Registra o callback executado ao clicar em "Menu".
     */
    onBack(callback) {
        if (this.backBtn) {
            this.backBtn.addEventListener('click', () => {
                this.hide();
                callback();
            });
        }
    }
}

/* ============================================================
   INSTÂNCIA EXPORTADA
   ============================================================ */
export const gameOverUI = new GameOverScreen({
    container:    '#game-over-screen',
    scoreDisplay: '#conter',
    restartBtn:   '#restart-btn',
    backBtn:      '#back-btn',
});

/* ============================================================
   AÇÃO PADRÃO DO BOTÃO "MENU" (NO) — volta para a tela inicial
   ============================================================ */
gameOverUI.onBack(() => {
    window.location.href = '../index.html';
});