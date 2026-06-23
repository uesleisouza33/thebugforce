import Entidade from "./entidade.js";
import Animacao from "./animacao.js";

export default class Jogador extends Entidade {

    constructor(spriteSheet) {

        super(
            100,
            400,
            64,
            64,
            spriteSheet
        );

        this.direcao = 1;
        this.velocidade = 5;

        this.animacao = new Animacao(
            spriteSheet,
            64,
            64
        );

        this.animacao.adicionar("walk", {
            row: 0,
            frames: 4,
            speed: 120
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

        this.animacao.update(deltaTime);

    }

    mover(teclas) {

        let movendo = false;

        if (teclas["a"]) {
            this.x -= this.velocidade;
            this.direcao = -1;
            movendo = true;
        }

        if (teclas["d"]) {
            this.x += this.velocidade;
            this.direcao = 1;
            movendo = true;
        }

        if (movendo) {
            this.animacao.tocar("walk");
        }

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
            this.altura,
            this.direcao === -1
        );

    }
}