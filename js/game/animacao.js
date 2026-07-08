export default class Animacao {

    constructor(spriteSheet, frameWidth, frameHeight) {

        this.spriteSheet = spriteSheet;

        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;

        this.animacoes = {};

        this.animacaoAtual = null;

        this.frameAtual = 0;
        this.frameTimer = 0;

        this.finalizada = false;
        this.eventosDisparados = new Set();
        this.eventosPendentes = [];
    }

    adicionar(nome, config) {
        this.animacoes[nome] = {
            row: config.row || 0,
            frames: config.frames || 1,
            speed: config.speed || 100,
            loop: config.loop ?? true,
            events: config.events || {}
        };

        if (!this.animacaoAtual) {
            this.animacaoAtual = nome;
        }
    }

    parar() {

        this.frameAtual = 0;
        this.frameTimer = 0;
        this.finalizada = false;
        this.eventosDisparados.clear();
        this.eventosPendentes = [];

    }

    tocar(nome, reiniciar = false) {

        if (this.animacaoAtual === nome && !reiniciar) return;

        this.animacaoAtual = nome;
        this.frameAtual = 0;
        this.frameTimer = 0;
        this.finalizada = false;
        this.eventosDisparados.clear();
        this.eventosPendentes = [];

        this.dispararEventosDoFrameAtual();
    }

    update(deltaTime) {

        const anim = this.animacoes[this.animacaoAtual];

        if (!anim || this.finalizada) return;

        this.frameTimer += deltaTime;

        while (this.frameTimer >= anim.speed && !this.finalizada) {

            this.frameTimer -= anim.speed;
            this.frameAtual++;

            if (this.frameAtual >= anim.frames) {

                if (anim.loop) {
                    this.frameAtual = 0;
                    this.eventosDisparados.clear();
                } else {
                    this.frameAtual = anim.frames - 1;
                    this.finalizada = true;
                }
            }

            this.dispararEventosDoFrameAtual();
        }
    }

    dispararEventosDoFrameAtual() {

        const anim = this.animacoes[this.animacaoAtual];

        if (!anim) return;

        const evento = anim.events[this.frameAtual];

        if (!evento || this.eventosDisparados.has(this.frameAtual)) return;

        this.eventosPendentes.push({
            nome: evento,
            frame: this.frameAtual,
            animacao: this.animacaoAtual
        });

        this.eventosDisparados.add(this.frameAtual);

    }

    consumirEventos() {

        const eventos = [...this.eventosPendentes];

        this.eventosPendentes = [];

        return eventos;

    }

    terminou() {

        return this.finalizada;

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
