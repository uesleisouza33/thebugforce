import Jogador from "./jogador.js";

export default class PlayerSpawner {

    constructor(config) {

        this.config = config;

        // Spawn padrão
        this.spawnX = 100;
        this.spawnY = 400;

    }

    spawn() {

        return new Jogador(
            this.spawnX,
            this.spawnY,
            this.config
        );

    }

    definirSpawn(x, y) {

        this.spawnX = x;
        this.spawnY = y;

    }

    

    getSpawn() {

        return {
            x: this.spawnX,
            y: this.spawnY
        };

    }

}