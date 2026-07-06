import Inimigo from "./inimigo.js";

export default class EnemySpawner {

    constructor(configs, canvas) {

        this.configs = configs;
        this.canvas = canvas;

        this.inimigos = [];

        this.tempoSpawn = 0;
        this.intervaloSpawn = 3000;

        this.ativo = true;

        // Área horizontal de spawn
        this.spawnMinX = canvas.width + 100;
        this.spawnMaxX = canvas.width + 400;

        // Área vertical de spawn
        this.spawnMinY = 420;
        this.spawnMaxY = 550;

    }

    spawn(x = null, y = null) {

        // Escolhe um personagem aleatório
        const config =
            this.configs[
            Math.floor(Math.random() * this.configs.length)
            ];

        // Posição X aleatória caso não seja informada
        if (x === null) {

            x =
                this.spawnMinX +
                Math.random() *
                (this.spawnMaxX - this.spawnMinX);

        }

        // Posição Y aleatória caso não seja informada
        if (y === null) {

            y =
                this.spawnMinY +
                Math.random() *
                (this.spawnMaxY - this.spawnMinY);

        }

        this.inimigos.push(
            new Inimigo(
                x,
                y,
                config
            )
        );

    }

    update(deltaTime) {

        if (this.ativo) {

            this.tempoSpawn += deltaTime;

            const ultimo =
                this.inimigos[this.inimigos.length - 1];

            const podeSpawnar =
                !ultimo ||
                ultimo.x < this.canvas.width - 200;

            if (
                this.tempoSpawn >= this.intervaloSpawn &&
                podeSpawnar
            ) {

                this.spawn();

                this.tempoSpawn = 0;

            }

        }

        this.inimigos.forEach(inimigo => {

            inimigo.update(deltaTime);

        });

        // Remove inimigos que saíram da tela
        this.inimigos = this.inimigos.filter(inimigo => {

            return inimigo.x + inimigo.largura > -50;

        });

    }

    draw(ctx) {

        this.inimigos.forEach(inimigo => {

            inimigo.draw(ctx);

        });

    }

    verificarColisao(jogador) {

        for (const inimigo of this.inimigos) {

            if (jogador.colideCom(inimigo)) {

                return inimigo;

            }

        }

        return null;

    }

    definirAreaSpawn(minX, maxX, minY, maxY) {

        this.spawnMinX = minX;
        this.spawnMaxX = maxX;

        this.spawnMinY = minY;
        this.spawnMaxY = maxY;

    }

    parar() {

        this.ativo = false;

    }

    iniciar() {

        this.ativo = true;

    }

    limpar() {

        this.inimigos = [];

    }

}