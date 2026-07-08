import Jogador from "./jogador.js";

export default class PlayerSpawner {

    constructor(spriteConfig, characterConfig) {

        this.spriteConfig = spriteConfig;
        this.characterConfig = characterConfig;

        this.spawnX = 100;
        this.spawnY = 400;

    }

    spawn() {

        return new Jogador(
            this.spawnX,
            this.spawnY,
            this.spriteConfig,
            this.characterConfig
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