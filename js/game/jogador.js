import Entidade from "./entidade.js";
import Animacao from "./animacao.js";

const ESTADOS_JOGADOR = {
    IDLE: "IDLE",
    WALK: "WALK",
    SHOOT: "SHOOT",
    HURT: "HURT",
    DEAD: "DEAD"
};

export default class Jogador extends Entidade {

    constructor(x, y, config) {

        super(
            x,
            y,
            config.width,
            config.height,
            config.image
        );

        this.config = config;

        this.direcao = 1;
        this.velocidade = 5;

        this.movendo = false;
        this.estado = ESTADOS_JOGADOR.IDLE;
        this.solicitacoesTiro = [];

        this.animacao = new Animacao(
            config.image,
            config.frameWidth,
            config.frameHeight
        );

        this.vidaMaxima = 100;
        this.vida = this.vidaMaxima;

        this.invencivel = false;
        this.tempoInvencivel = 1000; // 1 segundo

        this.morto = false;

        Object.entries(config.animations).forEach(([nome, dados]) => {

            this.animacao.adicionar(nome, dados);

        });

        this.animacao.tocar("walk");

        // Começa parado no primeiro frame
        this.animacao.parar();

    }

    update(deltaTime) {

        if (this.morto)
            return;

        if (this.estado === ESTADOS_JOGADOR.SHOOT || this.movendo) {
            this.animacao.update(deltaTime);
        }

        this.processarEventosAnimacao();

        if (this.estado === ESTADOS_JOGADOR.SHOOT && this.animacao.terminou()) {
            this.finalizarTiro();
        }

        if (this.invencivel) {

            this.tempoInvencivel -= deltaTime;

            if (this.tempoInvencivel <= 0) {

                this.invencivel = false;
                this.tempoInvencivel = 1000;

            }

        }

    }

    mover(teclas) {

        if (this.morto || this.estado === ESTADOS_JOGADOR.SHOOT)
            return;

        this.movendo = false;

        if (teclas["a"]) {
            this.x -= this.velocidade;
            this.direcao = -1;
            this.movendo = true;
        }

        if (teclas["d"]) {
            this.x += this.velocidade;
            this.direcao = 1;
            this.movendo = true;
        }

        if (teclas["w"]) {
            this.y -= this.velocidade;
            this.movendo = true;
        }

        if (teclas["s"]) {
            this.y += this.velocidade;
            this.movendo = true;
        }

        // Limites da fase
        // Limites da fase
        this.x = Math.max(-5, this.x);
        this.x = Math.min(400, this.x);

        this.y = Math.max(355, this.y);
        this.y = Math.min(600, this.y);

        if (this.movendo) {
            this.definirEstado(ESTADOS_JOGADOR.WALK);
            this.animacao.tocar("walk");
        } else {
            this.definirEstado(ESTADOS_JOGADOR.IDLE);
            this.animacao.tocar("walk");
            this.animacao.parar();
        }
    }

    receberDano(dano = 10) {

        if (this.invencivel || this.morto)
            return;

        this.vida -= dano;

        if (this.vida < 0)
            this.vida = 0;

        this.invencivel = true;

        this.definirEstado(ESTADOS_JOGADOR.HURT);

        if (this.config.animations.hurt) {
            this.animacao.tocar("hurt", true);
        }

        if (this.vida <= 0) {

            this.morto = true;
            this.definirEstado(ESTADOS_JOGADOR.DEAD);

        }

    }

    curar(valor = 20) {

        this.vida += valor;

        if (this.vida > this.vidaMaxima) {

            this.vida = this.vidaMaxima;

        }

    }

    atirar() {

        if (
            this.morto ||
            this.estado === ESTADOS_JOGADOR.SHOOT ||
            !this.config.animations.shoot
        ) {
            return;
        }

        this.definirEstado(ESTADOS_JOGADOR.SHOOT);
        this.animacao.tocar("shoot", true);

    }

    processarEventosAnimacao() {

        const eventos = this.animacao.consumirEventos();

        eventos.forEach(evento => {

            if (evento.nome === "shoot") {
                this.solicitacoesTiro.push(this.criarDadosTiro());
            }

        });

    }

    consumirSolicitacoesTiro() {

        const solicitacoes = [...this.solicitacoesTiro];

        this.solicitacoesTiro = [];

        return solicitacoes;

    }

    criarDadosTiro() {

        const x = this.direcao === 1
            ? this.x + this.largura
            : this.x - 18;

        return {
            x,
            y: this.y + (this.altura * 0.45),
            direcao: this.direcao
        };

    }

    finalizarTiro() {

        if (this.movendo) {
            this.definirEstado(ESTADOS_JOGADOR.WALK);
            this.animacao.tocar("walk", true);
            return;
        }

        this.definirEstado(ESTADOS_JOGADOR.IDLE);
        this.animacao.tocar("walk");
        this.animacao.parar();

    }

    definirEstado(estado) {

        this.estado = estado;

    }

    draw(ctx) {

        this.animacao.draw(
            ctx,
            this.x,
            this.y,
            this.largura,
            this.altura,
            this.direcao === -1
        );

        if (this.invencivel) {

            if (Math.floor(Date.now() / 80) % 2 === 0)
                return;

        }

    }

}