import Inimigo from "./inimigo.js";

export default class EnemySpawner {

    constructor(enemyConfigs, canvas) {

        this.enemyConfigs = enemyConfigs;
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

        // Contador de kills (inimigos mortos, não os que saíram da tela)
        this.kills = 0;

    }

    /**
     * Spawna um inimigo.
     * @param {number|null} x - Posição X. Aleatória se null.
     * @param {number|null} y - Posição Y. Aleatória se null.
     * @param {object|null} configOverride - Se informado, usa este config em vez de sortear.
     */
    spawn(x = null, y = null, configOverride = null) {

        // Usa override ou sorteia aleatoriamente
        const config = configOverride
            ? configOverride
            : this.enemyConfigs[
                Math.floor(Math.random() * this.enemyConfigs.length)
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
                config.spriteConfig,
                config.enemyConfig
            )
        );

    }

    update(deltaTime, jogador = null) {

        let pontos = 0;

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

            inimigo.update(deltaTime, jogador);

        });

        // Remove inimigos que saíram da tela ou morreram
        this.inimigos = this.inimigos.filter(inimigo => {

            if (inimigo.morto) {
                this.kills++;
                return false;
            }

            if (inimigo.x + inimigo.largura <= -50) {

                pontos += inimigo.pontosAoPassar;
                return false;

            }

            return true;

        });

        return pontos;

    }

    draw(ctx) {

        this.inimigos.forEach(inimigo => {

            inimigo.draw(ctx);

        });

    }

    verificarColisao(jogador) {

        for (const inimigo of this.inimigos) {

            if (inimigo.estaNoAlcance(jogador)) {

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
