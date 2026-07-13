import SPRITES from "./sprites.js";
import CHARACTERS from "./characters.js";
import ENEMIES from "./enemies.js";
import FASES from "./fases.js";
import Audio$ from "./audio.js";
import Progresso from "./progresso.js";

import PlayerSpawner from "./playerspawn.js";
import EnemySpawner from "./enemyspawn.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

// =====================
// Backgrounds
// =====================

const fundos = {};

FASES.forEach(fase => {
    if (!fundos[fase.background]) {
        fundos[fase.background] = new Image();
        fundos[fase.background].src = fase.background;
    }
});

let fundoAtual = null;

// =====================
// Carrega sprites
// =====================

Object.values(SPRITES).forEach(sprite => {
    sprite.image = new Image();
    sprite.image.src = sprite.src;
});

// =====================
// Estado do jogo
// =====================

let jogador;
let playerSpawner;
let enemySpawner;

// Estados: "jogando" | "boss" | "transicao" | "gameover"
let estadoJogo = "jogando";

let pontuacao = 0;

// =====================
// Controle de fases
// =====================

let faseIndex = 0;
let faseConfig = null;

let killsNaFase = 0;
let killsBase   = 0;

// Boss
let bossSpawnado = false;
let bossRef      = null;
let bossNome     = "";

// Transição
let tempoTransicao = 0;
const DURACAO_TRANSICAO = 3500;

// =====================
// Rastreamento de kills para SFX
// =====================

let killsAntes = 0;

const teclas = {};

// =====================
// Input
// =====================

window.addEventListener("keydown", (e) => {

    // Primeira interação — habilita áudio
    Audio$.habilitar();

    teclas[e.key.toLowerCase()] = true;

    if (estadoJogo !== "jogando" && estadoJogo !== "boss")
        return;

    if (e.key.toLowerCase() === "h" && jogador) {
        jogador.receberDano(10);
    }

    if (e.code === "Space" && jogador) {
        e.preventDefault();
        jogador.atacar();
        Audio$.tocarSFX("tiro");
    }

    if (e.key.toLowerCase() === "q" && jogador) {
        jogador.usarHabilidade();
        Audio$.tocarSFX("habilidade");
    }

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }

});

window.addEventListener("keyup", (e) => {
    teclas[e.key.toLowerCase()] = false;
});

// Habilita áudio no primeiro clique também
window.addEventListener("click", () => {
    Audio$.habilitar();
}, { once: true });

// =====================
// Inicialização
// =====================

function iniciar() {

    const p1Key = sessionStorage.getItem("personagemSelecionado") || "larissa";

    playerSpawner = new PlayerSpawner(
        SPRITES[p1Key],
        CHARACTERS[p1Key]
    );

    jogador = playerSpawner.spawn();

    enemySpawner = new EnemySpawner([], canvas);

    carregarFase(0);

    requestAnimationFrame(loop);

}

// =====================
// Carregar fase
// =====================

function carregarFase(index) {

    faseConfig = FASES[index];

    fundoAtual = fundos[faseConfig.background];

    enemySpawner.enemyConfigs = faseConfig.enemyPool.map(key => ({
        spriteConfig: SPRITES[key],
        enemyConfig:  ENEMIES[key]
    }));

    enemySpawner.intervaloSpawn = faseConfig.intervaloSpawn;
    enemySpawner.limpar();
    enemySpawner.tempoSpawn = 0;
    enemySpawner.iniciar();

    killsBase    = Number.isFinite(enemySpawner.kills) ? enemySpawner.kills : 0;
    killsNaFase  = 0;
    killsAntes   = killsBase;

    bossSpawnado = false;
    bossRef      = null;
    bossNome     = "";

    tempoTransicao = 0;
    estadoJogo     = "jogando";

    // Música da fase
    const musicaKey = "fase" + (index + 1);
    Audio$.tocarMusica(musicaKey);

}

// =====================
// Spawn do boss
// =====================

function spawnBoss() {

    const bossCfg   = faseConfig.boss;
    const spriteBase = SPRITES[bossCfg.spriteKey];
    const enemyBase  = ENEMIES[bossCfg.enemyKey];

    const bossSprite = {
        src:         spriteBase.src,
        image:       spriteBase.image,
        frameWidth:  spriteBase.frameWidth,
        frameHeight: spriteBase.frameHeight,
        width:       bossCfg.largura,
        height:      bossCfg.altura,
        animations:  spriteBase.animations
    };

    const bossEnemy = {
        vida:          enemyBase.vida + bossCfg.vidaExtra,
        velocidade:    bossCfg.velocidade,
        dano:          enemyBase.dano + bossCfg.danoExtra,
        alcanceAtaque: enemyBase.alcanceAtaque || 20,
        cooldownAtaque: Math.max(500, (enemyBase.cooldownAtaque || 1000) - 200),
        pontosAoMatar: bossCfg.pontosAoMatar,
        pontosAoBater: -2,
        pontosAoPassar: 0,
        chanceDrop:    bossCfg.chanceDrop,
        tipo:          "boss"
    };

    enemySpawner.parar();
    enemySpawner.limpar();

    const bossX = canvas.width - bossCfg.largura - 100;
    const bossY = canvas.height - bossCfg.altura - 130;

    enemySpawner.spawn(bossX, bossY, {
        spriteConfig: bossSprite,
        enemyConfig:  bossEnemy
    });

    bossRef  = enemySpawner.inimigos[enemySpawner.inimigos.length - 1];
    bossNome = bossCfg.nomeExibido;

    bossSpawnado = true;
    estadoJogo   = "boss";

    // Som de boss
    Audio$.tocarSFX("morte");

}

// =====================
// Fim de jogo
// =====================

function finalizarJogo() {

    estadoJogo = "gameover";

    Audio$.tocarMusica("gameover");

    const resultado = Progresso.registrarPartida(pontuacao);

    sessionStorage.setItem("pontuacaoFinal",  pontuacao);
    sessionStorage.setItem("melhorPontuacao", resultado.melhorPontuacao);

    setTimeout(() => {
        window.location.href = "gameOver.html";
    }, 1500);

}

// =====================
// Vitória
// =====================

function finalizarVitoria() {

    Audio$.tocarMusica("vitoria");

    const resultado = Progresso.registrarPartida(pontuacao);

    sessionStorage.setItem("pontuacaoFinal",  pontuacao);
    sessionStorage.setItem("melhorPontuacao", resultado.melhorPontuacao);
    sessionStorage.setItem("vitoria", "1");

    setTimeout(() => {
        window.location.href = "vitoria.html";
    }, 1500);

}

// =====================
// Coleta de drops (Amuleto da Iza)
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
            Audio$.tocarSFX("item");
        }

    }

}

// =====================
// Checa kills para tocar SFX de morte de inimigo
// =====================

function verificarSFXKills() {

    const killsAgora = Number.isFinite(enemySpawner.kills) ? enemySpawner.kills : 0;

    // Apenas atualiza o contador — sem SFX para inimigos comuns
    killsAntes = killsAgora;

}

// =====================
// Update — jogando
// =====================

function atualizarJogando(deltaTime) {

    const vidaAntes = jogador.vida;

    jogador.mover(teclas);
    jogador.update(deltaTime);

    pontuacao += enemySpawner.update(deltaTime, jogador);
    pontuacao += jogador.verificarAtaques(enemySpawner.inimigos);

    verificarColetaDrops();
    verificarSFXKills();

    const inimigo = enemySpawner.verificarColisao(jogador);
    if (inimigo) {
        const pontosPerdidos = inimigo.atacar(jogador);
        if (jogador.vida < vidaAntes) {
            Audio$.tocarSFX("hit");
        }
        pontuacao += pontosPerdidos;
    }

    if (pontuacao < 0) pontuacao = 0;

    const killsTotal = Number.isFinite(enemySpawner.kills) ? enemySpawner.kills : 0;
    killsNaFase = Math.max(0, killsTotal - killsBase);

    if (!bossSpawnado && killsNaFase >= faseConfig.inimigosParaVencer) {
        spawnBoss();
    }

    if (jogador.morto) {
        finalizarJogo();
    }

}

// =====================
// Update — boss
// =====================

function atualizarBoss(deltaTime) {

    const vidaAntes = jogador.vida;

    jogador.mover(teclas);
    jogador.update(deltaTime);

    pontuacao += enemySpawner.update(deltaTime, jogador);
    pontuacao += jogador.verificarAtaques(enemySpawner.inimigos);

    verificarColetaDrops();

    const inimigo = enemySpawner.verificarColisao(jogador);
    if (inimigo) {
        const pontosPerdidos = inimigo.atacar(jogador);
        if (jogador.vida < vidaAntes) {
            Audio$.tocarSFX("hit");
        }
        pontuacao += pontosPerdidos;
    }

    if (pontuacao < 0) pontuacao = 0;

    if (bossRef && bossRef.morto && enemySpawner.inimigos.length === 0) {
        estadoJogo     = "transicao";
        tempoTransicao = 0;
    }

    if (jogador.morto) {
        finalizarJogo();
    }

}

// =====================
// Update — transição
// =====================

function atualizarTransicao(deltaTime) {

    tempoTransicao += deltaTime;

    if (tempoTransicao >= DURACAO_TRANSICAO) {

        const proximaFase = faseIndex + 1;

        if (proximaFase >= FASES.length) {
            finalizarVitoria();
        } else {
            faseIndex = proximaFase;
            carregarFase(faseIndex);
        }

    }

}

// =====================
// HUD — gameplay
// =====================

function desenharHUD() {

    // Barra de vida
    ctx.fillStyle = "#111";
    ctx.fillRect(18, 18, 204, 22);

    const vidaPct = jogador.vida / jogador.vidaMaxima;

    if (vidaPct > 0.5)       ctx.fillStyle = "#33cc33";
    else if (vidaPct > 0.25) ctx.fillStyle = "#ffaa00";
    else                     ctx.fillStyle = "#ff3333";

    ctx.fillRect(20, 20, vidaPct * 200, 18);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.strokeRect(18, 18, 204, 22);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(jogador.vida + " / " + jogador.vidaMaxima, 120, 29);

    // Nome
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(jogador.characterConfig.nome || "JOGADOR", 20, 58);

    // Habilidade especial
    const agora        = Date.now();
    const cooldownTotal = jogador.characterConfig.habilidadeEspecial.cooldown;
    const tempoDesde   = agora - jogador.specialAttack.ultimoAtaque;
    const emRecarga    = tempoDesde < cooldownTotal;

    ctx.fillStyle = "#111";
    ctx.fillRect(20, 65, 100, 10);

    ctx.fillStyle = "#6644ff";
    ctx.fillRect(20, 65, (emRecarga ? (tempoDesde / cooldownTotal) : 1) * 100, 10);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 65, 100, 10);

    ctx.fillStyle = emRecarga ? "#aaa" : "#fff";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("[Q] Habilidade", 126, 74);

    // Pontuação
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "right";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("PONTOS: " + pontuacao, canvas.width - 20, 38);

    // Fase
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "right";
    ctx.fillText(faseConfig.nome, canvas.width - 20, 58);

    // Contador de inimigos (antes do boss)
    if (!bossSpawnado) {
        const meta  = faseConfig.inimigosParaVencer;
        const atual = Math.min(killsNaFase, meta);
        ctx.fillStyle = "#ffdd00";
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "right";
        ctx.fillText("INIMIGOS: " + atual + " / " + meta, canvas.width - 20, 76);
    }

}

// =====================
// HUD — boss
// =====================

function desenharHUDBoss() {

    desenharHUD();

    if (!bossRef) return;

    const bossBarW = 600;
    const bossBarH = 20;
    const bossBarX = (canvas.width - bossBarW) / 2;
    const bossBarY = 20;

    ctx.fillStyle = "#111";
    ctx.fillRect(bossBarX - 2, bossBarY - 2, bossBarW + 4, bossBarH + 4);

    const bossVidaPct = Math.max(0, bossRef.vida / bossRef.vidaMaxima);
    ctx.fillStyle = "#cc0000";
    ctx.fillRect(bossBarX, bossBarY, bossVidaPct * bossBarW, bossBarH);

    ctx.strokeStyle = "#ff4444";
    ctx.lineWidth = 2;
    ctx.strokeRect(bossBarX, bossBarY, bossBarW, bossBarH);

    ctx.fillStyle = "#ff4444";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(bossNome, canvas.width / 2, bossBarY - 5);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px monospace";
    ctx.textBaseline = "middle";
    ctx.fillText(
        Math.max(0, bossRef.vida) + " / " + bossRef.vidaMaxima,
        canvas.width / 2,
        bossBarY + bossBarH / 2
    );

}

// =====================
// Draw — overlay transição
// =====================

function desenharTransicao() {

    ctx.drawImage(fundoAtual, 0, 0, canvas.width, canvas.height);
    enemySpawner.draw(ctx);
    jogador.draw(ctx);

    const alpha = Math.min(0.85, (tempoTransicao / 1000) * 0.85);
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 42px monospace";
    ctx.shadowColor = "#ffd700";
    ctx.shadowBlur = 20;
    ctx.fillText("FASE " + faseConfig.id + " COMPLETA!", canvas.width / 2, canvas.height / 2 - 60);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px monospace";
    ctx.shadowBlur = 0;
    ctx.fillText(faseConfig.subtitulo, canvas.width / 2, canvas.height / 2 - 15);

    ctx.fillStyle = "#aaffaa";
    ctx.font = "bold 20px monospace";
    ctx.fillText("Pontuação: " + pontuacao, canvas.width / 2, canvas.height / 2 + 30);

    const proximaIndex = faseIndex + 1;

    if (proximaIndex < FASES.length) {

        const proximaFase = FASES[proximaIndex];
        const progresso   = Math.min(1, tempoTransicao / DURACAO_TRANSICAO);
        const barW = 400;
        const barX = (canvas.width - barW) / 2;
        const barY = canvas.height / 2 + 80;

        ctx.fillStyle = "#333";
        ctx.fillRect(barX, barY, barW, 12);
        ctx.fillStyle = "#ffd700";
        ctx.fillRect(barX, barY, progresso * barW, 12);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barW, 12);

        ctx.fillStyle = "#ccc";
        ctx.font = "bold 13px monospace";
        ctx.fillText(
            "Preparando: " + proximaFase.nome + " — " + proximaFase.subtitulo,
            canvas.width / 2,
            barY + 28
        );

    } else {

        ctx.fillStyle = "#ffd700";
        ctx.font = "bold 20px monospace";
        ctx.fillText("Você salvou a escola!", canvas.width / 2, canvas.height / 2 + 90);

    }

    ctx.shadowBlur = 0;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

}

// =====================
// Draw — gameplay
// =====================

function desenhar() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(fundoAtual, 0, 0, canvas.width, canvas.height);

    enemySpawner.draw(ctx);
    jogador.draw(ctx);

    if (estadoJogo === "boss") {
        desenharHUDBoss();
    } else {
        desenharHUD();
    }

}

// =====================
// Loop principal
// =====================

let ultimoTempo = 0;

function loop(tempoAtual) {

    const deltaTime = tempoAtual - ultimoTempo;
    ultimoTempo = tempoAtual;

    switch (estadoJogo) {

        case "jogando":
            atualizarJogando(deltaTime);
            desenhar();
            break;

        case "boss":
            atualizarBoss(deltaTime);
            desenhar();
            break;

        case "transicao":
            atualizarTransicao(deltaTime);
            desenharTransicao();
            break;

    }

    requestAnimationFrame(loop);

}

// =====================
// Carregamento de assets
// =====================

const promessesFundos = Object.values(fundos).map(img =>
    new Promise(resolve => { img.onload = resolve; })
);

const promessesSprites = Object.values(SPRITES).map(sprite =>
    new Promise(resolve => { sprite.image.onload = resolve; })
);

Promise.all([...promessesFundos, ...promessesSprites]).then(iniciar);
