const ENEMIES = {

    profEdu: {

        vida: 120,
        velocidade: 1.4,
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

        vida: 90,
        velocidade: 1.8,
        dano: 8,
        alcanceAtaque: 15,
        cooldownAtaque: 800,

        pontosAoMatar: 15,
        pontosAoBater: -3,
        pontosAoPassar: -8,

        chanceDrop: 0.25,

        tipo: "enemy"

    },

    juliana: {

        vida: 120,
        velocidade: 1.4,
        dano: 10,
        alcanceAtaque: 20,
        cooldownAtaque: 1000,

        pontosAoMatar: 20,
        pontosAoBater: -5,
        pontosAoPassar: -10,

        chanceDrop: 0.3,

        tipo: "enemy"

    },

    profCarlos: {

        vida: 150,
        velocidade: 0,
        dano: 15,
        alcanceAtaque: 30,
        cooldownAtaque: 1500,

        pontosAoMatar: 30,
        pontosAoBater: -5,
        pontosAoPassar: 0,

        chanceDrop: 1.0,

        tipo: "enemy",
        tipoAtaque: "ranged"

    },

    vera: {

        vida: 300,
        velocidade: 0,
        dano: 20,
        alcanceAtaque: 30,
        cooldownAtaque: 1200,

        pontosAoMatar: 250,
        pontosAoBater: -10,
        pontosAoPassar: 0,

        chanceDrop: 1.0,

        tipo: "enemy",
        tipoAtaque: "ranged",
        comportamentoEspecial: "vera"

    }

};

export default ENEMIES;
