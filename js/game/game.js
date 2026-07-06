import SPRITES from "./sprites.js";

import PlayerSpawner from "./playerspawn.js";
import EnemySpawner from "./enemyspawn.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

// =====================
// Background
// =====================

const fundoFase1 = new Image();
fundoFase1.src = "../assets/game/backgrounds/fase1.webp";

// =====================
// Carrega todos os sprites
// =====================

Object.values(SPRITES).forEach(sprite => {
    sprite.image = new Image();
    sprite.image.src = sprite.src;
});

// =====================
// Objetos
// =====================

let jogador;
let playerSpawner;
let enemySpawner;

let estadoJogo = "jogando"; // "jogando" | "gameover"
let pontuacao = 0;
let tempoSobrevivido = 0;

const teclas = {};

// =====================
// Input
// =====================

window.addEventListener("keydown", (e) => {

    teclas[e.key.toLowerCase()] = true;

    if (e.key.toLowerCase() === "h" && jogador) {
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

    playerSpawner = new PlayerSpawner(
        SPRITES.larissa
    );

    jogador = playerSpawner.spawn();

    enemySpawner = new EnemySpawner(

        [
            SPRITES.profEdu
            // SPRITES.larissa
        ],

        canvas

    );

    enemySpawner.spawn(1100);

    requestAnimationFrame(loop);

}

// =====================
// Fim de jogo
// =====================

function finalizarJogo() {

    estadoJogo = "gameover";

    // Salva a pontuação para a tela de Game Over ler
    sessionStorage.setItem("pontuacaoFinal", pontuacao);

    window.location.href = "gameOver.html";

}

// =====================
// Update
// =====================

function atualizar(deltaTime) {

    jogador.mover(teclas);

    jogador.update(deltaTime);

    enemySpawner.update(deltaTime);


    const inimigo = enemySpawner.verificarColisao(jogador);

    if (inimigo) {

        jogador.receberDano(10);

    }

    // Pontuação: 1 ponto por segundo sobrevivido.
    // Ajuste essa conta se preferir pontuar de outra forma
    // (ex: por inimigo desviado).
    tempoSobrevivido += deltaTime;
    pontuacao = Math.floor(tempoSobrevivido / 1000);

    if (jogador.morto && estadoJogo === "jogando") {

        finalizarJogo();

    }

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

    enemySpawner.draw(ctx);

    ctx.fillStyle = "#222";
    ctx.fillRect(20, 20, 200, 20);

    ctx.fillStyle = "#00ff00";
    ctx.fillRect(
        20,
        20,
        (jogador.vida / jogador.vidaMaxima) * 200,
        20
    );

    ctx.strokeStyle = "#fff";
    ctx.strokeRect(20, 20, 200, 20);

    ctx.fillStyle = "#fff";
    ctx.font = "16px sans-serif";
    ctx.fillText("Pontos: " + pontuacao, 20, 62);

}

// =====================
// Loop
// =====================

let ultimoTempo = 0;

function loop(tempoAtual) {

    const deltaTime = tempoAtual - ultimoTempo;

    ultimoTempo = tempoAtual;

    if (estadoJogo === "jogando") {

        atualizar(deltaTime);

        desenhar();

    }

    requestAnimationFrame(loop);

}

// =====================
// Carregamento
// =====================

Promise.all([

    new Promise(resolve => {
        fundoFase1.onload = resolve;
    }),

    ...Object.values(SPRITES).map(sprite =>

        new Promise(resolve => {

            sprite.image.onload = resolve;

        })

    )

]).then(iniciar);