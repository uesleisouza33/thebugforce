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
        intervaloSpawn: 3000,

        boss: {
            spriteKey: "profEdu",
            enemyKey: "profEdu",
            nomeExibido: "Prof. Edu — MODO CORROMPIDO",

            // Tamanho exibido na tela (maior que o normal)
            largura: 160,
            altura: 320,

            // Stats adicionais em cima do config base
            vidaExtra: 200,
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
        background: "../assets/game/backgrounds/fase1.webp",

        inimigosParaVencer: 12,
        enemyPool: ["profWendel", "profEdu"],
        intervaloSpawn: 2200,

        boss: {
            spriteKey: "profWendel",
            enemyKey: "profWendel",
            nomeExibido: "Prof. Wendel — MODO CORROMPIDO",

            largura: 160,
            altura: 320,

            vidaExtra: 150,
            danoExtra: 12,
            velocidade: 1,

            chanceDrop: 1.0,
            pontosAoMatar: 100
        }
    }

];

export default FASES;
