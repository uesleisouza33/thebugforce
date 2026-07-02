/**
 * GameOverScreen
 * Gerencia a exibição e ocultação da tela de Game Over no HTML.
 *
 * @param {Object} elements - Seletores CSS dos elementos da tela.
 * @param {string} elements.container    - Seletor do overlay principal.
 * @param {string} elements.scoreDisplay - Seletor do <span> de pontuação.
 * @param {string} elements.restartBtn   - Seletor do botão "Yes".
 * @param {string} elements.backBtn      - Seletor do botão "Menu".
 */
class GameOverScreen {
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
        this.container.classList.remove('hidden');
    }

    /** Oculta a tela de Game Over. */
    hide() {
        this.container.classList.add('hidden');
    }

    /**
     * Registra o callback executado ao clicar em "Yes".
     * A tela é ocultada automaticamente antes de chamar o callback.
     *
     * @param {Function} callback
     */
    onRestart(callback) {
        if (this.restartBtn) {
            this.restartBtn.addEventListener('click', () => {
                this.hide();
                callback();
            });
        }
    }

    /**
     * Registra o callback executado ao clicar em "Menu".
     * A tela é ocultada automaticamente antes de chamar o callback.
     *
     * @param {Function} callback
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
   INSTÂNCIA
   ============================================================ */

const gameOverUI = new GameOverScreen({
    container:    '#game-over-screen',
    scoreDisplay: '#conter',
    restartBtn:   '#restart-btn',
    backBtn:      '#back-btn',
});

/* ============================================================
   AÇÃO DO BOTÃO "YES" — reinicia o jogo
   ============================================================ */

gameOverUI.onRestart(() => {
    if (typeof gameOver !== 'undefined' && typeof gameOver.limpa_cena === 'function') {
        gameOver.limpa_cena();
    }
    if (typeof mudaCena === 'function' && typeof menu !== 'undefined') {
        mudaCena(menu);
    }
});

// /* ============================================================
//    AÇÃO DO BOTÃO "MENU" — volta para a tela inicial
//    ============================================================ */

// gameOverUI.onBack(() => {
//     window.location.href = '../index.html';
// });

// /* ============================================================
//    BOTÃO DE TESTE — exibe a tela de Game Over manualmente
//    ============================================================ */
// const testBtn = document.querySelector('#test-game-over-btn');
// if (testBtn) {
//     testBtn.addEventListener('click', () => {
//         gameOverUI.show(1234); // pontuação de exemplo
//     });
// } else {
//     console.error('Botão de teste não encontrado no HTML.');
// }