const CHARACTERS = {

    larissa: {

        nome: "Larissa",

        vida: 100,
        velocidade: 5,

        ataquePrimario: {

            tipo: "projectile",

            dano: 20,

            cooldown: 500,

            projetil: "codigoBinario",

            cor: "#00f5ff",
            largura: 70,
            altura: 18,
            velocidade: 10

        },

        habilidadeEspecial: {

            tipo: "chuvaCodigo",

            dano: 15,

            quantidade: 8,

            cooldown: 8000

        }

    }

};

export default CHARACTERS;
