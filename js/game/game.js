import Jogador from "./jogador.js";
import Inimigo from "./inimigo.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const fundoFase1 = new Image();
fundoFase1.src = "../assets/game/backgrounds/fase1.webp";

ctx.imageSmoothingEnabled = false;

// =====================
// Sprites
// =====================

const spriteJogador = new Image();
spriteJogador.src = "../assets/game/personagens/larissa.png";

const spriteInimigo = new Image();
// spriteInimigo.src = "../assets/game/inimigos/prof_edu/prof_edu_walk.png";
spriteInimigo.src = "../assets/game/inimigos/prof_edu/teste.png";

// =====================
// Objetos
// =====================

let jogador;
let inimigo;

const teclas = {};

// =====================
// Input
// =====================

window.addEventListener("keydown", (e) => {
    teclas[e.key.toLowerCase()] = true;

    if (e.key === "h") {
        jogador.receberDano();
    }
});

window.addEventListener("keyup", (e) => {
    teclas[e.key.toLowerCase()] = false;
});

// =====================
// Inicialização
// =====================

function iniciar() {

    jogador = new Jogador(spriteJogador);

    inimigo = new Inimigo(
        canvas.width - 150,
        canvas.height,
        spriteInimigo
    );

    requestAnimationFrame(loop);
}

// =====================
// Update
// =====================

function atualizar(deltaTime) {

    jogador.mover(teclas);

    jogador.update(deltaTime);

    inimigo.update(deltaTime);

}

// =====================
// Draw
// =====================

function desenhar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.drawImage(
        fundoFase1,
        0,
        0,
        canvas.width,
        canvas.height
    );

    jogador.draw(ctx);

    inimigo.draw(ctx);
}

    // =====================
    // Loop
    // =====================

    let ultimoTempo = 0;

    function loop(tempoAtual) {

        const deltaTime =
            tempoAtual - ultimoTempo;

        ultimoTempo = tempoAtual;

        atualizar(deltaTime);

        desenhar();

        requestAnimationFrame(loop);
    }

    // =====================
    // Carregamento
    // =====================

    Promise.all([
        new Promise(resolve => {
            spriteJogador.onload = resolve;
        }),
        new Promise(resolve => {
            spriteInimigo.onload = resolve;
        }),
        new Promise(resolve => {
            fundoFase1.onload = resolve;
        })
    ]).then(iniciar);