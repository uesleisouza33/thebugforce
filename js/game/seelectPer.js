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
    const btnSolo = document.getElementById("btnSolo");
    const btnDupla = document.getElementById("btnDupla");

    let jogadorAtual = 1; // 1 ou 2
    const escolhas = { 1: null, 2: null };
    let modoJogo = 1; // 1 = Solo | 2 = Dupla

    let personagemSelecionado = null;

    // ─────────────────────────────────────────────
    // PREVIEW NO HOVER
    // ─────────────────────────────────────────────
    slots.forEach((slot) => {

        slot.addEventListener("mouseenter", () => {
    
            if (modoJogo === 2) {
    
                const jaEscolhido =
                    slot.classList.contains("selecionado-p1") ||
                    slot.classList.contains("selecionado-p2");
    
                if (jaEscolhido) {
                    preview.style.display = "none";
                    return;
                }
            }
    
    
            preview.src = slot.dataset.preview;
            preview.style.display = "block";
    
    
            if (modoJogo === 1 || jogadorAtual === 1) {
    
                preview.style.left = "100px";
                preview.style.right = "auto";
    
            } else {
    
                preview.style.left = "auto";
                preview.style.right = "100px";
    
            }
    
        });
    
    
        slot.addEventListener("mouseleave", () => {
    
            preview.style.display = "none";
    
        });
    
    });

    btnSolo.addEventListener("click", () => {

        modoJogo = 1;

        btnSolo.classList.add("ativo");
        btnDupla.classList.remove("ativo");

        jogadorAtual = 1;
        escolhas[1] = null;
        escolhas[2] = null;

        // Limpa a seleção visual
        slots.forEach(slot => {
            slot.classList.remove("selecionado-p1");
            slot.classList.remove("selecionado-p2");
        });

        // Limpa as imagens dos jogadores
        imgP1.src = "";
        imgP2.src = "";

        // Esconde o botão novamente
        btnConfirmar.style.display = "none";

        resetarSelecao();

        atualizarStatus();

    });

    btnDupla.addEventListener("click", () => {

        modoJogo = 2;

        btnDupla.classList.add("ativo");
        btnSolo.classList.remove("ativo");

        jogadorAtual = 1;
        escolhas[1] = null;
        escolhas[2] = null;

        // Limpa a seleção visual
        slots.forEach(slot => {
            slot.classList.remove("selecionado-p1");
            slot.classList.remove("selecionado-p2");
        });

        // Limpa as imagens dos jogadores
        imgP1.src = "";
        imgP2.src = "";

        // Esconde o botão novamente
        btnConfirmar.style.display = "none";

        resetarSelecao();

        atualizarStatus();

    });

    function resetarSelecao() {

        jogadorAtual = 1;
    
        escolhas[1] = null;
        escolhas[2] = null;
    
    
        slots.forEach(slot => {
            slot.classList.remove("selecionado-p1");
            slot.classList.remove("selecionado-p2");
        });
    
    
        imgP1.src = "";
        imgP2.src = "";
    
        imgP1.style.display = "none";
        imgP2.style.display = "none";
    
    
        btnConfirmar.style.display = "none";
    
    }

    function atualizarStatus() {

        if (modoJogo === 1) {

            if (escolhas[1] == null) {

                statusEl.textContent = "Escolha seu personagem";

            } else {

                statusEl.textContent = `Personagem: ${escolhas[1]}`;
                btnConfirmar.style.display = "inline-block";

            }

            return;
        }

        // ---------- DUPLA ----------

        if (jogadorAtual === 1) {

            statusEl.textContent = "Jogador 1, escolha seu personagem";
        
        } else if (jogadorAtual === 2) {
        
            statusEl.textContent = "Jogador 2, escolha seu personagem";
        
        } else if (jogadorAtual === 3) {
        
            statusEl.textContent =
                `Prontos! ${escolhas[1]} e ${escolhas[2]}`;
        
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

            if (jaEscolhido) {
                preview.style.display = "none";
                return;
            }
            const nomePersonagem = slot.dataset.nome;

            if (modoJogo === 1) {

                slots.forEach(s => {
                    s.classList.remove("selecionado-p1");
                });
            
            }

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

            if (modoJogo === 1) {

                btnConfirmar.style.display = "inline-block";

            } else {

                jogadorAtual++;

            }

            atualizarStatus();

        });

    });

    btnConfirmar.addEventListener("click", () => {

        sessionStorage.setItem("modoJogo", modoJogo);

        sessionStorage.setItem("personagemP1", escolhas[1]);

        if (modoJogo === 2) {
            sessionStorage.setItem("personagemP2", escolhas[2]);
        }

        window.location.href = "jogarSolo.html";

    });

    atualizarStatus();

});