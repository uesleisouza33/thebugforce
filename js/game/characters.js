const CHARACTERS = {
    larissa: {
        nome: 'Larissa',
        vida: 200,
        velocidade: 4,
        ataquePrimario: { tipo: 'projectile', dano: 20, cooldown: 500, projetil: 'codigoBinario', cor: '#ff3333', largura: 70, altura: 18, velocidade: 10 },
        habilidadeEspecial: { tipo: 'lideranca', cooldown: 10000 }
    },
    ueslei: {
        nome: 'Ueslei', vida: 200, velocidade: 4,
        ataquePrimario: { tipo: 'projectile', dano: 20, cooldown: 500, projetil: 'codigoBinario', cor: '#3399ff', largura: 70, altura: 18, velocidade: 10 },
        habilidadeEspecial: { tipo: 'precisao', cooldown: 12000 }
    },
    jair: {
        nome: 'Jair', vida: 200, velocidade: 4,
        ataquePrimario: { tipo: 'projectile', dano: 20, cooldown: 500, projetil: 'codigoBinario', cor: '#33ff33', largura: 70, altura: 18, velocidade: 10 },
        habilidadeEspecial: { tipo: 'superDano', cooldown: 12000 }
    },
    eliel: {
        nome: 'Eliel', vida: 200, velocidade: 4,
        ataquePrimario: { tipo: 'projectile', dano: 20, cooldown: 500, projetil: 'codigoBinario', cor: '#ffff00', largura: 70, altura: 18, velocidade: 10 },
        habilidadeEspecial: { tipo: 'chicotada', dano: 50, cooldown: 8000 }
    },
    sandra: {
        nome: 'Prof-Sandra', vida: 240, velocidade: 3.5,
        ataquePrimario: { tipo: 'projectile', dano: 25, cooldown: 600, projetil: 'codigoBinario', cor: '#ff9900', largura: 70, altura: 18, velocidade: 8 },
        habilidadeEspecial: { tipo: 'chuvaLivros', dano: 30, cooldown: 10000 }
    },
    janice: {
        nome: 'Janice', vida: 180, velocidade: 4.8,
        ataquePrimario: { tipo: 'projectile', dano: 15, cooldown: 400, projetil: 'codigoBinario', cor: '#ff33ff', largura: 70, altura: 18, velocidade: 12 },
        habilidadeEspecial: { tipo: 'superSoco', dano: 80, cooldown: 7000 }
    }
};
export default CHARACTERS;
