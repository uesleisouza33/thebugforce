/**
 * progresso.js
 *
 * ProgressoManager — gerencia o progresso do jogador via LocalStorage.
 * Salva: melhor pontuação, pontuação total acumulada e personagens desbloqueados.
 * Nunca perde dados — sempre faz merge com o padrão em caso de dados corrompidos.
 */

const CHAVE_STORAGE = "thebugforce_progresso_v1";

const DADOS_PADRAO = {
    melhorPontuacao:          0,
    pontuacaoTotal:           0,
    personagensDesbloqueados: ["larissa"]  // Larissa disponível desde o início
};

class ProgressoManager {

    constructor() {
        this._dados = this._carregar();
    }

    // =====================
    // Privado
    // =====================

    _carregar() {

        try {

            const raw = localStorage.getItem(CHAVE_STORAGE);

            if (!raw) {
                return { ...DADOS_PADRAO, personagensDesbloqueados: [...DADOS_PADRAO.personagensDesbloqueados] };
            }

            const salvo = JSON.parse(raw);

            // Merge: garante que chaves novas do padrão sempre existam
            return {
                ...DADOS_PADRAO,
                ...salvo,
                personagensDesbloqueados: Array.isArray(salvo.personagensDesbloqueados)
                    ? salvo.personagensDesbloqueados
                    : [...DADOS_PADRAO.personagensDesbloqueados]
            };

        } catch (e) {

            console.warn("Progresso: erro ao carregar, usando padrão.", e);
            return { ...DADOS_PADRAO, personagensDesbloqueados: [...DADOS_PADRAO.personagensDesbloqueados] };

        }

    }

    _salvar() {

        try {
            localStorage.setItem(CHAVE_STORAGE, JSON.stringify(this._dados));
        } catch (e) {
            console.warn("Progresso: erro ao salvar no LocalStorage.", e);
        }

    }

    // =====================
    // Pontuação
    // =====================

    /**
     * Registra o resultado de uma partida.
     * Atualiza melhor pontuação e pontuação total acumulada.
     * @param {number} pontuacao
     * @returns {{ novaMelhor: boolean, melhorPontuacao: number, pontuacaoTotal: number }}
     */
    registrarPartida(pontuacao) {

        const valor = Math.max(0, Math.floor(pontuacao));

        this._dados.pontuacaoTotal += valor;

        const novaMelhor = valor > this._dados.melhorPontuacao;

        if (novaMelhor) {
            this._dados.melhorPontuacao = valor;
        }

        this._salvar();

        return {
            novaMelhor,
            melhorPontuacao: this._dados.melhorPontuacao,
            pontuacaoTotal:  this._dados.pontuacaoTotal
        };

    }

    get melhorPontuacao() {
        return this._dados.melhorPontuacao;
    }

    get pontuacaoTotal() {
        return this._dados.pontuacaoTotal;
    }

    // =====================
    // Personagens
    // =====================

    /**
     * Retorna array com as chaves dos personagens desbloqueados.
     */
    get personagensDesbloqueados() {
        return [...this._dados.personagensDesbloqueados];
    }

    /**
     * Desbloqueia um personagem pelo key.
     * @param {string} key
     * @returns {boolean} true se foi desbloqueado agora, false se já estava
     */
    desbloquearPersonagem(key) {

        if (!this._dados.personagensDesbloqueados.includes(key)) {
            this._dados.personagensDesbloqueados.push(key);
            this._salvar();
            return true;
        }

        return false;

    }

    /**
     * Verifica se um personagem está desbloqueado.
     * @param {string} key
     * @returns {boolean}
     */
    estaDesbloqueado(key) {
        return this._dados.personagensDesbloqueados.includes(key);
    }

    // =====================
    // Utilitário
    // =====================

    /**
     * Reseta todo o progresso (uso para testes).
     */
    resetar() {
        this._dados = {
            ...DADOS_PADRAO,
            personagensDesbloqueados: [...DADOS_PADRAO.personagensDesbloqueados]
        };
        this._salvar();
    }

}

// Singleton — mesma instância em todo o jogo
const Progresso = new ProgressoManager();

export default Progresso;
