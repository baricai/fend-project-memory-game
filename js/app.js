 // Define the symbols and create a deck of cards holding two of each symbol

var cards = [`fa fa-diamond`, `fa fa-paper-plane-o`,`fa fa-anchor`, `fa fa-bolt`,`fa fa-cube`,`fa fa-anchor`, `fa fa-leaf`, `fa fa-bicycle`, `fa fa-diamond`, `fa fa-bomb`, `fa fa-leaf`, `fa fa-bomb`, `fa fa-bolt`, `fa fa-bicycle`, `fa fa-paper-plane-o`, `fa fa-cube`];
var grid = [];  

var openedCards = [];
var moveCounter = 0;
var matchCounter = 0;
var star = 3;
var tryCounter = 0;
var timeInt = 0;

// 1. Resets the game to default values
// 2. Remove the old deck of cards
// 3. Create a new shuffled deck of cards
// 4. Hide the Congrats popup
function reset() {
    openedCards = [];
    matchCounter = 0;
    tryCounter = 0;
    resetTimer();
    resetCounter();
    resetStars();
    clearDeck(deck);
    var shuffledDeck = shuffle(cards);
    createDeckHTML(shuffledDeck);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

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

// Grab the score-panel, add a timer with default value of 00:00, and initialize the total seconds to 0
const timer = document.createElement(`div`);
timer.className = `timer`;
timer.innerHTML = `0:00`;
const panel = document.getElementsByClassName(`score-panel`);
panel[0].appendChild(timer);
let totalSeconds = 0;

// Grab the deck div element from the HTML
var deck = document.getElementsByClassName(`deck`);

// Grab the 'moves' from the HTML and change the text to 0
var moves = document.getElementsByClassName(`moves`);
moves[0].innerHTML = 0;

// Grab the 'reset' icon from the HTML
var restart = document.getElementsByClassName(`fa-repeat`);


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */



// Call the buildCongrats function once


// Add eventlistener to listen for click on reset button
restart[0].addEventListener(`click`, reset);

// Call the reset function when page first loads
reset();



// Clear the old deck of cards by removing the HTML elements passed into it
function clearDeck(deck) {
    deck[0].remove();
}

// Create a HTML list elements based on the deck that's passed into it.
// It adds the proper classname to each card, add an eventlistener to each card
// It then appends the list to the webpage
function createDeckHTML(deck) {
    var ul = document.createElement(`ul`);
    ul.className = `deck`;
    let container = document.getElementsByClassName(`container`);
    container[0].appendChild(ul);
    for (var i=0; i<deck.length; i++){
        var li = document.createElement(`li`);
        li.className = "card";
        var inner = document.createElement(`i`);
        inner.className = `fa fa-${deck[i]}`;
        ul.appendChild(li);
        li.appendChild(inner);
        li.addEventListener(`click`, processClick);
    }
}


// When a user clicks on a card for the first time, it starts the game timer
// - it displays the card if it has not been opened or matched already
// - it allow only two cards to be displayed at a time
// - if two cards are clicked, it checks if it is a match
// - if all cards are matched, the user won the game and a congrats message popup
// - if the two cards are no match, it hides the cards
function processClick() {
    // Test 1: User can only open two cards at a time
    // Test 2: User can not click the same card
    // Test 3: User can not click already matched cards
    if ((openedCards.length < 2) && (!isSameCard(this)) && (!isAlreadyMatched(this)) ) {
        // Count the number of clicks that do not result a match
        tryCounter++;

        displayCard(this);
        addOpenedList(this);
        incrementCounter();

        // Start the timer if it is the first click
        if (moveCounter === 1) {
            timeInt = setInterval(startTimer, 900);
        }
        // if two cards are open
        if(openedCards.length === 2){
            // if the two opened cards match
            if(openedCards[0] === openedCards[1]){
                // Reset the failed match count back to 0
                tryCounter = 0;
                lockMatch();
                removeOpenedList();
                // if all 16 cards are matched, stop the timer and display congrats
                if (match === 16){
                    stopTimer();
                    // Allow time for the matching animation to finish before display popup
                    setTimeout(function() {
                        return displayCongrats();}, 900
                    );
                }
            } else {  // if the two opened cards do not match
                // hide the cards after 1 second to allow user time to see the symbols
                setTimeout(function(){
                    return hideCards();}, 900
                );
                // remove the cards from the list of open cards
                setTimeout(function() {
                    return removeOpenedList();}, 900);

                // Lower the stars if user has viewed 8 cards, and the 4 recent clicks are failed matches
                // Do not lower the star rating if the rating is 1
                if ((moveCounter >= 8) && (tryCounter >= 4) && (starRating > 1)){
                    lowerStars();
                }
            }
        }
    }
}

// Change the text of the timer on the webpage to reflect elapsed time in minutes and seconds
function startTimer(){
    ++totalSeconds;
    function addZero(i) {
        return (i < 10) ? `0` + i : i;
    }
    var min = addZero(Math.floor(totalSeconds/60));
    var sec = addZero(totalSeconds - (min*60));
    timer.innerHTML = `${min}:${sec}`;
}

// Reset the timer to default of 0 and the text on the webpage to 00:00
function resetTimer(){
    clearInterval(timeInt);
    totalSeconds = 0;
    timer.innerHTML = `0:00`;
}

// Stop the timer
function stopTimer(){
    clearInterval(timeInt);
}

// Show the card by adding 'open' and 'show' class name
function displayCard(item) {
    item.className = `card open show`;
}

// Hide opened cards by removing the 'open' and 'show' class name
function hideCards() {
    var openClass = document.getElementsByClassName(`open`);
    while (openClass.length){
        openClass[0].className = `card`;
    }
}

// Return true if the item is already opened and false if not
function isSameCard(item) {
    const isSame = (item.className === `card open show`) ? true : false;
    return isSame;
}

// Return true if the item is already matched and false if not
function isAlreadyMatched(item) {
    const isAM = (item.className === `card match`) ? true : false;
    return isAM;
}

// Add the item to a list of opened symbols
function addOpenedList(item) {
    var inner = item.childNodes;
    for (var i=0; i<inner.length; i++){
        var symbol = inner[i].className;
        // remove the 'fa fa-'
        symbol = symbol.slice(6);
        openedCards.push(symbol);
    }
}

// Increase the click(move) count by 1 and update the HTML text to the current value
function incrementCounter() {
    moveCounter++;
    moves[0].innerHTML = moveCounter;
}

// Reset the click(move) to 0 and update the HTML text to the current value
function resetCounter() {
    moves[0].innerHTML = moveCounter = 0;
}

// Keep the matched cards opened by setting the class name to 'card match'
// Increase the match count by 2
function lockMatch() {
    var fa = `fa-${openedCards[0]}`;
    var collection = document.getElementsByClassName(`${fa}`);

    for(var i=0; i<collection.length; i++){
        collection[i].parentElement.className = `card match`;
    }
    matchCounter += 2;
}

// Remove the two items in the list of opened card symbols
function removeOpenedList() {
    openedCards.pop();
    openedCards.pop();
}

// Create a div element to add to the page that will hold the congrats message later
// Hide the div element initially


// Display the congrats message with the move count, total time, star rating and play again 'button'


// Hide the congrats popup by adding the class 'dimmed'
// Erase the congrats text messages



// Lower the star rating by one, and hide the last star by adding the class 'dimmed'
function lowerStars() {
    star--;
    tryCounter = 0;
    const stars = document.getElementsByClassName(`fa-star`);
    stars[starRating].className = `fa fa-star dimmed`;
}

// Reset the rating to 3 and show all stars by removing the class 'dimmed'
function resetStars() {
    star = 3;
    var stars = document.getElementsByClassName(`fa-star`);
    for (var i=0; i<3; i++){
        stars[i].className = `fa fa-star`;
    }
}
