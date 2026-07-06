import Entidade from "./entidade.js";
import Animacao from "./animacao.js";

export default class Inimigo extends Entidade {

    constructor(x, y, config) {

        super(
            x,
            y,
            config.width,
            config.height,
            config.image
        );

        this.config = config;

        this.velocidade = 2;

        this.animacao = new Animacao(
            config.image,
            config.frameWidth,
            config.frameHeight
        );

        // Carrega todas as animações do sprites.js
        Object.entries(config.animations).forEach(([nome, dados]) => {

            this.animacao.adicionar(nome, dados);

        });

        // Animação inicial
        if (config.animations.walk) {
            this.animacao.tocar("walk");
        }

    }

    update(deltaTime) {

        this.x -= this.velocidade;

        this.animacao.update(deltaTime);

    }

    draw(ctx) {

        this.animacao.draw(
            ctx,
            this.x,
            this.y,
            this.largura,
            this.altura
        );

    }

}