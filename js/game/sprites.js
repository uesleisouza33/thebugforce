const SPRITES = {

    larissa: {

        src: "../assets/game/personagens/larissa.png",

        width: 66,
        height: 112,

        frameWidth: 66,
        frameHeight: 112,

        animations: {

            idle: {
                row: 0
            },

            walk: {
                row: 1,
                frames: 5,
                speed: 150
            }
        }
    },

    ueslei: {
        src: "../assets/game/personagens/ueslei.png",
        width: 71,
        height: 112,
        frameWidth: 142,
        frameHeight: 225,
        animations: {
            idle: { row: 0 },
            walk: { row: 0, frames: 4, speed: 150 }
        }
    },

    jair: {
        src: "../assets/game/personagens/jair.png",
        width: 70,
        height: 112,
        frameWidth: 138,
        frameHeight: 222,
        animations: {
            idle: { row: 0 },
            walk: { row: 0, frames: 5, speed: 150 }
        }
    },

    eliel: {
        src: "../assets/game/personagens/eliel.png",
        width: 71,
        height: 112,
        frameWidth: 126,
        frameHeight: 199,
        animations: {
            idle: { row: 0 },
            walk: { row: 0, frames: 4, speed: 150 }
        }
    },

    sandra: {
        src: "../assets/game/personagens/sandra.png",
        width: 69,
        height: 112,
        frameWidth: 161,
        frameHeight: 261,
        animations: {
            idle: { row: 0 },
            walk: { row: 0, frames: 4, speed: 150 }
        }
    },

    janice: {
        src: "../assets/game/personagens/janice.png",
        width: 66,
        height: 112,
        frameWidth: 66,
        frameHeight: 112,
        animations: {
            idle: { row: 0 },
            walk: { row: 1, frames: 5, speed: 150 }
        }
    },


    profEdu: {

        src: "../assets/game/inimigos/prof_edu/prof_edu_walk.png",

        // Tamanho REAL do frame na imagem
        frameWidth: 370,
        frameHeight: 695,

        // Tamanho que será desenhado no jogo
        width: 80,
        height: 160,

        animations: {
            walk: {
                row: 0,
                frames: 4,
                speed: 120
            }
        }

    },
    profWendel: {

        src: "../assets/game/inimigos/prof_wendel/wendel.png",

        // Tamanho REAL do frame na imagem
        frameWidth: 68,
        frameHeight: 127,

        // Tamanho que será desenhado no jogo
        width: 80,
        height: 160,

        animations: {
            walk: {
                row: 0,
                frames: 4,
                speed: 120
            }
        }

    },
    juliana: {

        src: "../assets/game/inimigos/juliana/juliana.png",

        // Tamanho REAL do frame na imagem
        frameWidth: 416,
        frameHeight: 688,

        // Tamanho que será desenhado no jogo
        width: 80,
        height: 132,

        animations: {
            walk: {
                row: 0,
                frames: 4,
                speed: 100
            }
        }

    },
    profCarlos: {

        src: "../assets/game/inimigos/carlos.png",

        // Tamanho REAL do frame na imagem
        frameWidth: 512,
        frameHeight: 741,

        // Tamanho que será desenhado no jogo
        width: 160,
        height: 232,

        animations: {
            walk: {
                row: 0,
                frames: 3,
                speed: 100
            }
        }

    },
    vera: {

        src: "../assets/game/inimigos/vera.png",

        // Tamanho REAL do frame na imagem
        frameWidth: 365,
        frameHeight: 608,

        // Tamanho que será desenhado no jogo
        width: 120,
        height: 200,

        animations: {
            walk: {
                row: 0,
                frames: 1,
                speed: 100
            }
        }

    },
    item_amuleto: {
        src: "../assets/game/items/amuletop.webp",
        width: 32,
        height: 32,
        frameWidth: 32,
        frameHeight: 32,
        animations: {
            idle: { row: 0, frames: 1, speed: 100 }
        }
    }

};

export default SPRITES;
