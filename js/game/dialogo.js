const dialogos = [
    {
        personagem: "Maçanito",
        imagem:"../assets/img/manuel/macanito2.png",
        texto: "Pessoal, a situação saiu do controle! Um vírus tomou conta da escola e transformou tudo em um caos."
    },
    {
        personagem: "Sandra",
        imagem:"../assets/img/manuel/sandrinha2.png",
        texto: "Os corredores estão cheios de inimigos digitais. Vocês precisarão atravessar cada fase para restaurar o sistema."
    },
    {
        personagem: "Maçanito",
        imagem:"../assets/img/manuel/macanito2.png",
        texto: "Derrotem todos os inimigos e cuidado! No final de cada fase haverá um chefe muito mais forte."
    },
    {
        personagem: "Sandra",
        imagem:"../assets/img/manuel/sandrinha2.png",
        texto: "Cada personagem possui uma habilidade especial. Usem isso ao seu favor."
    },
    {
        personagem: "Maçanito",
        imagem:"../assets/img/manuel/macanito2.png",
        texto: "Agora é com vocês... Boa sorte, Bug Force!"
    }
];

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

        nome.textContent = dialogos[indice].personagem;
        avatar.src = dialogos[indice].imagem;

        avatar.style.opacity = 1;

        escreverTexto(dialogos[indice].texto);

    }, 300);

}

mostrarDialogo();


document.addEventListener("keydown", (event) => {

    // ENTER = próxima fala
    if (event.key === "Enter") {

        if (escrevendo) return;

        indice++;

        if (indice >= dialogos.length) {

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