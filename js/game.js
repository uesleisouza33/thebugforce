/* ============================================================
   THE BUG FORCE — A Revolta dos Bits
   js/game.js

   Esqueleto jogável do modo "Jogar Solo" (html/jogarSolo.html).

   Inspirado no padrão usado no prototipo avatar.js/objetos.js
   (classe "Obj" + sistema de cenas + game loop), mas reescrito
   com nomes em português e já ligado aos assets reais do projeto.

   COMO CONTINUAR A PARTIR DAQUI (sugestões de próximos passos):
   1. Trocar o placeholder do inimigo (desenhado como bloco + 🐛)
      por uma imagem real em assets/img/viloes/prof_duds.png
      assim que o sprite estiver pronto.
   2. Implementar a habilidade especial de cada personagem dentro
      de jogador.usarHabilidade() (tecla Q).
   3. Quando "pontos" atingir o valor da Fase 2, trocar o IMG_FUNDO,
      a lista de inimigos e a música — ver o TODO em atualizar().
   4. Permitir escolher o personagem (Larissa, Ueslei, Jair, Eliel...)
      trocando IMG_JOGADOR antes de criar o objeto "jogador".
   ============================================================ */

// ---------- Configuração geral ----------
const canvasEl = document.getElementById("gameCanvas");
const ctx = canvasEl.getContext("2d");
const LARGURA = canvasEl.width;
const ALTURA = canvasEl.height;

ctx.imageSmoothingEnabled = false; // mantém o visual "pixelado" do tema

// ---------- Assets (imagens) ----------
function carregarImagem(src) {
    const img = new Image();
    img.src = src;
    return img;
}

const IMG_FUNDO = carregarImagem("../assets/img/game/fase1.webp");
const IMG_JOGADOR = carregarImagem("../assets/img/manuel/larissa.png");

// ---------- Assets (áudio) ----------
const somTiro = new Audio("../assets/audio/Sound/binarioLaser.mp3");
const somDerrota = new Audio("../assets/audio/Sound/codigoLinhaLaser.mp3");
const somDano = new Audio("../assets/audio/Sound/risada_carlos.mp3");
const musicaFase = new Audio("../assets/audio/music/fase1_e_2.mp3");
musicaFase.loop = true;
musicaFase.volume = 0.4;

// ============================================================
// CLASSES
// ============================================================

/** Classe base: tudo que aparece na tela tem posição, tamanho e imagem */
class Entidade {
    constructor(x, y, largura, altura, imagem) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.imagem = imagem;
    }

    desenhar() {
        if (this.imagem) {
            ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
        }
    }

    /** Colisão simples por retângulos (AABB) */
    colideCom(outro) {
        return (
            this.x < outro.x + outro.largura &&
            this.x + this.largura > outro.x &&
            this.y < outro.y + outro.altura &&
            this.y + this.altura > outro.y
        );
    }
}

/** O herói controlado pelo jogador */
class Jogador extends Entidade {
    constructor() {
        super(100, ALTURA - 160, 80, 140, IMG_JOGADOR);
        this.velocidade = 5;
        this.vidaMax = 3;
        this.vida = this.vidaMax;
        this.invulneravel = 0; // contagem de frames de invencibilidade após dano
        this.direcao = 1; // 1 = olhando p/ direita, -1 = olhando p/ esquerda
    }

    mover(teclas) {
        if (teclas["ArrowUp"] || teclas["w"] || teclas["W"]) this.y -= this.velocidade;
        if (teclas["ArrowDown"] || teclas["s"] || teclas["S"]) this.y += this.velocidade;
        if (teclas["ArrowLeft"] || teclas["a"] || teclas["A"]) {
            this.x -= this.velocidade;
            this.direcao = -1;
        }
        if (teclas["ArrowRight"] || teclas["d"] || teclas["D"]) {
            this.x += this.velocidade;
            this.direcao = 1;
        }

        // Não deixa o jogador saber da área visível
        this.x = Math.max(0, Math.min(LARGURA - this.largura, this.x));
        this.y = Math.max(0, Math.min(ALTURA - this.altura, this.y));

        if (this.invulneravel > 0) this.invulneravel--;
    }

    receberDano() {
        if (this.invulneravel === 0) {
            this.vida--;
            this.invulneravel = 60; // ~1 segundo de invencibilidade (60fps)
            somDano.currentTime = 0;
            somDano.play().catch(() => {});
        }
    }

    usarHabilidade() {
        // TODO: cada personagem terá uma habilidade especial diferente.
        // Ex.: Larissa chama um aliado, Eliel dá uma "chicotada" em área,
        // Ueslei ganha precisão extra por alguns segundos, etc.
        mostrarMensagem("HABILIDADE ESPECIAL: em desenvolvimento!", 90);
    }

    desenhar() {
        ctx.save();

        // efeito de "piscar" enquanto está invencível após dano
        if (this.invulneravel > 0 && Math.floor(this.invulneravel / 5) % 2 === 0) {
            ctx.globalAlpha = 0.3;
        }

        // espelha o sprite quando o jogador olha para a esquerda
        if (this.direcao === -1) {
            ctx.translate(this.x + this.largura, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(this.imagem, 0, 0, this.largura, this.altura);
        } else {
            ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
        }

        ctx.restore();
    }
}

/** Tiro de "código binário" disparado pelo jogador */
class TiroBinario extends Entidade {
    constructor(x, y, direcao) {
        super(x, y, 36, 22, null);
        this.velocidade = 11 * direcao;
        this.texto = Math.random() < 0.5 ? "01" : "10";
        this.derrotado = false;
    }

    mover() {
        this.x += this.velocidade;
    }

    desenhar() {
        ctx.font = "bold 20px monospace";
        ctx.fillStyle = "#44ddff";
        ctx.shadowColor = "#00ccff";
        ctx.shadowBlur = 8;
        ctx.fillText(this.texto, this.x, this.y);
        ctx.shadowBlur = 0;
    }

    foraDaTela() {
        return this.x < -40 || this.x > LARGURA + 40;
    }
}

/**
 * Inimigo da Fase 1 (professor/professora possuído).
 * PLACEHOLDER VISUAL: enquanto os sprites dos vilões não ficam prontos,
 * desenhamos um bloco vermelho com o emoji de "bug". Quando a arte
 * estiver disponível em assets/img/viloes/, basta trocar o método
 * desenhar() por um ctx.drawImage(...) como nas outras classes.
 */
class Inimigo extends Entidade {
    constructor() {
        const largura = 70;
        const altura = 110;
        const y = Math.random() * (ALTURA - altura);
        super(LARGURA, y, largura, altura, null);
        this.velocidade = 2 + Math.random() * 2.5;
        this.derrotado = false;
    }

    mover() {
        this.x -= this.velocidade;
    }

    foraDaTela() {
        return this.x + this.largura < 0;
    }

    desenhar() {
        ctx.fillStyle = "rgba(200, 30, 30, 0.85)";
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
        ctx.strokeStyle = "#ff8888";
        ctx.strokeRect(this.x, this.y, this.largura, this.altura);

        ctx.font = "40px sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.fillText("🐛", this.x + this.largura / 2, this.y + this.altura / 2 + 14);
        ctx.textAlign = "left";
    }
}

// ============================================================
// ESTADO DO JOGO
// ============================================================

const teclas = {};
let tiros = [];
let inimigos = [];
let pontos = 0;
let tempoSpawn = 0;
let mensagem = { texto: "", duracao: 0 };
let estado = "jogando"; // "jogando" | "gameover"
const jogador = new Jogador();

// ---------- Entrada do teclado ----------
document.addEventListener("keydown", (e) => {
    teclas[e.key] = true;

    // A música só pode iniciar depois de uma interação do usuário
    if (musicaFase.paused) musicaFase.play().catch(() => {});

    if (estado === "jogando") {
        if (e.code === "Space") {
            e.preventDefault();
            const x = jogador.direcao === 1
                ? jogador.x + jogador.largura
                : jogador.x - 36;
            tiros.push(new TiroBinario(x, jogador.y + jogador.altura / 2 - 11, jogador.direcao));
            somTiro.currentTime = 0;
            somTiro.play().catch(() => {});
        }
        if (e.key === "q" || e.key === "Q") {
            jogador.usarHabilidade();
        }
    } else if (estado === "gameover" && (e.key === "r" || e.key === "R")) {
        reiniciar();
    }
});

document.addEventListener("keyup", (e) => {
    teclas[e.key] = false;
});

function mostrarMensagem(texto, duracaoEmFrames) {
    mensagem = { texto, duracao: duracaoEmFrames };
}

function reiniciar() {
    jogador.x = 100;
    jogador.y = ALTURA - 160;
    jogador.vida = jogador.vidaMax;
    jogador.invulneravel = 0;
    jogador.direcao = 1;

    tiros = [];
    inimigos = [];
    pontos = 0;
    tempoSpawn = 0;
    estado = "jogando";

    musicaFase.currentTime = 0;
    musicaFase.play().catch(() => {});
}

// ============================================================
// LOOP PRINCIPAL
// ============================================================

function atualizar() {
    if (estado !== "jogando") return;

    jogador.mover(teclas);

    // Tiros
    tiros.forEach((t) => t.mover());
    tiros = tiros.filter((t) => !t.foraDaTela() && !t.derrotado);

    // Spawn de inimigos
    tempoSpawn++;
    if (tempoSpawn >= 90) {
        inimigos.push(new Inimigo());
        tempoSpawn = 0;
    }
    inimigos.forEach((i) => i.mover());

    // Colisão: tiro x inimigo
    tiros.forEach((tiro) => {
        inimigos.forEach((inimigo) => {
            if (!inimigo.derrotado && tiro.colideCom(inimigo)) {
                inimigo.derrotado = true;
                tiro.derrotado = true;
                pontos += 10;
                somDerrota.currentTime = 0;
                somDerrota.play().catch(() => {});
            }
        });
    });

    // Colisão: inimigo x jogador
    inimigos.forEach((inimigo) => {
        if (inimigo.colideCom(jogador)) {
            jogador.receberDano();
        }
    });

    inimigos = inimigos.filter((i) => !i.derrotado && !i.foraDaTela());

    if (mensagem.duracao > 0) mensagem.duracao--;

    if (jogador.vida <= 0) {
        estado = "gameover";
        musicaFase.pause();
    }

    // TODO: transição de fase. Ex.:
    // if (pontos >= 100) { iniciarFase2(); }
}

function desenhar() {
    ctx.clearRect(0, 0, LARGURA, ALTURA);
    ctx.drawImage(IMG_FUNDO, 0, 0, LARGURA, ALTURA);

    jogador.desenhar();
    tiros.forEach((t) => t.desenhar());
    inimigos.forEach((i) => i.desenhar());

    desenharHUD();

    if (mensagem.duracao > 0) {
        ctx.font = "16px 'Press Start 2P', monospace";
        ctx.fillStyle = "#ffcc22";
        ctx.textAlign = "center";
        ctx.fillText(mensagem.texto, LARGURA / 2, 70);
        ctx.textAlign = "left";
    }

    if (estado === "gameover") {
        desenharGameOver();
    }
}

function desenharHUD() {
    // Vida (corações)
    for (let i = 0; i < jogador.vidaMax; i++) {
        ctx.font = "28px sans-serif";
        ctx.fillStyle = i < jogador.vida ? "#ff4466" : "#444";
        ctx.fillText("❤", 20 + i * 36, 40);
    }

    // Pontos
    ctx.font = "16px 'Press Start 2P', monospace";
    ctx.fillStyle = "#44ddff";
    ctx.textAlign = "right";
    ctx.fillText("PONTOS " + pontos, LARGURA - 20, 35);
    ctx.textAlign = "left";
}

function desenharGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(0, 0, LARGURA, ALTURA);

    ctx.textAlign = "center";

    ctx.fillStyle = "#ff4444";
    ctx.font = "48px 'Press Start 2P', monospace";
    ctx.fillText("GAME OVER", LARGURA / 2, ALTURA / 2 - 30);

    ctx.fillStyle = "#fff";
    ctx.font = "18px 'Press Start 2P', monospace";
    ctx.fillText("PONTOS: " + pontos, LARGURA / 2, ALTURA / 2 + 20);

    ctx.fillStyle = "#ffcc22";
    ctx.font = "14px 'Press Start 2P', monospace";
    ctx.fillText("PRESSIONE R PARA REINICIAR", LARGURA / 2, ALTURA / 2 + 60);

    ctx.textAlign = "left";
}

function loop() {
    atualizar();
    desenhar();
    requestAnimationFrame(loop);
}

loop();
