import Entidade from "./entidade.js";
import Animacao from "./animacao.js";
import Attack from "./combat/attack.js";

export default class Jogador extends Entidade {

    constructor(
        x,
        y,
        spriteConfig,
        characterConfig
    ) {

        super(
            x,
            y,
            spriteConfig.width,
            spriteConfig.height,
            spriteConfig.image
        );

        // Configurações
        this.spriteConfig = spriteConfig;
        this.characterConfig = characterConfig;

        // Gameplay
        this.direcao = 1;
        this.movendo = false;
        this.morto = false;
        this.primaryAttack =
            new Attack(
                characterConfig.ataquePrimario
            );

        this.specialAbility =
            characterConfig.habilidadeEspecial;

        this.specialAttack =
            new Attack(
                characterConfig.habilidadeEspecial
            );

        this.velocidade = characterConfig.velocidade;

        this.vidaMaxima = characterConfig.vida;
        this.vida = this.vidaMaxima;

        this.invencivel = false;
        this.tempoInvencivel = 1000;

        // Animação
        this.animacao = new Animacao(
            spriteConfig.image,
            spriteConfig.frameWidth,
            spriteConfig.frameHeight
        );

        Object.entries(spriteConfig.animations).forEach(([nome, dados]) => {
            this.animacao.adicionar(nome, dados);
        });

        this.animacao.tocar("walk");
        this.animacao.parar();
    }

    update(deltaTime) {

        if (this.morto)
            return;

        this.primaryAttack.update(deltaTime);
        this.specialAttack.update(deltaTime);

        if (this.movendo) {
            this.animacao.update(deltaTime);
        }

        if (this.invencivel) {

            this.tempoInvencivel -= deltaTime;

            if (this.tempoInvencivel <= 0) {

                this.invencivel = false;
                this.tempoInvencivel = 1000;

            }

        }

    }

    atacar() {

        if (this.morto)
            return;

        if (this.spriteConfig.animations.shoot) {

            this.animacao.tocar("shoot");

        }

        this.primaryAttack.executar(this);

    }

    usarHabilidade() {

        if (this.morto)
            return;

        this.specialAttack.executar(this);

    }

    verificarAtaques(inimigos) {

        let pontos = 0;
        pontos += this.primaryAttack.verificarColisoes(inimigos);
        pontos += this.specialAttack.verificarColisoes(inimigos);
        return pontos;

    }

    mover(teclas) {

        if (this.morto)
            return;

        this.movendo = false;

        if (teclas["a"] || teclas["arrowleft"]) {

            this.x -= this.velocidade;
            this.direcao = -1;
            this.movendo = true;

        }

        if (teclas["d"] || teclas["arrowright"]) {

            this.x += this.velocidade;
            this.direcao = 1;
            this.movendo = true;

        }

        if (teclas["w"] || teclas["arrowup"]) {

            this.y -= this.velocidade;
            this.movendo = true;

        }

        if (teclas["s"] || teclas["arrowdown"]) {

            this.y += this.velocidade;
            this.movendo = true;

        }

        // Limites da fase
        this.x = Math.max(-5, this.x);
        this.x = Math.min(400, this.x);

        this.y = Math.max(355, this.y);
        this.y = Math.min(600, this.y);

        if (this.movendo) {

            this.animacao.tocar("walk");

        } else {

            this.animacao.parar();

        }

    }

    receberDano(dano = 10) {

        if (this.invencivel || this.morto)
            return false;

        this.vida -= dano;

        if (this.vida < 0)
            this.vida = 0;

        this.invencivel = true;

        if (this.spriteConfig.animations.hurt) {

            this.animacao.tocar("hurt");

        }

        if (this.vida <= 0) {

            this.morto = true;

        }

        return true;

    }

    curar(valor = 20) {

        this.vida += valor;

        if (this.vida > this.vidaMaxima) {

            this.vida = this.vidaMaxima;

        }

    }

    draw(ctx) {

        this.primaryAttack.draw(ctx);
        this.specialAttack.draw(ctx);

        // Pisca quando está invencível
        if (this.invencivel) {

            if (Math.floor(Date.now() / 80) % 2 === 0)
                return;

        }

        this.animacao.draw(
            ctx,
            this.x,
            this.y,
            this.largura,
            this.altura,
            this.direcao === -1
        );

    }

}
