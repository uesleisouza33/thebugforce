export default class Animacao {

    constructor(spriteSheet, frameWidth, frameHeight) {

        this.spriteSheet = spriteSheet;

        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;

        this.animacoes = {};

        this.animacaoAtual = null;

        this.frameAtual = 0;
        this.frameTimer = 0;
    }

    adicionar(nome, config) {
        this.animacoes[nome] = {
            row: config.row,
            frames: config.frames,
            speed: config.speed || 100,
            loop: config.loop ?? true
        };

        if (!this.animacaoAtual) {
            this.animacaoAtual = nome;
        }
    }

    tocar(nome) {

        if (this.animacaoAtual === nome) return;

        this.animacaoAtual = nome;
        this.frameAtual = 0;
        this.frameTimer = 0;
    }

    update(deltaTime) {

        const anim = this.animacoes[this.animacaoAtual];

        if (!anim) return;

        this.frameTimer += deltaTime;

        if (this.frameTimer >= anim.speed) {

            this.frameTimer = 0;
            this.frameAtual++;

            if (this.frameAtual >= anim.frames) {

                if (anim.loop) {
                    this.frameAtual = 0;
                } else {
                    this.frameAtual = anim.frames - 1;
                }
            }
        }
    }

    draw(
        ctx,
        x,
        y,
        largura,
        altura,
        invertido = false
    ) {

        const anim = this.animacoes[this.animacaoAtual];

        if (!anim) return;

        const sx = this.frameAtual * this.frameWidth;
        const sy = anim.row * this.frameHeight;

        ctx.save();

        if (invertido) {

            ctx.translate(x + largura, y);
            ctx.scale(-1, 1);

            ctx.drawImage(
                this.spriteSheet,
                sx,
                sy,
                this.frameWidth,
                this.frameHeight,
                0,
                0,
                largura,
                altura
            );

        } else {

            ctx.drawImage(
                this.spriteSheet,
                sx,
                sy,
                this.frameWidth,
                this.frameHeight,
                x,
                y,
                largura,
                altura
            );
        }

        ctx.restore();
    }
}