// ═══════════════════════════════
// Lógica de seleção de personagem - 1 JOGADOR (SOLO)
//
// Regras:
// - Só existe o Jogador 1 (o jogador único).
// - Slots com a classe "bloqueado" nunca podem ser escolhidos.
// - Assim que o jogador escolhe um personagem, a escolha é
//   travada (não dá pra clicar em outro depois) e o botão
//   CONFIRMAR aparece; ao clicar, salva a escolha no
//   sessionStorage e segue para o jogo.
// ═══════════════════════════════

document.addEventListener("DOMContentLoaded", () => {

    const slots = document.querySelectorAll(".personagem-slot");
    const statusEl = document.getElementById("status-selecao");
    const btnConfirmar = document.getElementById("btn-confirmar");
    const preview = document.getElementById("preview-personagem");
    const imgP1 = document.getElementById("img-p1");

    let escolha = null; // nome do personagem escolhido pelo jogador

    // ─────────────────────────────────────────────
    // PREVIEW NO HOVER
    // ─────────────────────────────────────────────
    slots.forEach((slot) => {

        slot.addEventListener("mouseenter", () => {

            // se já escolheu um personagem, não mostra mais preview de nenhum
            if (escolha) return;

            // Atualiza a imagem do preview
            preview.src = slot.dataset.preview;
            preview.style.display = "block";

            // Modo solo: preview sempre centralizado/à esquerda
            preview.style.left = "100px";
            preview.style.right = "auto";

        });

        slot.addEventListener("mouseleave", () => {

            preview.style.display = "none";
            preview.src = "";

        });

    });

    function atualizarStatus() {

        if (!escolha) {
            statusEl.textContent = "Escolha seu personagem";
            btnConfirmar.style.display = "none";
        } else {
            statusEl.textContent = `Pronto! Você escolheu ${escolha}`;
            btnConfirmar.style.display = "inline-block";
        }

    }

    slots.forEach((slot) => {

        slot.addEventListener("click", () => {

            // Já escolheu um personagem? Ignora novos cliques (não pode trocar).
            if (escolha) return;

            const nomePersonagem = slot.dataset.nome;

            // Marca visualmente o escolhido
            slot.classList.add("selecionado-p1");

            // Esconde o preview, já que o personagem virou a imagem "cheia"
            preview.style.display = "none";
            preview.src = "";

            // ─────────────────────────────────────────────
            // DISPARA A ANIMAÇÃO DE ENTRADA (slide-in)
            // ─────────────────────────────────────────────
            imgP1.src = slot.dataset.imagem;
            // reinicia a animação caso já tenha rodado antes
            imgP1.classList.remove("entrada-esquerda");
            void imgP1.offsetWidth; // força o navegador a "resetar"
            imgP1.classList.add("entrada-esquerda");

            escolha = nomePersonagem;

            // Trava de vez os outros personagens: sem clique, sem hover,
            // sem cursor de "selecionável" — fica bem claro que não dá
            // mais pra escolher outro.
            slots.forEach((s) => {
                if (s !== slot) {
                    s.classList.add("desabilitado");
                }
            });

            atualizarStatus();

        });

    });

    btnConfirmar.addEventListener("click", () => {

        if (!escolha) return;

        // Salva a escolha para a tela/jogo seguinte ler
        sessionStorage.setItem("personagemP1", escolha);

        // Ajuste este caminho para a tela real de início do jogo solo
        window.location.href = "jogarSolo.html";

    });

    atualizarStatus();

});