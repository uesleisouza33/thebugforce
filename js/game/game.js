import SPRITES from "./sprites.js";
import CHARACTERS from "./characters.js";
import ENEMIES from "./enemies.js";

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

const teclas = {};

// =====================
// Input
// =====================

window.addEventListener("keydown", (e) => {

    teclas[e.key.toLowerCase()] = true;

    // Teste de dano (tecla H)
    if (e.key.toLowerCase() === "h" && jogador) {
        jogador.receberDano(10);
    }

    // Ataque primário (Espaço)
    if (e.code === "Space" && jogador) {
        e.preventDefault();
        jogador.atacar();
    }

    // Habilidade especial (Q)
    if (e.key.toLowerCase() === "q" && jogador) {
        jogador.usarHabilidade();
    }

    // Evita scroll com setas
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
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
        SPRITES.larissa,
        CHARACTERS.larissa
    );

    jogador = playerSpawner.spawn();

    enemySpawner = new EnemySpawner(

        [
            {
                spriteConfig: SPRITES.profEdu,
                enemyConfig: ENEMIES.profEdu
            },
            {
                spriteConfig: SPRITES.profWendel,
                enemyConfig: ENEMIES.profWendel
            }
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

    sessionStorage.setItem("pontuacaoFinal", pontuacao);

    window.location.href = "gameOver.html";

}

// =====================
// Coleta de drops
// =====================

function verificarColetaDrops() {

    for (const inimigo of enemySpawner.inimigos) {

        if (!inimigo.drop || !inimigo.drop.ativo)
            continue;

        const drop = inimigo.drop;

        const colidiu =
            jogador.x < drop.x + drop.largura &&
            jogador.x + jogador.largura > drop.x &&
            jogador.y < drop.y + drop.altura &&
            jogador.y + jogador.altura > drop.y;

        if (colidiu) {

            jogador.curar(drop.cura);
            drop.ativo = false;

        }

    }

}

// =====================
// Update
// =====================

function atualizar(deltaTime) {

    jogador.mover(teclas);

    jogador.update(deltaTime);

    pontuacao += enemySpawner.update(deltaTime, jogador);

    pontuacao += jogador.verificarAtaques(enemySpawner.inimigos);

    verificarColetaDrops();

    const inimigo = enemySpawner.verificarColisao(jogador);

    if (inimigo) {

        pontuacao += inimigo.atacar(jogador);

    }

    if (pontuacao < 0) {

        pontuacao = 0;

    }

    if (jogador.morto && estadoJogo === "jogando") {

        finalizarJogo();

    }

}

// =====================
// HUD
// =====================

function desenharHUD() {

    // --- Barra de vida ---
    ctx.fillStyle = "#111";
    ctx.fillRect(18, 18, 204, 22);

    ctx.fillStyle = "#ff3333";

    const vidaPct = jogador.vida / jogador.vidaMaxima;

    if (vidaPct > 0.5) {
        ctx.fillStyle = "#33cc33";
    } else if (vidaPct > 0.25) {
        ctx.fillStyle = "#ffaa00";
    } else {
        ctx.fillStyle = "#ff3333";
    }

    ctx.fillRect(20, 20, vidaPct * 200, 18);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.strokeRect(18, 18, 204, 22);

    // Vida numérica
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
        jogador.vida + " / " + jogador.vidaMaxima,
        120,
        29
    );

    // --- Nome do personagem ---
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(
        jogador.characterConfig.nome || "JOGADOR",
        20,
        58
    );

    // --- Habilidade especial ---
    const agora = Date.now();
    const cooldownTotal = jogador.characterConfig.habilidadeEspecial.cooldown;
    const tempoDesde = agora - jogador.specialAttack.ultimoAtaque;
    const emRecarga = tempoDesde < cooldownTotal;

    const labelQ = "Q";
    const larguraBarraQ = 100;

    ctx.fillStyle = "#111";
    ctx.fillRect(20, 65, larguraBarraQ, 10);

    if (emRecarga) {

        const progresso = tempoDesde / cooldownTotal;

        ctx.fillStyle = "#6644ff";
        ctx.fillRect(20, 65, progresso * larguraBarraQ, 10);

        ctx.fillStyle = "#aaa";

    } else {

        ctx.fillStyle = "#6644ff";
        ctx.fillRect(20, 65, larguraBarraQ, 10);

        ctx.fillStyle = "#fff";

    }

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 65, larguraBarraQ, 10);

    ctx.font = "bold 10px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("[Q] Habilidade", 126, 74);

    // --- Pontuação ---
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "right";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(
        "PONTOS: " + pontuacao,
        canvas.width - 20,
        38
    );

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

    enemySpawner.draw(ctx);

    jogador.draw(ctx);

    desenharHUD();

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
