export default class Attack {

    constructor(config) {

        this.config = config;

        this.cooldown = config.cooldown || 0;
        this.ultimoAtaque = 0;
        this.projeteis = [];

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

        return {
            x:
                jogador.direcao === 1
                    ? jogador.x + jogador.largura
                    : jogador.x - largura,
            y: jogador.y + jogador.altura / 2 - altura / 2,
            largura,
            altura,
            velocidade: velocidade * jogador.direcao,
            velocidadeY: 0,
            dano: this.config.dano || 10,
            cor: this.config.cor || "#00f5ff",
            texto: this.config.texto || "010101",
            ativo: true
        };

    }

    criarProjetilAngulado(jogador, angulo) {

        const largura = this.config.largura || 18;
        const altura = this.config.altura || 8;
        const velocidade = this.config.velocidade || 10;

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
            dano: this.config.dano || 10,
            cor: this.config.cor || "#ffd700",
            texto: this.config.texto || "010101",
            ativo: true
        };

    }

    update() {

        this.projeteis.forEach(projetil => {

            projetil.x += projetil.velocidade;
            projetil.y += projetil.velocidadeY || 0;

            if (
                projetil.x > 1400 ||
                projetil.x + projetil.largura < -100
            ) {

                projetil.ativo = false;

            }

        });

        this.projeteis = this.projeteis.filter(projetil => {

            return projetil.ativo;

        });

    }

    draw(ctx) {

        this.projeteis.forEach(projetil => {

            ctx.save();

            ctx.font = "16px monospace";
            ctx.textBaseline = "middle";
            ctx.shadowColor = projetil.cor;
            ctx.shadowBlur = 8;

            ctx.fillStyle = projetil.cor;
            ctx.fillText(
                projetil.texto,
                projetil.x,
                projetil.y + projetil.altura / 2
            );

            ctx.restore();

        });

    }

    verificarColisoes(inimigos) {

        let pontos = 0;

        this.projeteis.forEach(projetil => {

            if (!projetil.ativo)
                return;

            for (const inimigo of inimigos) {

                if (inimigo.morto)
                    continue;

                const colidiu =
                    projetil.x < inimigo.x + inimigo.largura &&
                    projetil.x + projetil.largura > inimigo.x &&
                    projetil.y < inimigo.y + inimigo.altura &&
                    projetil.y + projetil.altura > inimigo.y;

                if (colidiu) {

                    pontos += inimigo.receberDano(projetil.dano);
                    projetil.ativo = false;
                    break;

                }

            }

        });

        this.projeteis = this.projeteis.filter(projetil => {

            return projetil.ativo;

        });

        return pontos;

    }

}
