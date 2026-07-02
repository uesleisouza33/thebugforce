import Entidade from "./entidade.js";
import Animacao from "./animacao.js";

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

        this.animacao = new Animacao(
            config.image,
            config.frameWidth,
            config.frameHeight
        );

        Object.entries(config.animations).forEach(([nome, dados]) => {

            this.animacao.adicionar(nome, dados);

        });

        this.animacao.tocar("walk");

        // Começa parado no primeiro frame
        this.animacao.parar();

    }

    update(deltaTime) {

        if (this.movendo) {
            this.animacao.update(deltaTime);
        }

    }

    mover(teclas) {

        this.movendo = false;

        if (teclas["a"]) {
            this.x -= this.velocidade;
            this.direcao = 1;
            this.movendo = true;
        }

        if (teclas["d"]) {
            this.x += this.velocidade;
            this.direcao = 1;
            this.movendo = true;
        }

        if (teclas["w"]) {
            this.y -= this.velocidade;
            this.direcao = 1;
            this.movendo = true;
        }

        if (teclas["s"]) {
            this.y += this.velocidade;
            this.direcao = 1;
            this.movendo = true;
        }

        // Limites da fase
        // Limites da fase
        this.x = Math.max(-5, this.x);
        this.x = Math.min(400, this.x);

        this.y = Math.max(355, this.y);
        this.y = Math.min(600, this.y);

        if (this.movendo) {
            this.animacao.tocar("walk");
        } else {
            this.animacao.parar();
        }
    }

    receberDano() {

        if (this.config.animations.hurt) {

            this.animacao.tocar("hurt");

        }

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

    }

}