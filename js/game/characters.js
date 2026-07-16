const CHARACTERS = {
    larissa: {
        nome: 'Larissa',
        vida: 100,
        velocidade: 5,
        ataquePrimario: { tipo: 'projectile', dano: 20, cooldown: 500, projetil: 'codigoBinario', cor: '#00f5ff', largura: 70, altura: 18, velocidade: 10 },
        habilidadeEspecial: { tipo: 'chuvaCodigo', dano: 15, quantidade: 8, cooldown: 8000 }
    },
    ueslei: {
        nome: 'Ueslei', vida: 100, velocidade: 5,
        ataquePrimario: { tipo: 'projectile', dano: 20, cooldown: 500, projetil: 'codigoBinario', cor: '#00f5ff', largura: 70, altura: 18, velocidade: 10 },
        habilidadeEspecial: { tipo: 'chuvaCodigo', dano: 15, quantidade: 8, cooldown: 8000 }
    },
    jair: {
        nome: 'Jair', vida: 100, velocidade: 5,
        ataquePrimario: { tipo: 'projectile', dano: 20, cooldown: 500, projetil: 'codigoBinario', cor: '#00f5ff', largura: 70, altura: 18, velocidade: 10 },
        habilidadeEspecial: { tipo: 'chuvaCodigo', dano: 15, quantidade: 8, cooldown: 8000 }
    },
    eliel: {
        nome: 'Eliel', vida: 100, velocidade: 5,
        ataquePrimario: { tipo: 'projectile', dano: 20, cooldown: 500, projetil: 'codigoBinario', cor: '#00f5ff', largura: 70, altura: 18, velocidade: 10 },
        habilidadeEspecial: { tipo: 'chuvaCodigo', dano: 15, quantidade: 8, cooldown: 8000 }
    },
    sandra: {
        nome: 'Prof-Sandra', vida: 120, velocidade: 4,
        ataquePrimario: { tipo: 'projectile', dano: 25, cooldown: 600, projetil: 'codigoBinario', cor: '#ff0000', largura: 70, altura: 18, velocidade: 8 },
        habilidadeEspecial: { tipo: 'chuvaCodigo', dano: 20, quantidade: 10, cooldown: 10000 }
    },
    janice: {
        nome: 'Janice', vida: 90, velocidade: 6,
        ataquePrimario: { tipo: 'projectile', dano: 15, cooldown: 400, projetil: 'codigoBinario', cor: '#ff00ff', largura: 70, altura: 18, velocidade: 12 },
        habilidadeEspecial: { tipo: 'chuvaCodigo', dano: 10, quantidade: 12, cooldown: 6000 }
    }
};
export default CHARACTERS;
