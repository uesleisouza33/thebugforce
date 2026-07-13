const dialogos = [
    {
        personagem: "Maçaneiro",
        imagem: "../assets/img/manuel/macanito2.png",
        texto: "Pessoal, a situação saiu completamente do controle! Um vírus digital invadiu os sistemas da escola e começou a corromper tudo ao seu redor."
    },
    {
        personagem: "Sandrinha",
        imagem: "../assets/img/manuel/sandrinha2.png",
        texto: "Nossa primeira missão será na entrada da escola. À primeira vista, tudo parece normal, como se nada tivesse acontecido... mas não se deixem enganar."
    },
    {
        personagem: "Maçaneiro",
        imagem: "../assets/img/manuel/macanito2.png",
        texto: "Os primeiros professores já foram infectados pelo vírus e agora atacam qualquer pessoa que tenta entrar na escola. Eles não são mais eles mesmos."
    },
    {
        personagem: "Sandrinha",
        imagem: "../assets/img/manuel/sandrinha2.png",
        texto: "Derrotem todos os inimigos, avancem para o interior da escola e descubram quem está por trás dessa invasão digital. Contamos com vocês... Boa sorte, Bug Force!"
    }
];

const dialogoFase2 = [
    {
        personagem: "Maçaneiro",
        imagem: "../assets/img/manuel/macanito2.png",
        texto: "Bom trabalho! Vocês conseguiram libertar os professores da entrada, mas o vírus continua se espalhando pelos corredores."
    },
    {
        personagem: "Sandrinha",
        imagem: "../assets/img/manuel/sandrinha2.png",
        texto: "Cuidado! Há ainda mais inimigos infectados por aqui, e a energia do vírus está ficando cada vez mais intensa."
    },
    {
        personagem: "Maçaneiro",
        imagem: "../assets/img/manuel/macanito2.png",
        texto: "Detectamos uma grande concentração do vírus no fim do corredor. Parece que o Professor Carlos foi completamente dominado."
    },
    {
        personagem: "Sandrinha",
        imagem: "../assets/img/manuel/sandrinha2.png",
        texto: "Derrotem o Professor Carlos para abrir caminho até a próxima área da escola. Boa sorte!"
    }
];

const dialogoFase3 = [
    {
        personagem: "Maçaneiro",
        imagem: "../assets/img/manuel/macanito2.png",
        texto: "Vocês chegaram ao Laboratório de 4.0. Foi aqui que o vírus começou a se espalhar pela escola."
    },
    {
        personagem: "Sandrinha",
        imagem: "../assets/img/manuel/sandrinha2.png",
        texto: "Todos os dados apontam para uma única responsável: Vera, a Rainha dos Bugs. Ela controla o vírus e corrompe tudo por onde passa."
    },
    {
        personagem: "Maçaneiro",
        imagem: "../assets/img/manuel/macanito2.png",
        texto: "Derrotem a Vera e destruam o núcleo da infecção. Só assim a escola poderá voltar ao normal."
    },
    {
        personagem: "Sandrinha",
        imagem: "../assets/img/manuel/sandrinha2.png",
        texto: "Essa é a batalha final, Bug Force. Mostrem a força da programação e acabem de uma vez com os bugs!"
    }
];

const faseAtual = parseInt(sessionStorage.getItem("faseAtual") || "0", 10);
let falasAtuais = dialogos;

if (faseAtual === 1) {
    falasAtuais = dialogoFase2;
} else if (faseAtual === 2) {
    falasAtuais = dialogoFase3;
}

let indice = 0;
let escrevendo = false;

const nome = document.getElementById("nome-personagem");
const texto = document.getElementById("texto-dialogo");
const avatar = document.getElementById("avatar-personagem");

function escreverTexto(frase) {

    escrevendo = true;
    texto.textContent = "";

    let i = 0;

    const intervalo = setInterval(() => {

        texto.textContent += frase.charAt(i);

        i++;

        if (i >= frase.length) {

            clearInterval(intervalo);
            escrevendo = false;

        }

    }, 30);

}
function mostrarDialogo() {

    avatar.style.opacity = 0;

    setTimeout(() => {

        nome.textContent = falasAtuais[indice].personagem;
        avatar.src = falasAtuais[indice].imagem;

        avatar.style.opacity = 1;

        escreverTexto(falasAtuais[indice].texto);

    }, 300);

}

mostrarDialogo();


document.addEventListener("keydown", (event) => {

    // ENTER = próxima fala
    if (event.key === "Enter") {

        if (escrevendo) return;

        indice++;

        if (indice >= falasAtuais.length) {

            window.location.href = "jogarSolo.html";
            return;
        }

        mostrarDialogo();
    }

    // P = pula toda a história
    if (event.key.toLowerCase() === "p") {

        window.location.href = "jogarSolo.html";

    }

});