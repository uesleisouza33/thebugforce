export default class Efeitos {
    static particulas = [];

    static criarSplash(x, y, cor) {
        const quantidade = 12;
        const chars = ["0", "1", ";", "{", "}", "+", "-", "*"];
        for (let i = 0; i < quantidade; i++) {
            const angulo = Math.random() * Math.PI * 2;
            const velocidade = 2 + Math.random() * 4;
            Efeitos.particulas.push({
                x,
                y,
                vx: Math.cos(angulo) * velocidade,
                vy: Math.sin(angulo) * velocidade,
                alpha: 1.0,
                vida: 400 + Math.random() * 200,
                vidaMaxima: 600,
                cor,
                texto: chars[Math.floor(Math.random() * chars.length)],
                tamanho: 10 + Math.random() * 8
            });
        }
    }

    static criarRastro(x, y, cor, texto) {
        Efeitos.particulas.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            alpha: 0.6,
            vida: 300,
            vidaMaxima: 300,
            cor,
            texto,
            tamanho: 12
        });
    }

    static update(deltaTime) {
        Efeitos.particulas.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vida -= deltaTime;
            p.alpha = Math.max(0, p.vida / p.vidaMaxima);
        });
        Efeitos.particulas = Efeitos.particulas.filter(p => p.vida > 0);
    }

    static draw(ctx) {
        Efeitos.particulas.forEach(p => {
            ctx.save();
            ctx.font = `${p.tamanho}px monospace`;
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.globalAlpha = p.alpha;
            ctx.shadowColor = p.cor;
            ctx.shadowBlur = 6;
            ctx.fillStyle = p.cor;
            ctx.fillText(p.texto, p.x, p.y);
            ctx.restore();
        });
    }
}
