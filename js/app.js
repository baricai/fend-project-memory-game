 /*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const cards = ["fa fa-diamond", "fa fa-paper-plane-o","fa fa-anchor", "fa fa-bolt","fa fa-cube","fa fa-anchor", "fa fa-leaf", "fa fa-bicycle", "fa fa-diamond", "fa fa-bomb", "fa fa-leaf", "fa fa-bomb", "fa fa-bolt", "fa fa-bicycle", "fa fa-paper-plane-o", "fa fa-cube"];
const grid = [];  

let openedCards = [];
let moveCounter = 0;
let matchCounter = 0;
let star = 3;
let tryCounter = 0;
let timeInt = 0;

function reset() {
    openedCards = [];
    matchCounter = 0;
    tryCounter = 0;
    resetTimer();
    resetCounter();
    resetStars();
    clearDeck(deck);
    let shuffledDeck = shuffle(cards);
    createDeckHTML(shuffledDeck);
    
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


const moves = document.getElementsByClassName("moves");
moves[0].innerHTML = 0;

let deck = document.getElementsByClassName("deck");
let restart = document.getElementsByClassName("fa-repeat");


const timer = document.createElement("div");
timer.className = "timer";
timer.innerHTML = "0:00";
const panel = document.getElementsByClassName("score-panel");
panel[0].appendChild(timer);
let totalSeconds = 0;


restart[0].addEventListener("click", reset);

reset();


function clearDeck(deck) {
    deck[0].remove();
}


function createDeckHTML(deck) {
    let ul = document.createElement("ul");
    ul.className = `deck`;
    let container = document.getElementsByClassName("container");
    container[0].appendChild(ul);
    for (let i=0; i<deck.length; i++){
        let li = document.createElement("li");
        li.className = "card";
        let inner = document.createElement("i");
        inner.className = `fa fa-${deck[i]}`;
        ul.appendChild(li);
        li.appendChild(inner);
        li.addEventListener("click", processClick);
    }
}


function processClick() {
    if ((openedCards.length < 2) && (!isSameCard(this)) && (!isAlreadyMatched(this)) ) {
       
        tryCounter++;

        displayCard(this);
        addOpenedList(this);
        incrementCounter();

        
        if (moveCounter === 1) {
            timeInt = setInterval(startTimer, 900);
        }
        if(openedCards.length === 2){
            
            if(openedCards[0] === openedCards[1]){
                tryCounter = 0;
                lockMatch();
                removeOpenedList();
                
                if (match === 16){
                    stopTimer();
                    
                    setTimeout(function() {
                        return displayCongrats();}, 900
                    );
                }
            } else {  
                setTimeout(function(){
                    return hideCards();}, 900
                );
                
                setTimeout(function() {
                    return removeOpenedList();}, 900);

                
                if ((moveCounter >= 8) && (tryCounter >= 4) && (starRating > 1)){
                    lowerStars();
                }
            }
        }
    }
}


function startTimer(){
    ++totalSeconds;
    function addZero(i) {
        return (i < 10) ? `0` + i : i;
    }
    let min = addZero(Math.floor(totalSeconds/60));
    let sec = addZero(totalSeconds - (min*60));
    timer.innerHTML = `${min}:${sec}`;
}

function stopTimer(){
    clearInterval(timeInt);
}

function resetTimer(){
    clearInterval(timeInt);
    totalSeconds = 0;
    timer.innerHTML = `0:00`;
}


function displayCard(item) {
    item.className = "card open show";
}

function hideCards() {
    let openClass = document.getElementsByClassName("open");
    while (openClass.length){
        openClass[0].className = "card";
    }
}

function isSameCard(item) {
    let isSame = (item.className === "card open show") ? true : false;
    return isSame;
}

function isAlreadyMatched(item) {
    let isAM = (item.className === "card match") ? true : false;
    return isAM;
}

function addOpenedList(item) {
    let inner = item.childNodes;
    for (let i=0; i<inner.length; i++){
        let symbol = inner[i].className;
        symbol = symbol.slice(6);
        openedCards.push(symbol);
    }
}

function incrementCounter() {
    moveCounter++;
    moves[0].innerHTML = moveCounter;
}

function resetCounter() {
    moves[0].innerHTML = moveCounter = 0;
}

function lockMatch() {
    let fa = `fa-${openedCards[0]}`;
    let collection = document.getElementsByClassName(`${fa}`);

    for(let i=0; i<collection.length; i++){
        collection[i].parentElement.className = "card match";
    }
    matchCounter += 2;
}

function removeOpenedList() {
    openedCards.pop();
    openedCards.pop();
}

function lowerStars() {
    star--;
    tryCounter = 0;
    var stars = document.getElementsByClassName("fa-star");
    stars[starRating].className = "fa fa-star dimmed";
}

function resetStars() {
    star = 3;
    var stars = document.getElementsByClassName("fa-star");
    for (let i=0; i<3; i++){
        stars[i].className = "fa fa-star";
    }
}
