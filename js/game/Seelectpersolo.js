// ═══════════════════════════════
// Lógica de seleção e loja - 1 JOGADOR (SOLO)
// ═══════════════════════════════

import Progresso from './progresso.js';

// Tabela de preços
const PRECOS_PERSONAGENS = {
    "larissa": 0,
    "ueslei":  15000,
    "jair":    25000,
    "eliel":   40000
};

document.addEventListener("DOMContentLoaded", () => {
    inicializar();
});

function inicializar() {

    const slots = document.querySelectorAll(".personagem-slot");
    const statusEl = document.getElementById("status-selecao");
    const btnConfirmar = document.getElementById("btn-confirmar");
    const preview = document.getElementById("preview-personagem");
    const imgP1 = document.getElementById("img-p1");
    const saldoDisplay = document.getElementById("saldo-display");
    const btnVoltar = document.getElementById("btn-voltar");

    let escolha = null; 
    let saldoAtual = Progresso.pontuacaoTotal;

    function atualizarSaldoUI() {
        saldoDisplay.textContent = saldoAtual;
    }
    atualizarSaldoUI();

    function atualizarStatus(texto) {
        statusEl.textContent = texto;
    }

    // Identifica visualmente os bloqueados
    function atualizarCadeados() {
        slots.forEach((slot) => {
            const nomeStr = slot.dataset.nome.toLowerCase();
            if (!Progresso.estaDesbloqueado(nomeStr)) {
                slot.style.filter = "grayscale(100%) brightness(50%)";
            } else {
                slot.style.filter = "none";
            }
        });
    }
    atualizarCadeados();

    // ─────────────────────────────────────────────
    // PREVIEW E LOJA NO HOVER
    // ─────────────────────────────────────────────
    slots.forEach((slot) => {

        slot.addEventListener("mouseenter", () => {
            if (escolha) return;

            const nomeStr = slot.dataset.nome.toLowerCase();
            const preco = PRECOS_PERSONAGENS[nomeStr] || 0;
            const bloqueado = !Progresso.estaDesbloqueado(nomeStr);

            preview.src = slot.dataset.preview;
            preview.style.display = "block";
            preview.style.left = "100px";
            preview.style.right = "auto";

            if (bloqueado) {
                preview.style.filter = "grayscale(100%) brightness(50%)";
                atualizarStatus(`${slot.dataset.nome} - PREÇO: ${preco} PTS (Clique p/ comprar)`);
            } else {
                preview.style.filter = "none";
                atualizarStatus(`${slot.dataset.nome} - DESBLOQUEADO (Clique p/ selecionar)`);
            }
        });

        slot.addEventListener("mouseleave", () => {
            if (escolha) return;
            preview.style.display = "none";
            preview.src = "";
            atualizarStatus("Escolha seu personagem");
        });

    });

    // ─────────────────────────────────────────────
    // CLIQUE (COMPRAR OU SELECIONAR)
    // ─────────────────────────────────────────────
    slots.forEach((slot) => {

        slot.addEventListener("click", () => {
            if (escolha) return;

            const nomePuro = slot.dataset.nome;
            const nomeStr = nomePuro.toLowerCase();
            const preco = PRECOS_PERSONAGENS[nomeStr] || 0;
            const bloqueado = !Progresso.estaDesbloqueado(nomeStr);

            if (bloqueado) {
                // Tenta comprar
                if (saldoAtual >= preco) {
                    const confirmou = confirm(`Deseja comprar ${nomePuro} por ${preco} PTS?`);
                    if (confirmou) {
                        // Desconta o valor gravando um "gasto" (gambiarra rápida: deduzimos registrando um valor negativo. Ops, registrarPartida não permite negativo)
                        // A forma correta é modificar o _dados diretamente ou criar um método.
                        // Como Progresso é um singleton, acessamos:
                        Progresso._dados.pontuacaoTotal -= preco;
                        Progresso._salvar();
                        Progresso.desbloquearPersonagem(nomeStr);
                        
                        saldoAtual = Progresso.pontuacaoTotal;
                        atualizarSaldoUI();
                        atualizarCadeados();
                        
                        atualizarStatus(`${nomePuro} COMPRADO COM SUCESSO!`);
                        preview.style.filter = "none";
                        alert(`Você desbloqueou ${nomePuro}!`);
                    }
                } else {
                    atualizarStatus(`SALDO INSUFICIENTE PARA ${nomePuro}!`);
                    alert(`Você não tem pontos suficientes. Faltam ${preco - saldoAtual} PTS.`);
                }
                return;
            }

            // Se chegou aqui, está desbloqueado e foi selecionado
            slot.classList.add("selecionado-p1");
            preview.style.display = "none";
            preview.src = "";

            imgP1.src = slot.dataset.imagem;
            imgP1.classList.remove("entrada-esquerda");
            void imgP1.offsetWidth; 
            imgP1.classList.add("entrada-esquerda");

            escolha = nomeStr; // Salva o ID minúsculo (larissa, ueslei, etc)

            slots.forEach((s) => {
                if (s !== slot) {
                    s.classList.add("desabilitado");
                }
            });

            atualizarStatus(`Pronto! Você escolheu ${nomePuro}`);
            btnConfirmar.style.display = "inline-block";
        });

    });

    btnConfirmar.addEventListener("click", () => {
        if (!escolha) return;
        sessionStorage.setItem("personagemSelecionado", escolha);
        window.location.href = "dialogo.html";
    });

    if(btnVoltar) {
        btnVoltar.addEventListener("click", () => {
            window.location.href = "../index.html";
        });
    }

    atualizarStatus("Escolha seu personagem");
}