import Projectile from "./projectile.js";

export default class ProjectileSpawner {

    constructor(canvas, config = {}) {

        this.canvas = canvas;
        this.config = config;
        this.projeteis = [];

    }

    criar(dadosTiro) {

        this.projeteis.push(
            new Projectile(
                dadosTiro.x,
                dadosTiro.y,
                dadosTiro.direcao,
                {
                    ...this.config,
                    ...dadosTiro.config
                }
            )
        );

    }

    update() {

        this.projeteis.forEach(projetil => {

            projetil.update();

        });

        this.projeteis = this.projeteis.filter(projetil => {

            return (
                projetil.x + projetil.largura >= 0 &&
                projetil.x <= this.canvas.width
            );

        });

    }

    draw(ctx) {

        this.projeteis.forEach(projetil => {

            projetil.draw(ctx);

        });

    }

    limpar() {

        this.projeteis = [];

    }

}
