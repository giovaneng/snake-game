const tabuleiro = document.getElementById("tabuleiro");
const pontosTexto = document.getElementById("pontos"); 
const TAMANHO = 20; 
const cobra = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
];
const comida = {
    x: 15,
    y: 10
};
let direcao = {
    x: 1,
    y: 0
};
let proximaDirecao = {
    x: 1,
    y: 0
};
let pontos = 0;          
let jogoAcabou = false;  

const mensagemFim = document.getElementById("game-over");
const textoFim = document.getElementById("texto-fim");
const botaoRestart = document.getElementById("restart");

function criarElemento(posicao, classe) {
    const elemento = document.createElement("div");
    elemento.classList.add(classe);
    elemento.style.gridColumn = posicao.x + 1;
    elemento.style.gridRow = posicao.y + 1;
    tabuleiro.appendChild(elemento);
}
function desenhar() {
    tabuleiro.replaceChildren();
    for (let i = 0; i < cobra.length; i++) {
        criarElemento(cobra[i],
            "segmento");
    }
    criarElemento(comida,
        "comida");
}

function estaNaCobra(posicao, ignorarRabo) {
    const limite = ignorarRabo ? cobra.length - 1 : cobra.length;
    for (let i = 0; i < limite; i++) {
        if (cobra[i].x === posicao.x && cobra[i].y === posicao.y) {
            return true;
        }
    }
    return false;
}

function sortearComida() {
    do {
        comida.x = Math.floor(Math.random() * TAMANHO);
        comida.y = Math.floor(Math.random() * TAMANHO);
    } while (estaNaCobra(comida, false));
}

function fimDeJogo(mensagem) {
    jogoAcabou = true;
    textoFim.textContent = mensagem + " Pontos: " + pontos;
    mensagemFim.hidden = false;
}

function reiniciar() {
    cobra.splice(0, cobra.length,
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 });
    direcao = { x: 1, y: 0 };
    proximaDirecao = { x: 1, y: 0 };
    pontos = 0;
    pontosTexto.textContent = pontos;
    jogoAcabou = false;
    mensagemFim.hidden = true;
    botaoRestart.blur();
    sortearComida();
    desenhar();
}
botaoRestart.addEventListener("click", reiniciar);

function mover() {
    if (jogoAcabou) { // NOVO
        return;
    }
    direcao = proximaDirecao;
    const novaCabeca = {
        x: cobra[0].x + direcao.x,
        y: cobra[0].y + direcao.y
    };

    if (novaCabeca.x < 0 || novaCabeca.x >= TAMANHO ||
        novaCabeca.y < 0 || novaCabeca.y >= TAMANHO) {
        fimDeJogo("Game Over!");
        return;
    }

    const comeu = novaCabeca.x === comida.x && novaCabeca.y === comida.y;

    
    if (estaNaCobra(novaCabeca, !comeu)) {
        fimDeJogo("Game Over!");
        return;
    }

    cobra.unshift(novaCabeca);

    if (comeu) {
        pontos++;                          
        pontosTexto.textContent = pontos;
        if (cobra.length === TAMANHO * TAMANHO) {
            desenhar();
            fimDeJogo("Você venceu!");
            return;
        }
        sortearComida();                   
    } else {
        cobra.pop();
    }
    desenhar();
}
function controlarTeclado(evento) {
    if (evento.key === "ArrowUp") {
        evento.preventDefault();
        if (direcao.y === 0) {
            proximaDirecao = { x: 0, y: -1 };
        }
    } else if (evento.key === "ArrowDown") {
        evento.preventDefault();
        if (direcao.y === 0) {
            proximaDirecao = { x: 0, y: 1 };
        }
    } else if (evento.key === "ArrowLeft") {
        evento.preventDefault();
        if (direcao.x === 0) {
            proximaDirecao = { x: -1, y: 0 };
        }
    } else if (evento.key === "ArrowRight") {
        evento.preventDefault();
        if (direcao.x === 0) {
            proximaDirecao = { x: 1, y: 0 };
        }
    }
}
document.addEventListener("keydown"
    , controlarTeclado);
desenhar();
setInterval(mover, 180);