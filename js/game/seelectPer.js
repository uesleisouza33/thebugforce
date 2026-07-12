// ═══════════════════════════════
// Lógica de seleção de personagem - 2 JOGADORES
//
// Regras:
// - Jogador 1 clica primeiro, depois Jogador 2.
// - Slots com a classe "bloqueado" nunca podem ser escolhidos.
// - Um personagem já escolhido por um jogador não pode ser
//   escolhido pelo outro (evita os dois pegarem o mesmo).
// - Quando os 2 já escolheram, o botão CONFIRMAR aparece e,
//   ao clicar, salva a escolha no sessionStorage e segue para o jogo.
// ═══════════════════════════════

document.addEventListener("DOMContentLoaded", () => {

    const slots = document.querySelectorAll(".personagem-slot");
    const statusEl = document.getElementById("status-selecao");
    const btnConfirmar = document.getElementById("btn-confirmar");
    const preview = document.getElementById("preview-personagem");
    const imgP1 = document.getElementById("img-p1");
    const imgP2 = document.getElementById("img-p2");

    let jogadorAtual = 1; // 1 ou 2
    const escolhas = { 1: null, 2: null };

    // ─────────────────────────────────────────────
    // PREVIEW NO HOVER
    // ─────────────────────────────────────────────
    slots.forEach((slot) => {

        slot.addEventListener("mouseenter", () => {

            // se o personagem já foi escolhido, não mostra mais preview dele
            const jaEscolhido =
                slot.classList.contains("selecionado-p1") ||
                slot.classList.contains("selecionado-p2");

            if (jaEscolhido || jogadorAtual > 2) return;

            // Atualiza a imagem do preview
            preview.src = slot.dataset.preview;
            preview.style.display = "block";

            // Lógica para alternar o lado do preview dependendo do jogador
            if (jogadorAtual === 1) {
                // Preview do P1 na esquerda
                preview.style.left = "100px";
                preview.style.right = "auto";
            } else if (jogadorAtual === 2) {
                // Preview do P2 na direita
                preview.style.left = "auto";
                preview.style.right = "100px"; // Ajuste este valor se precisar afastar da borda direita
            }

        });

        slot.addEventListener("mouseleave", () => {

            preview.style.display = "none";
            preview.src = "";

        });

    });

    function atualizarStatus() {

        if (jogadorAtual === 1) {
            statusEl.textContent = "Jogador 1, escolha seu personagem";
        } else if (jogadorAtual === 2) {
            statusEl.textContent = "Jogador 2, escolha seu personagem";
        } else {
            statusEl.textContent =
                `Prontos! ${escolhas[1]} (Jogador 1) e ${escolhas[2]} (Jogador 2)`;
            btnConfirmar.style.display = "inline-block";
        }

    }

    slots.forEach((slot) => {

        slot.addEventListener("click", () => {

            // Já escolheram os 2? Ignora novos cliques.
            if (jogadorAtual > 2) return;

            // Personagem já escolhido pelo outro jogador não pode ser
            // escolhido de novo.
            const jaEscolhido =
                slot.classList.contains("selecionado-p1") ||
                slot.classList.contains("selecionado-p2");

            if (jaEscolhido) return;

            const nomePersonagem = slot.dataset.nome;

            // Marca visualmente com a cor do jogador da vez
            slot.classList.add(
                jogadorAtual === 1 ? "selecionado-p1" : "selecionado-p2"
            );

            // Esconde o preview, já que o personagem virou a imagem "cheia"
            preview.style.display = "none";
            preview.src = "";

            // ─────────────────────────────────────────────
            // DISPARA A ANIMAÇÃO DE ENTRADA (slide-in)
            // ─────────────────────────────────────────────
            if (jogadorAtual === 1) {

                imgP1.src = slot.dataset.imagem;
                // reinicia a animação caso já tenha rodado antes
                imgP1.classList.remove("entrada-esquerda");
                void imgP1.offsetWidth; // força o navegador a "resetar"
                imgP1.classList.add("entrada-esquerda");

            } else {

                imgP2.src = slot.dataset.imagem;
                imgP2.classList.remove("entrada-direita");
                void imgP2.offsetWidth;
                imgP2.classList.add("entrada-direita");

            }

            escolhas[jogadorAtual] = nomePersonagem;

            jogadorAtual++;

            atualizarStatus();

        });

    });

    btnConfirmar.addEventListener("click", () => {

        // Salva as escolhas para a tela/jogo seguinte ler
        sessionStorage.setItem("personagemP1", escolhas[1]);
        sessionStorage.setItem("personagemP2", escolhas[2]);

        // Ajuste este caminho para a tela real de início do jogo
        window.location.href = "jogarSolo.html";

    });

    atualizarStatus();

});