import Entidade from "./entidade.js";
import Animacao from "./animacao.js";
import Audio$ from "./audio.js";
import Efeitos from "./combat/effects.js";

export default class Inimigo extends Entidade {

    static projeteis = [];

    constructor(x, y, spriteConfig, enemyConfig) {

        super(
            x,
            y,
            spriteConfig.width,
            spriteConfig.height,
            spriteConfig.image
        );

        this.spriteConfig = spriteConfig;
        this.enemyConfig = enemyConfig;

        this.velocidade = enemyConfig.velocidade;
        this.dano = enemyConfig.dano;
        this.alcanceAtaque = enemyConfig.alcanceAtaque || 0;
        this.cooldownAtaque = enemyConfig.cooldownAtaque || 1000;
        this.ultimoAtaque = 0;
        this.atacando = false;

        this.pontosAoMatar = enemyConfig.pontosAoMatar || 0;
        this.pontosAoBater = enemyConfig.pontosAoBater || 0;
        this.pontosAoPassar = enemyConfig.pontosAoPassar || 0;

        this.vidaMaxima = enemyConfig.vida;
        this.vida = this.vidaMaxima;
        this.morto = false;
        this.drop = null;
        this.chanceDrop = enemyConfig.chanceDrop || 0;

        this.animacao = new Animacao(
            spriteConfig.image,
            spriteConfig.frameWidth,
            spriteConfig.frameHeight
        );

        // Carrega todas as animações do sprites.js
        Object.entries(spriteConfig.animations).forEach(([nome, dados]) => {

            this.animacao.adicionar(nome, dados);

        });

        // Animação inicial
        if (spriteConfig.animations.walk) {
            this.animacao.tocar("walk");
        }

    }

    update(deltaTime, jogador = null) {

        if (this.morto)
            return;

        this.atacando =
            jogador !== null &&
            this.estaNoAlcance(jogador);

        if (!this.atacando && this.velocidade > 0) {

            this.x -= this.velocidade;

        }

        if (this.enemyConfig.comportamentoEspecial === "vera" && jogador && !jogador.morto) {
            if (!this.ultimoTeleport) this.ultimoTeleport = 0;
            if (!this.tempoGlitch) this.tempoGlitch = 0;

            if (this.tempoGlitch > 0) {
                this.tempoGlitch -= deltaTime;
            }

            let projetilPerigoso = false;

            const verificarAtaque = (ataque) => {
                if (ataque && ataque.projeteis) {
                    ataque.projeteis.forEach(p => {
                        if (p.ativo && p.velocidade > 0) {
                            const distX = this.x - p.x;
                            if (distX > 0 && distX < 250) {
                                const alignY = p.y + p.altura > this.y && p.y < this.y + this.altura;
                                if (alignY) {
                                    projetilPerigoso = true;
                                }
                            }
                        }
                    });
                }
            };

            verificarAtaque(jogador.primaryAttack);
            verificarAtaque(jogador.specialAttack);

            if (projetilPerigoso && Date.now() - this.ultimoTeleport > 1500) {
                this.ultimoTeleport = Date.now();
                this.tempoGlitch = 400; // 400ms glitch animation
                
                // Teleport to random Y
                const novoY = 180 + Math.random() * 220;
                this.y = novoY;
                
                Audio$.tocarSFX("habilidade");
            }
        }

        if (this.enemyConfig.tipoAtaque === "ranged" && jogador && !jogador.morto) {
            if (this.podeAtirarRanged()) {
                this.atirarRanged(jogador);
            }
        }

        this.animacao.update(deltaTime);

    }

    estaNoAlcance(jogador) {

        return (
            this.x < jogador.x + jogador.largura + this.alcanceAtaque &&
            this.x + this.largura + this.alcanceAtaque > jogador.x &&
            this.y < jogador.y + jogador.altura &&
            this.y + this.altura > jogador.y
        );

    }

    receberDano(dano = 10) {

        if (this.morto)
            return 0;

        this.vida -= dano;

        if (this.vida <= 0) {

            this.vida = 0;
            this.morto = true;
            this._gerarDrop();
            return this.pontosAoMatar;

        }

        return 0;

    }

    _gerarDrop() {

        if (Math.random() < this.chanceDrop) {

            this.drop = {
                x: this.x + this.largura / 2 - 16,
                y: this.y + this.altura - 32,
                largura: 32,
                altura: 32,
                tipo: "amuleto",
                cura: 30,
                ativo: true
            };

        }

    }

    podeAtacar() {

        const agora = Date.now();

        return (agora - this.ultimoAtaque) >= this.cooldownAtaque;

    }

    atacar(jogador) {

        if (
            this.morto ||
            !this.estaNoAlcance(jogador) ||
            !this.podeAtacar()
        )
            return 0;

        const acertou = jogador.receberDano(this.dano);

        if (!acertou)
            return 0;

        this.ultimoAtaque = Date.now();

        return this.pontosAoBater;

    }

    draw(ctx) {

        if (this.morto) {
            return;
        }

        if (this.tempoGlitch && this.tempoGlitch > 0) {
            ctx.save();
            for (let i = 0; i < 3; i++) {
                ctx.globalAlpha = 0.25 + Math.random() * 0.25;
                const offsetX = (Math.random() - 0.5) * 35;
                const offsetY = (Math.random() - 0.5) * 12;
                this.animacao.draw(
                    ctx,
                    this.x + offsetX,
                    this.y + offsetY,
                    this.largura,
                    this.altura
                );
            }
            ctx.restore();
        } else {
            this.animacao.draw(
                ctx,
                this.x,
                this.y,
                this.largura,
                this.altura
            );
        }

        ctx.fillStyle = "#222";
        ctx.fillRect(
            this.x,
            this.y - 10,
            this.largura,
            6
        );

        ctx.fillStyle = "#ff3333";
        ctx.fillRect(
            this.x,
            this.y - 10,
            (this.vida / this.vidaMaxima) * this.largura,
            6
        );

    }

    podeAtirarRanged() {
        const agora = Date.now();
        return (agora - this.ultimoAtaque) >= this.cooldownAtaque;
    }

    atirarRanged(jogador) {
        this.ultimoAtaque = Date.now();

        const origemX = this.x;
        const origemY = this.y + this.altura / 2 - 8;

        const destinoX = jogador.x + jogador.largura / 2;
        const destinoY = jogador.y + jogador.altura / 2;

        const dx = destinoX - origemX;
        const dy = destinoY - origemY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        const velocidadeBase = 5;
        const vx = (dx / dist) * velocidadeBase;
        const vy = (dy / dist) * velocidadeBase;

        if (this.enemyConfig.comportamentoEspecial === "vera") {
            const cores = ["#ff00ff", "#00ffff", "#ff007f", "#39ff14"];
            const codigos = [
                "FATAL ERROR",
                "BUG FOUND",
                "BREAKPOINT",
                "SEGFAULT",
                "OUT OF MEMORY",
                "SYSTEM CRASH",
                "CRITICAL EXCEPTION",
                "Stack Overflow"
            ];

            const angulos = [-0.15, 0, 0.15];

            angulos.forEach(angulo => {
                const cos = Math.cos(angulo);
                const sin = Math.sin(angulo);
                const rx = vx * cos - vy * sin;
                const ry = vx * sin + vy * cos;

                const cor = cores[Math.floor(Math.random() * cores.length)];
                const texto = codigos[Math.floor(Math.random() * codigos.length)];

                Inimigo.projeteis.push({
                    x: origemX,
                    y: origemY,
                    largura: 100,
                    altura: 16,
                    velocidade: rx,
                    velocidadeY: ry,
                    dano: this.dano,
                    cor: cor,
                    texto: texto,
                    ativo: true
                });
            });

            Audio$.tocarSFX("tiro");
        } else {
            const codigos = [
                "const err = null;",
                "while(true) {}",
                "Segmentation Fault",
                "NullPointerException",
                "IndexOutOfBounds",
                "SyntaxError: unexpected token",
                "undefined is not a function",
                "NaN",
                "return false;",
                "throw new Error();"
            ];
            const texto = codigos[Math.floor(Math.random() * codigos.length)];

            Inimigo.projeteis.push({
                x: origemX,
                y: origemY,
                largura: 80,
                altura: 16,
                velocidade: vx,
                velocidadeY: vy,
                dano: this.dano,
                cor: "#39ff14",
                texto: texto,
                ativo: true
            });
        }
    }

    static updateProjeteis(deltaTime, jogador) {
        if (!Inimigo.projeteis) return;
        Inimigo.projeteis.forEach(p => {
            p.x += p.velocidade;
            p.y += p.velocidadeY;

            // Spawn trails with 40% probability
            if (p.ativo && Math.random() < 0.4) {
                const trailChar = Math.random() < 0.5 ? "0" : "1";
                Efeitos.criarRastro(
                    p.x,
                    p.y + p.altura / 2,
                    p.cor,
                    trailChar
                );
            }

            if (p.ativo && jogador && !jogador.morto) {
                const colidiu =
                    p.x < jogador.x + jogador.largura &&
                    p.x + p.largura > jogador.x &&
                    p.y < jogador.y + jogador.altura &&
                    p.y + p.altura > jogador.y;

                if (colidiu) {
                    const tomouDano = jogador.receberDano(p.dano);
                    if (tomouDano) {
                        Audio$.tocarSFX("hit");
                    }
                    Efeitos.criarSplash(
                        jogador.x + jogador.largura / 2,
                        jogador.y + jogador.altura / 2,
                        p.cor
                    );
                    p.ativo = false;
                }
            }

            if (p.x < -150 || p.x > 1500 || p.y < -100 || p.y > 800) {
                p.ativo = false;
            }
        });
        Inimigo.projeteis = Inimigo.projeteis.filter(p => p.ativo);
    }

    static drawProjeteis(ctx) {
        if (!Inimigo.projeteis) return;
        Inimigo.projeteis.forEach(p => {
            ctx.save();
            ctx.font = "bold 15px monospace";
            ctx.textBaseline = "middle";

            // 1. Brilho externo colorido
            ctx.shadowColor = p.cor;
            ctx.shadowBlur = 10;
            ctx.fillStyle = p.cor;
            ctx.fillText(
                p.texto,
                p.x,
                p.y + p.altura / 2
            );

            // 2. Núcleo branco intenso
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#ffffff";
            ctx.fillText(
                p.texto,
                p.x,
                p.y + p.altura / 2
            );

            ctx.restore();
        });
    }

}
