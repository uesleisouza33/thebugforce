import SPRITES from "../sprites.js";
import Efeitos from "./effects.js";

export default class Attack {

    constructor(config) {

        this.config = config;

        this.cooldown = config.cooldown || 0;
        this.ultimoAtaque = 0;
        this.projeteis = [];
        this.helpers = [];

    }

    podeAtacar() {

        const agora = Date.now();

        return (agora - this.ultimoAtaque) >= this.cooldown;

    }

    executar(jogador) {

        if (!this.podeAtacar())
            return;

        this.ultimoAtaque = Date.now();

        switch (this.config.tipo) {

            case "projectile":

                this.projeteis.push(
                    this.criarProjetil(jogador)
                );

                break;

            case "chuvaCodigo": {

                const quantidade = this.config.quantidade || 5;

                for (let i = 0; i < quantidade; i++) {

                    const angulo = ((i / (quantidade - 1)) - 0.5) * 0.8;

                    this.projeteis.push(
                        this.criarProjetilAngulado(jogador, angulo)
                    );

                }

                break;

            }

            case "lideranca": {
                const allyKeys = ["ueslei", "jair", "eliel", "sandra", "janice"];
                const allyKey = allyKeys[Math.floor(Math.random() * allyKeys.length)];
                const spriteBase = SPRITES[allyKey];
                this.helpers.push({
                    x: jogador.x + 60,
                    y: jogador.y - 15,
                    largura: jogador.largura,
                    altura: jogador.altura,
                    image: spriteBase.image,
                    frameWidth: spriteBase.frameWidth,
                    frameHeight: spriteBase.frameHeight,
                    ticksRestantes: 180,
                    shootCooldown: 300,
                    ultimoTiro: 0
                });
                break;
            }

            case "precisao":
                jogador.tempoPrecisao = 6000;
                break;

            case "superDano":
                jogador.tempoSuperDano = 6000;
                break;

            case "chicotada": {
                this.projeteis.push({
                    x: jogador.x + jogador.largura,
                    y: jogador.y + jogador.altura / 2 - 75,
                    largura: 250,
                    altura: 150,
                    velocidade: 12 * jogador.direcao,
                    velocidadeY: 0,
                    dano: this.config.dano || 50,
                    cor: "#ffff00",
                    texto: "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
                    penetrating: true,
                    ativo: true
                });
                break;
            }

            case "superSoco": {
                this.projeteis.push({
                    x: jogador.direcao === 1 ? jogador.x + jogador.largura : jogador.x - 70,
                    y: jogador.y + jogador.altura / 2 - 35,
                    largura: 70,
                    altura: 70,
                    velocidade: 16 * jogador.direcao,
                    velocidadeY: 0,
                    dano: this.config.dano || 80,
                    cor: "#ff33ff",
                    texto: "👊",
                    ativo: true
                });
                break;
            }

            case "chuvaLivros": {
                const totalLivros = 12;
                const bookSymbols = ["📖", "📘", "📙", "📚"];
                for (let i = 0; i < totalLivros; i++) {
                    const livroX = Math.random() * 1100;
                    const livroY = -50 - Math.random() * 200;
                    const texto = bookSymbols[Math.floor(Math.random() * bookSymbols.length)];
                    this.projeteis.push({
                        x: livroX,
                        y: livroY,
                        largura: 30,
                        altura: 30,
                        velocidade: 0,
                        velocidadeY: 6 + Math.random() * 4,
                        dano: this.config.dano || 30,
                        cor: "#ff9900",
                        texto: texto,
                        ativo: true
                    });
                }
                break;
            }

            case "melee":

                console.log("Ataque corpo a corpo");

                break;

            case "heal":

                console.log("Curar");

                break;

            default:

                console.warn(
                    "Tipo de ataque desconhecido:",
                    this.config.tipo
                );

        }

    }

    criarProjetil(jogador) {

        const largura = this.config.largura || 18;
        const altura = this.config.altura || 8;
        const velocidade = this.config.velocidade || 10;

        let dano = this.config.dano || 10;
        let cor = this.config.cor || "#00f5ff";
        let texto = this.config.texto || "010101";
        let velX = velocidade * jogador.direcao;

        if (jogador.tempoPrecisao && jogador.tempoPrecisao > 0) {
            dano = dano * 2;
            cor = "#66b2ff";
            texto = "CRITICAL";
            velX = velX * 1.5;
        }

        if (jogador.tempoSuperDano && jogador.tempoSuperDano > 0) {
            dano = dano * 2.5;
            cor = "#33ff33";
            texto = "SUPER_DAMAGE";
        }

        return {
            x:
                jogador.direcao === 1
                    ? jogador.x + jogador.largura
                    : jogador.x - largura,
            y: jogador.y + jogador.altura / 2 - altura / 2,
            largura,
            altura,
            velocidade: velX,
            velocidadeY: 0,
            dano,
            cor,
            texto,
            ativo: true
        };

    }

    criarProjetilAngulado(jogador, angulo) {

        const largura = this.config.largura || 18;
        const altura = this.config.altura || 8;
        const velocidade = this.config.velocidade || 10;

        let dano = this.config.dano || 10;
        let cor = this.config.cor || "#ffd700";
        let texto = this.config.texto || "010101";

        if (jogador.tempoSuperDano && jogador.tempoSuperDano > 0) {
            dano = dano * 2.5;
            cor = "#33ff33";
            texto = "SUPER_DAMAGE";
        }

        return {
            x:
                jogador.direcao === 1
                    ? jogador.x + jogador.largura
                    : jogador.x - largura,
            y: jogador.y + jogador.altura / 2 - altura / 2,
            largura,
            altura,
            velocidade: velocidade * jogador.direcao,
            velocidadeY: velocidade * Math.sin(angulo),
            dano,
            cor,
            texto,
            ativo: true
        };

    }

    update(deltaTime, jogador = null) {

        this.projeteis.forEach(projetil => {

            projetil.x += projetil.velocidade;
            projetil.y += projetil.velocidadeY || 0;

            // Spawn trails with 40% probability
            if (projetil.ativo && Math.random() < 0.4) {
                if (projetil.texto === "👊") {
                    Efeitos.criarRastro(
                        projetil.x + (projetil.velocidade > 0 ? 0 : 70),
                        projetil.y + 35,
                        projetil.cor,
                        "○"
                    );
                } else if (projetil.texto === "📖" || projetil.texto === "📚" || projetil.texto === "📘" || projetil.texto === "📙") {
                    const letters = ["A", "B", "C", "D", "E", "F", "X", "Y", "Z", "?", "!"];
                    const letter = letters[Math.floor(Math.random() * letters.length)];
                    Efeitos.criarRastro(
                        projetil.x + Math.random() * 20,
                        projetil.y + 15,
                        projetil.cor,
                        letter
                    );
                } else if (projetil.penetrating) {
                    Efeitos.criarRastro(
                        projetil.x + Math.random() * 200,
                        projetil.y + 75 + (Math.random() - 0.5) * 50,
                        projetil.cor,
                        "~"
                    );
                } else {
                    const trailChar = Math.random() < 0.5 ? "0" : "1";
                    Efeitos.criarRastro(
                        projetil.x,
                        projetil.y + projetil.altura / 2,
                        projetil.cor,
                        trailChar
                    );
                }
            }

            if (
                projetil.x > 1400 ||
                projetil.x + projetil.largura < -100 ||
                projetil.y > 800
            ) {

                projetil.ativo = false;

            }

        });

        this.projeteis = this.projeteis.filter(projetil => {

            return projetil.ativo;

        });

        if (this.helpers) {
            this.helpers.forEach(h => {
                h.ticksRestantes--;

                if (jogador) {
                    h.x = jogador.x + 60;
                    h.y = jogador.y - 15;
                }

                const agora = Date.now();
                if (agora - h.ultimoTiro > h.shootCooldown) {
                    h.ultimoTiro = agora;
                    this.projeteis.push({
                        x: h.x + h.largura,
                        y: h.y + h.altura / 2 - 9,
                        largura: 70,
                        altura: 18,
                        velocidade: 12,
                        velocidadeY: 0,
                        dano: 20,
                        cor: "#ff3333",
                        texto: "AJUDA!",
                        ativo: true
                    });
                }
            });
            this.helpers = this.helpers.filter(h => h.ticksRestantes > 0);
        }

    }

    draw(ctx) {

        this.projeteis.forEach(projetil => {

            ctx.save();

            let font = "bold 16px monospace";
            let drawY = projetil.y + projetil.altura / 2;

            if (projetil.penetrating) {
                font = "bold 24px monospace";
                drawY += (Math.random() - 0.5) * 10;
            } else if (projetil.texto === "👊") {
                font = "50px monospace";
            } else if (projetil.texto === "📖" || projetil.texto === "📚" || projetil.texto === "📘" || projetil.texto === "📙") {
                font = "24px monospace";
            }

            ctx.font = font;
            ctx.textBaseline = "middle";

            // 1. Brilho externo colorido
            ctx.shadowColor = projetil.cor;
            ctx.shadowBlur = projetil.penetrating ? 16 : 10;
            ctx.fillStyle = projetil.cor;
            ctx.fillText(
                projetil.texto,
                projetil.x,
                drawY
            );

            // 2. Núcleo branco intenso (apenas para lasers e textos, não para emojis)
            if (projetil.texto !== "👊" && !["📖", "📚", "📘", "📙"].includes(projetil.texto)) {
                ctx.shadowBlur = 0;
                ctx.fillStyle = "#ffffff";
                ctx.fillText(
                    projetil.texto,
                    projetil.x,
                    drawY
                );
            }

            ctx.restore();

        });

        if (this.helpers) {
            this.helpers.forEach(h => {
                ctx.save();
                ctx.globalAlpha = 0.85;
                ctx.drawImage(
                    h.image,
                    0, 0, h.frameWidth, h.frameHeight,
                    h.x, h.y, h.largura, h.altura
                );
                ctx.restore();
            });
        }

    }

    verificarColisoes(inimigos) {

        let pontos = 0;

        this.projeteis.forEach(projetil => {

            if (!projetil.ativo)
                return;

            if (!projetil.inimigosAtingidos) {
                projetil.inimigosAtingidos = [];
            }

            for (const inimigo of inimigos) {

                if (inimigo.morto)
                    continue;

                const colidiu =
                    projetil.x < inimigo.x + inimigo.largura &&
                    projetil.x + projetil.largura > inimigo.x &&
                    projetil.y < inimigo.y + inimigo.altura &&
                    projetil.y + projetil.altura > inimigo.y;

                if (colidiu) {

                    if (projetil.inimigosAtingidos.includes(inimigo)) {
                        continue;
                    }

                    pontos += inimigo.receberDano(projetil.dano);
                    projetil.inimigosAtingidos.push(inimigo);

                    // Cria explosão de caracteres cibernéticos
                    Efeitos.criarSplash(
                        inimigo.x + inimigo.largura / 2,
                        inimigo.y + inimigo.altura / 2,
                        projetil.cor
                    );

                    if (!projetil.penetrating) {
                        projetil.ativo = false;
                        break;
                    }

                }

            }

        });

        this.projeteis = this.projeteis.filter(projetil => {

            return projetil.ativo;

        });

        return pontos;

    }

}
