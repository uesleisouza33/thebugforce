import Entidade from "./entidade.js";
import Animacao from "./animacao.js";

export default class Inimigo extends Entidade {

    constructor(canvasWidth, canvasHeight, spriteSheet) {

        super(
            canvasWidth + 100,
            canvasHeight - 220,
            90,
            170,
            spriteSheet
        );

        this.velocidade = 2;
        this.derrotado = false;

        this.animacao = new Animacao(
            spriteSheet,
            370,
            695
        );

        this.animacao.adicionar("walk", {
            row: 0,
            frames: 4,
            speed: 200
        });

        this.animacao.adicionar("hurt", {
            row: 1,
            frames: 4,
            speed: 100,
            loop: false
        });

        this.animacao.tocar("walk");
    }

    update(deltaTime) {

        this.x -= this.velocidade;

        this.animacao.update(deltaTime);

    }

    receberDano() {

        this.animacao.tocar("hurt");

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