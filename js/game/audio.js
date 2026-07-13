/**
 * audio.js
 *
 * AudioManager simples para The Bug Force.
 * Controla músicas (uma por vez) e efeitos sonoros (simultâneos).
 * Usa a Web Audio API para sons sintéticos e HTMLAudioElement para arquivos.
 */

class AudioManager {

    constructor() {

        // Volume padrão — deve ser definido ANTES de _criarAudio
        this._volumeMusica = 0.4;
        this._volumeSFX    = 0.7;

        // Flag para evitar erros antes de interação do usuário
        this._habilitado = false;

        this._musicaAtual = null;
        this._musicaKey   = null;

        // --- Músicas ---
        this._musicas = {
            menu:     this._criarAudio("../assets/audio/music/BugForce_telaInicial.mp3", true),
            fase1:    this._criarAudio("../assets/audio/music/fase1_e_2.mp3",            true),
            fase2:    this._criarAudio("../assets/audio/music/fase1_e_2.mp3",            true),
            gameover: this._criarAudio("../assets/audio/music/GameOverMusic.mp3",       false),
            vitoria:  this._criarAudio("../assets/audio/music/GameOverMusic.mp3",       false)
        };

        // --- Efeitos sonoros ---
        this._sfx = {
            tiro:       "../assets/audio/Sound/binarioLaser.mp3",
            habilidade: "../assets/audio/Sound/ativandopoder.mp3",
            item:       "../assets/audio/Sound/somPlayJogo.mp3",
            morte:      "../assets/audio/Sound/risada_carlos.mp3",
            hit:        "../assets/audio/Sound/varelaRisada.mp3"
        };

    }

    // =====================
    // Privado
    // =====================

    _criarAudio(src, loop = false) {

        const audio = new Audio(src);
        audio.loop = loop;
        audio.volume = this._volumeMusica;
        audio.preload = "auto";
        return audio;

    }

    // =====================
    // Habilitar (chamado na primeira interação do usuário)
    // =====================

    habilitar() {

        this._habilitado = true;

    }

    // =====================
    // Música
    // =====================

    tocarMusica(key) {

        if (!this._habilitado) return;
        if (this._musicaKey === key) return;

        // Para música atual
        if (this._musicaAtual) {
            this._musicaAtual.pause();
            this._musicaAtual.currentTime = 0;
        }

        const musica = this._musicas[key];

        if (!musica) {
            console.warn("AudioManager: música não encontrada:", key);
            return;
        }

        musica.volume = this._volumeMusica;
        musica.currentTime = 0;
        musica.play().catch(() => {});

        this._musicaAtual = musica;
        this._musicaKey = key;

    }

    pararMusica() {

        if (this._musicaAtual) {
            this._musicaAtual.pause();
            this._musicaAtual.currentTime = 0;
        }

        this._musicaAtual = null;
        this._musicaKey = null;

    }

    // =====================
    // Efeitos sonoros
    // =====================

    tocarSFX(key) {

        if (!this._habilitado) return;

        const src = this._sfx[key];

        if (!src) {
            console.warn("AudioManager: sfx não encontrado:", key);
            return;
        }

        // Cria instância nova para permitir sobreposição
        const audio = new Audio(src);
        audio.volume = this._volumeSFX;
        audio.play().catch(() => {});

    }

    // =====================
    // Volume
    // =====================

    setVolumeMusica(v) {

        this._volumeMusica = Math.max(0, Math.min(1, v));

        if (this._musicaAtual) {
            this._musicaAtual.volume = this._volumeMusica;
        }

    }

    setVolumeSFX(v) {

        this._volumeSFX = Math.max(0, Math.min(1, v));

    }

    // =====================
    // Pausa / retomada (útil para pause do jogo)
    // =====================

    pausar() {

        if (this._musicaAtual) {
            this._musicaAtual.pause();
        }

    }

    retomar() {

        if (this._musicaAtual && this._habilitado) {
            this._musicaAtual.play().catch(() => {});
        }

    }

}

// Exporta instância única (singleton)
const Audio$ = new AudioManager();

export default Audio$;
