export default class Attack {

    constructor(config) {

        this.config = config;

        this.cooldown = config.cooldown || 0;
        this.ultimoAtaque = 0;

    }

    podeAtacar() {

        const agora = Date.now();

        return (agora - this.ultimoAtaque) >= this.cooldown;

    }

    executar(jogador) {

        if (!this.podeAtacar())
            return;

        this.ultimoAtaque = Date.now();

        switch (this.config.tipo) {

            case "projectile":

                console.log(
                    "Disparar:",
                    this.config.projetil
                );

                break;

            case "melee":

                console.log(
                    "Ataque corpo a corpo"
                );

                break;

            case "heal":

                console.log(
                    "Curar"
                );

                break;

            default:

                console.warn(
                    "Tipo de ataque desconhecido:",
                    this.config.tipo
                );

        }

    }

}