const ENEMIES = {

    profEdu: {

        vida: 80,
        velocidade: 2,
        dano: 10,
        alcanceAtaque: 20,
        cooldownAtaque: 1000,

        pontosAoMatar: 20,
        pontosAoBater: -5,
        pontosAoPassar: -10,

        chanceDrop: 0.3,

        tipo: "enemy"

    },

    profWendel: {

        vida: 50,
        velocidade: 3,
        dano: 8,
        alcanceAtaque: 15,
        cooldownAtaque: 800,

        pontosAoMatar: 15,
        pontosAoBater: -3,
        pontosAoPassar: -8,

        chanceDrop: 0.25,

        tipo: "enemy"

    }

};

export default ENEMIES;
