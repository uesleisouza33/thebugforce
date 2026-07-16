/**
 * fases.js
 *
 * Configuração de todas as fases do jogo.
 * Referencia sprites e inimigos por chave (string).
 * Nunca contém lógica — somente dados.
 */

const FASES = [

    {
        id: 1,
        nome: "FASE 1",
        subtitulo: "A Invasão Começou",
        background: "../assets/game/backgrounds/fase1.webp",

        // Quantidade de inimigos normais para liberar o boss
        inimigosParaVencer: 8,

        // Chaves de SPRITES e ENEMIES que aparecem nesta fase
        enemyPool: ["profEdu", "profWendel"],

        // Intervalo entre spawns em ms
        intervaloSpawn: 2500,

        boss: {
            spriteKey: "juliana",
            enemyKey: "juliana",
            nomeExibido: "Juliana — MODO CORROMPIDO",

            // Tamanho exibido na tela (maior que o normal)
            largura: 160,
            altura: 320,

            // Stats adicionais em cima do config base
            vidaExtra: 350,
            danoExtra: 15,
            velocidade: 1,

            // Boss sempre dropa o amuleto
            chanceDrop: 1.0,
            pontosAoMatar: 100
        }
    },

    {
        id: 2,
        nome: "FASE 2",
        subtitulo: "Os Corredores da Fúria",
        background: "../assets/game/backgrounds/fase2.png",

        inimigosParaVencer: 12,
        enemyPool: ["profWendel", "profEdu"],
        intervaloSpawn: 2200,

        boss: {
            spriteKey: "profCarlos",
            enemyKey: "profCarlos",
            nomeExibido: "Prof. Carlos — MODO CORROMPIDO",

            largura: 240,
            altura: 348,

            vidaExtra: 400,
            danoExtra: 20,
            velocidade: 0,

            chanceDrop: 1.0,
            pontosAoMatar: 150
        }
    },

    {
        id: 3,
        nome: "FASE 3",
        subtitulo: "O Confronto Final",
        background: "../assets/game/backgrounds/fase3.png",

        inimigosParaVencer: 15,
        enemyPool: ["profEdu", "profWendel"],
        intervaloSpawn: 1600,

        boss: {
            spriteKey: "vera",
            enemyKey: "vera",
            nomeExibido: "Vera — A RAINHA DOS BUGS",

            largura: 150,
            altura: 250,

            vidaExtra: 700,
            danoExtra: 25,
            velocidade: 0,

            chanceDrop: 1.0,
            pontosAoMatar: 250
        }
    }

];

export default FASES;
