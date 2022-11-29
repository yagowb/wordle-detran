import { WORDS } from "./words.js";

const numTentativas = 6;
let tentRestantes = numTentativas;
let tentAtual = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
console.log(rightGuessString);




function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < numTentativas; i++) {
        let row = document.createElement("div");
        row.className = "letter-row";
        
        for (let j = 0; j < 6; j++) {
            let box = document.createElement("div");
            box.className = "letter-box";
            row.appendChild(box);
        }

        board.appendChild(row)
    }
}

initBoard()



document.addEventListener("keyup", (e) => {

    if(tentRestantes === 0){
        return
    }

    let pressedKey = String(e.key);
    if(pressedKey === "Backspace" && nextLetter !== 0){
        deleteLetter()
        return
    }

    if(pressedKey === "Enter"){
        checkGuess()
        return
    }

    let found = pressedKey.match(/[a-z]/gi)
    if(!found || found.length > 1){
        return
    }else{
        insertLetter(pressedKey)
    }
})


function insertLetter(pressedKey) {
    if(nextLetter === 6){
        return
    }

    pressedKey = pressedKey.toLowerCase();

    let row = document.getElementsByClassName("letter-row")[6 - tentRestantes]
    let box = row.children[nextLetter];
    animateCSS(box, "pulse");
    box.textContent = pressedKey;
    box.classList.add("filled-box");
    tentAtual.push(pressedKey)
    nextLetter += 1;
}


function deleteLetter() {

    let row = document.getElementsByClassName("letter-row")[6 - tentRestantes]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    tentAtual.pop()
    nextLetter -= 1;
}


function checkGuess() {

    let row = document.getElementsByClassName("letter-row")[6 - tentRestantes]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString);

    for(const val of tentAtual){
        guessString += val;
    }

    if(guessString.length != 6){
        toastr.error("Está faltando letra!");
        return
    }

    if(!WORDS.includes(guessString)){
        toastr.error("Essa Palavra não está na lista!")
        return
    }

    for(let i = 0; i < 6; i++){
        let letterColor = ''
        let box = row.children[i]
        let letter = tentAtual[i]

        let letterPosition = rightGuess.indexOf(tentAtual[i])


        if(letterPosition === -1){
            letterColor = 'grey'
        }else{
            //se o letter index e o rightguess forem iguais
            //a letra está na posição correta
            if(tentAtual[i] === rightGuess[i]){
                letterColor = 'green'
            }else{
                letterColor = 'yellow'
            }

            rightGuess[letterPosition] = '#'
        }

        let delay = 250 * i;
        setTimeout(() => {
            //flip box
            animateCSS(box, 'flipInX')
            //shade box
            box.style.backgroundColor = letterColor;
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    if(guessString === rightGuessString){
        toastr["success"]("Você acertou e não foi multado!", "Fim de Jogo!");
        tentRestantes = 0;
        return
    }else{
        tentRestantes -= 1;
        tentAtual = [];
        nextLetter = 0;

        if(tentRestantes === 0){
            toastr.error("FIM DE JOGO! Sem tentativas restantes! Você tomou 7 pontos na carteira.");
            toastr.info(`A palavra correta era: "${rightGuessString}"`);
        }
    }
    
}



function shadeKeyBoard(letter, color){

    for(const elem of document.getElementsByClassName("keyboard-button")){
        if(elem.textContent === letter){
            let oldColor = elem.style.backgroundColor;

            if(oldColor === 'green'){
                return
            }

            if(oldColor === 'yellow' && color !== 'green'){
                return
            }

            elem.style.backgroundColor = color;
            break
        }
    }
}


/////////////gerar teclado para input on-screen//////////////
document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target;

    if(!target.classList.contains("keyboard-button")){
        return
    }
    let key = target.textContent;

    if(key === 'Deletar'){
        key = "Backspace"
    }

    document.dispatchEvent(new KeyboardEvent("keyup", {'key' : key}))
});





////////////////////////animateCSS////////////////////////////
const animateCSS = (element, animation, prefix = 'animate__') =>

    new Promise((resolve, reject) => {

        const animationName = `${prefix}${animation}`;
        const node = element;
        node.style.setProperty('--animate-duration', '0.3s');

        node.classList.add(`${prefix}animated`, animationName);

        function handleAnimationEnd(event){
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animação finalizada.');
        }


        node.addEventListener('animationend', handleAnimationEnd, {once: true});
    });






