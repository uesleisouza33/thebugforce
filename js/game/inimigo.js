import Entidade from "./entidade.js";
import Animacao from "./animacao.js";

export default class Inimigo extends Entidade {

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

        if (!this.atacando) {

            this.x -= this.velocidade;

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
                x: this.x + this.largura / 2 - 12,
                y: this.y + this.altura - 24,
                largura: 24,
                altura: 24,
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

            // Desenha o drop no chão se existir
            if (this.drop && this.drop.ativo) {

                ctx.save();

                ctx.shadowColor = "#ffd700";
                ctx.shadowBlur = 12;

                ctx.font = "22px serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                ctx.fillText(
                    "🔮",
                    this.drop.x + this.drop.largura / 2,
                    this.drop.y + this.drop.altura / 2
                );

                ctx.restore();

            }

            return;

        }

        this.animacao.draw(
            ctx,
            this.x,
            this.y,
            this.largura,
            this.altura
        );

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

}
