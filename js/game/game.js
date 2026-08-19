import SPRITES from "./sprites.js";
import CHARACTERS from "./characters.js";
import ENEMIES from "./enemies.js";
import FASES from "./fases.js";
import Audio$ from "./audio.js";
import Progresso from "./progresso.js";

import PlayerSpawner from "./playerspawn.js";
import EnemySpawner from "./enemyspawn.js";
import Efeitos from "./combat/effects.js";

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

let modoJogo = 1; // 1 = Solo | 2 = Dupla
let jogador1 = null;
let jogador2 = null;
let jogadores = [];
let enemySpawner = null;

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

    const key = e.key.toLowerCase();
    const code = e.code || "";
    teclas[key] = true;
    if (code) teclas[code.toLowerCase()] = true;

    if (estadoJogo !== "jogando" && estadoJogo !== "boss")
        return;

    // Tecla de testes / debug
    if (key === "h" && jogador1) {
        jogador1.receberDano(10);
    }

    // Evita rolagem da tela para teclas do jogo
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", "space", "enter"].includes(code.toLowerCase()) ||
        ["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) {
        e.preventDefault();
    }

    // --- CONTROLES JOGADOR 1 ---
    if (jogador1 && !jogador1.morto) {
        if (code === "Space" || key === " ") {
            jogador1.atacar();
            Audio$.tocarSFX("tiro");
        }
        if (key === "q") {
            jogador1.usarHabilidade();
            Audio$.tocarSFX("habilidade");
        }
    }

    // --- CONTROLES JOGADOR 2 ---
    if (modoJogo === 2 && jogador2 && !jogador2.morto) {
        if (code === "Enter" || key === "enter" || key === "k" || code === "numpad0") {
            jogador2.atacar();
            Audio$.tocarSFX("tiro");
        }
        if (key === "l" || e.key === "Shift" || code === "shiftright" || code === "shiftleft" || key === "p") {
            jogador2.usarHabilidade();
            Audio$.tocarSFX("habilidade");
        }
    }

});

window.addEventListener("keyup", (e) => {
    teclas[e.key.toLowerCase()] = false;
    if (e.code) teclas[e.code.toLowerCase()] = false;
});

// Habilita áudio no primeiro clique também
window.addEventListener("click", () => {
    Audio$.habilitar();
}, { once: true });

// =====================
// Inicialização
// =====================

function iniciar() {

    modoJogo = parseInt(sessionStorage.getItem("modoJogo") || "1", 10);

    let p1Key = sessionStorage.getItem("personagemP1") || sessionStorage.getItem("personagemSelecionado") || "larissa";
    p1Key = p1Key.toLowerCase();
    if (p1Key === "prof-sandra") p1Key = "sandra";

    const spriteConfig1 = SPRITES[p1Key] || SPRITES["larissa"];
    const characterConfig1 = CHARACTERS[p1Key] || CHARACTERS["larissa"];

    const playerSpawner1 = new PlayerSpawner(
        spriteConfig1,
        characterConfig1
    );

    jogador1 = playerSpawner1.spawn();
    jogador1.playerNumber = 1;
    jogadores = [jogador1];

    if (modoJogo === 2) {
        let p2Key = sessionStorage.getItem("personagemP2") || "ueslei";
        p2Key = p2Key.toLowerCase();
        if (p2Key === "prof-sandra") p2Key = "sandra";

        const spriteConfig2 = SPRITES[p2Key] || SPRITES["ueslei"];
        const characterConfig2 = CHARACTERS[p2Key] || CHARACTERS["ueslei"];

        const playerSpawner2 = new PlayerSpawner(
            spriteConfig2,
            characterConfig2
        );

        jogador2 = playerSpawner2.spawn();
        jogador2.playerNumber = 2;
        jogador2.y = Math.min(600, jogador1.y + 40);
        jogadores.push(jogador2);
    } else {
        jogador2 = null;
    }

    // Atualiza dica na tela se houver elemento .dica
    const dicaEl = document.querySelector(".dica");
    if (dicaEl) {
        if (modoJogo === 2) {
            dicaEl.innerHTML = "P1: WASD = MOVER | ESPAÇO = DISPARAR | Q = ESPECIAL &nbsp;&nbsp;|&nbsp;&nbsp; P2: SETAS = MOVER | ENTER = DISPARAR | L / SHIFT = ESPECIAL";
        } else {
            dicaEl.innerHTML = "SETAS / WASD = MOVER &nbsp;|&nbsp; ESPAÇO = DISPARAR &nbsp;|&nbsp; Q = HABILIDADE ESPECIAL";
        }
    }

    enemySpawner = new EnemySpawner([], canvas);

    // Carrega a fase e a pontuação salvas (útil para continuar pós-diálogo)
    faseIndex = parseInt(sessionStorage.getItem("faseAtual"), 10) || 0;
    pontuacao = parseInt(sessionStorage.getItem("pontuacaoAtual"), 10) || 0;

    carregarFase(faseIndex);

    requestAnimationFrame(loop);

}

// =====================
// Carregar fase
// =====================

function carregarFase(index) {

    faseConfig = FASES[index];

    const txtFaseEl = document.querySelector(".fase-atual");
    if (txtFaseEl && faseConfig) {
        txtFaseEl.textContent = `${faseConfig.nome} — ${faseConfig.subtitulo}`;
    }

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
        tipo:          "boss",
        tipoAtaque:    enemyBase.tipoAtaque
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

    Efeitos.particulas = [];
    estadoJogo = "gameover";

    Audio$.tocarMusica("gameover");

    const resultado = Progresso.registrarPartida(pontuacao);

    sessionStorage.setItem("pontuacaoFinal",  pontuacao);
    sessionStorage.setItem("melhorPontuacao", resultado.melhorPontuacao);

    // Limpa o progresso temporário do jogo ao perder
    sessionStorage.removeItem("faseAtual");
    sessionStorage.removeItem("pontuacaoAtual");

    setTimeout(() => {
        window.location.href = "gameOver.html";
    }, 1500);

}

// =====================
// Vitória
// =====================

function finalizarVitoria() {

    Efeitos.particulas = [];
    Audio$.tocarMusica("vitoria");

    const resultado = Progresso.registrarPartida(pontuacao);

    sessionStorage.setItem("pontuacaoFinal",  pontuacao);
    sessionStorage.setItem("melhorPontuacao", resultado.melhorPontuacao);
    sessionStorage.setItem("vitoria", "1");

    // Limpa o progresso temporário do jogo ao vencer
    sessionStorage.removeItem("faseAtual");
    sessionStorage.removeItem("pontuacaoAtual");

    setTimeout(() => {
        window.location.href = "vitoria.html";
    }, 1500);

}

// =====================
// Coleta de drops (Amuleto da Iza)
// =====================

function verificarColetaDrops() {

    for (const drop of enemySpawner.drops) {

        if (!drop.ativo)
            continue;

        for (const j of jogadores) {
            if (!j || j.morto || !drop.ativo) continue;

            const colidiu =
                j.x < drop.x + drop.largura &&
                j.x + j.largura > drop.x &&
                j.y < drop.y + drop.altura &&
                j.y + j.altura > drop.y;

            if (colidiu) {
                j.curar(drop.cura);
                drop.ativo = false;
                Audio$.tocarSFX("item");
            }
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

    jogadores.forEach(j => {
        if (j && !j.morto) {
            j.mover(teclas, modoJogo);
            j.update(deltaTime);
        }
    });

    Efeitos.update(deltaTime);

    pontuacao += enemySpawner.update(deltaTime, jogadores);

    jogadores.forEach(j => {
        if (j && !j.morto) {
            pontuacao += j.verificarAtaques(enemySpawner.inimigos);
        }
    });

    verificarColetaDrops();
    verificarSFXKills();

    jogadores.forEach(j => {
        if (j && !j.morto) {
            const vidaAntes = j.vida;
            const inimigo = enemySpawner.verificarColisao(j);
            if (inimigo) {
                const pontosPerdidos = inimigo.atacar(j);
                if (j.vida < vidaAntes) {
                    Audio$.tocarSFX("hit");
                }
                pontuacao += pontosPerdidos;
            }
        }
    });

    if (pontuacao < 0) pontuacao = 0;

    const killsTotal = Number.isFinite(enemySpawner.kills) ? enemySpawner.kills : 0;
    killsNaFase = Math.max(0, killsTotal - killsBase);

    if (!bossSpawnado && killsNaFase >= faseConfig.inimigosParaVencer) {
        spawnBoss();
    }

    const todosMortos = jogadores.length > 0 && jogadores.every(j => j.morto);
    if (todosMortos) {
        finalizarJogo();
    }

}

// =====================
// Update — boss
// =====================

function atualizarBoss(deltaTime) {

    jogadores.forEach(j => {
        if (j && !j.morto) {
            j.mover(teclas, modoJogo);
            j.update(deltaTime);
        }
    });

    Efeitos.update(deltaTime);

    pontuacao += enemySpawner.update(deltaTime, jogadores);

    jogadores.forEach(j => {
        if (j && !j.morto) {
            pontuacao += j.verificarAtaques(enemySpawner.inimigos);
        }
    });

    verificarColetaDrops();

    jogadores.forEach(j => {
        if (j && !j.morto) {
            const vidaAntes = j.vida;
            const inimigo = enemySpawner.verificarColisao(j);
            if (inimigo) {
                const pontosPerdidos = inimigo.atacar(j);
                if (j.vida < vidaAntes) {
                    Audio$.tocarSFX("hit");
                }
                pontuacao += pontosPerdidos;
            }
        }
    });

    if (pontuacao < 0) pontuacao = 0;

    if (bossRef && bossRef.morto) {
        estadoJogo     = "transicao";
        tempoTransicao = 0;
    }

    const todosMortos = jogadores.length > 0 && jogadores.every(j => j.morto);
    if (todosMortos) {
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
            // Salva o progresso e redireciona para a tela de diálogos da próxima fase
            sessionStorage.setItem("faseAtual", proximaFase);
            sessionStorage.setItem("pontuacaoAtual", pontuacao);
            window.location.href = "dialogo.html";
        }

    }

}

// =====================
// HUD — gameplay
// =====================

function desenharHUDPlayer(j, startX, startY, pLabel) {
    if (!j) return;

    ctx.fillStyle = "#111";
    ctx.fillRect(startX - 2, startY - 2, 204, 22);

    const vidaPct = Math.max(0, j.vida / j.vidaMaxima);

    if (j.morto) {
        ctx.fillStyle = "#555";
        ctx.fillRect(startX, startY, 200, 18);
    } else if (vidaPct > 0.5) {
        ctx.fillStyle = "#33cc33";
        ctx.fillRect(startX, startY, vidaPct * 200, 18);
    } else if (vidaPct > 0.25) {
        ctx.fillStyle = "#ffaa00";
        ctx.fillRect(startX, startY, vidaPct * 200, 18);
    } else {
        ctx.fillStyle = "#ff3333";
        ctx.fillRect(startX, startY, vidaPct * 200, 18);
    }

    ctx.strokeStyle = j.playerNumber === 1 ? "#00ccff" : "#ff3366";
    ctx.lineWidth = 2;
    ctx.strokeRect(startX - 2, startY - 2, 204, 22);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const txtVida = j.morto ? "K.O." : (j.vida + " / " + j.vidaMaxima);
    ctx.fillText(txtVida, startX + 100, startY + 9);

    // Nome
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    const nomePlayer = (j.characterConfig && j.characterConfig.nome) ? j.characterConfig.nome : "JOGADOR";
    ctx.fillText(pLabel + ": " + nomePlayer, startX, startY + 38);

    // Habilidade especial
    const agora = Date.now();
    const cooldownTotal = j.characterConfig.habilidadeEspecial.cooldown;
    const tempoDesde = agora - j.specialAttack.ultimoAtaque;
    const emRecarga = tempoDesde < cooldownTotal;

    ctx.fillStyle = "#111";
    ctx.fillRect(startX, startY + 45, 100, 10);

    ctx.fillStyle = j.playerNumber === 1 ? "#6644ff" : "#ffaa00";
    ctx.fillRect(startX, startY + 45, (emRecarga ? (tempoDesde / cooldownTotal) : 1) * 100, 10);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.strokeRect(startX, startY + 45, 100, 10);

    ctx.fillStyle = emRecarga ? "#aaa" : "#fff";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    const keyHint = j.playerNumber === 1 ? "[Q] Especial" : "[L/Shift] Especial";
    ctx.fillText(keyHint, startX + 106, startY + 54);
}

function desenharHUD() {

    desenharHUDPlayer(jogador1, 20, 18, "P1");

    if (modoJogo === 2 && jogador2) {
        desenharHUDPlayer(jogador2, 250, 18, "P2");
    }

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
    jogadores.forEach(j => {
        if (j && !j.morto) j.draw(ctx);
    });

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
    jogadores.forEach(j => {
        if (j && !j.morto) j.draw(ctx);
    });
    Efeitos.draw(ctx);

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
    new Promise(resolve => {
        if (img.complete) {
            resolve();
        } else {
            img.onload = resolve;
            img.onerror = resolve;
        }
    })
);

const promessesSprites = Object.values(SPRITES).map(sprite =>
    new Promise(resolve => {
        if (sprite.image && sprite.image.complete) {
            resolve();
        } else if (sprite.image) {
            sprite.image.onload = resolve;
            sprite.image.onerror = resolve;
        } else {
            resolve();
        }
    })
);

Promise.all([...promessesFundos, ...promessesSprites]).then(iniciar);
