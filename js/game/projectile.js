import Entidade from "./entidade.js";

export default class Projectile extends Entidade {

    constructor(x, y, direcao, config = {}) {

        super(
            x,
            y,
            config.width || 18,
            config.height || 6,
            config.image || null
        );

        this.direcao = direcao;
        this.velocidade = config.velocidade || 9;
        this.cor = config.cor || "#ffe066";

    }

    update() {

        this.x += this.velocidade * this.direcao;

    }

    draw(ctx) {

        ctx.save();
        ctx.fillStyle = this.cor;
        ctx.fillRect(
            this.x,
            this.y,
            this.largura,
            this.altura
        );
        ctx.restore();

    }

}
