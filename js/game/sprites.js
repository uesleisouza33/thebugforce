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
            // ,

            // hurt: {
            //     row: 1,
            //     frames: 4,
            //     speed: 100,
            //     loop: false
            // }

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

    }

};

export default SPRITES;
