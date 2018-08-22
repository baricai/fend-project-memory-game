/*
 * Create a list that holds all of your cards
 */

let cardsBottoms = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle', 'fa-diamond', 'fa-bomb', 'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle', 'fa-paper-plane-o', 'fa-cube'];

let openCards = []; //list storing currently uncovered cards
let matchedCards = []; //list storing the figures that were matched already
let score = 3; //current score
let counter = 0;
let isFirstClick = true;
let currentBottoms = [];
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 //Timer for the game 
var timerVar = setInterval(countTimer, 1000);
var totalSeconds = 0;
function countTimer() {
   ++totalSeconds;
   var hour = Math.floor(totalSeconds /3600);
   var minute = Math.floor((totalSeconds - hour*3600)/60);
   var seconds = totalSeconds - (hour*3600 + minute*60);

   document.getElementById("timer").innerHTML = hour + ":" + minute + ":" + seconds;
}

function resetTimer() {
	clearInterval(timerVar);
	totalSeconds = 0;
	timerVar = setInterval(countTimer, 1000);
}

 function newGame() {
 	let cards = $('.card');
 	cards.removeClass('match open show'); //hide all images

 	let newCardsBottoms = shuffle(cardsBottoms);

 	currentBottoms = cards.children('i');
 	currentBottoms.removeClass('fa-diamond fa-paper-plane-o fa-anchor fa-bolt fa-cube fa-leaf fa-bicycle fa-bomb');
 	currentBottoms.each( function(index, item) {
 		$(item).addClass(newCardsBottoms[index]); //assign re-shuffled classes to the cards
 	});
 	//reset global variables and counter
 	openCards = []; 
 	matchedCards = [];
 	score = 3;
 	counter = 0;
 	isFirstClick = true;
 	$('.moves').text(0);
 	$('.fa-star').css('color','#000');
 	clearInterval(timerVar);
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
function showSymbol(card) {
	card.addClass('open show');
}

function hideSymbol(card) {
	card.removeClass('open show');
}

function keepOpenOnMatch(card) {
	card.addClass('match');
	card.removeClass('open show');
}

function showWinnigMessage() {
	let modalWin = $('#winningModal');
	let hours = Math.floor(totalSeconds /3600);
    let minutes = Math.floor((totalSeconds - hours*3600)/60);
    let seconds = totalSeconds - (hours*3600 + minutes*60);
	$('#winningText').text('You\'ve won with score '+score+' and it took you '+hours+' hour(s) '+minutes+' minute(s) and '+seconds+' second(s). Awsome job!');
	modalWin.css('display','block');
}

function showLosingMessage() {
	let modalLoose = $('#losingModal');
	$('#losingText').text('You\'ve lost badly.');
	modalLoose.css('display','block');
}

function addToOpen(card) {
	let cardPic=card.children('i').attr('class').split(' ')[1];
	openCards.push(cardPic);
}

function increaseCounter() {
	counter += 1;
	$('.moves').text(counter);
	// decrease the score depending on the amount of moves that were already made
	if (counter===30) { 
		$('#third-star').css('color','#fefefe');
		score=2;
	} else if (counter===40) {
		$('#second-star').css('color','#fefefe');
		score=1;
	} else if (counter>60) {
		showLosingMessage();
	}
}

function checkMatch() {
	if (openCards.length==2) { //if two cards are uncovered
		if (openCards[0]==openCards[1]) { //if they depict the same image
			keepOpenOnMatch($('.card:has(.'+openCards[0]+')'));
			matchedCards.push(openCards[0]);
			if (matchedCards.length===8) { //the game is won
			 	clearInterval(timerVar);
			 	showWinnigMessage();	
			  }
		} else { //hide the uncovered cards
			hideSymbol($('.card:has(.'+openCards[0]+')'));
			hideSymbol($('.card:has(.'+openCards[1]+')'));
		}
		openCards=[];
	} 
}

$('.card').click( function(event) {
	if (isFirstClick) {
		resetTimer();
		isFirstClick = false;
	}
	let card = $(event.target); 
	if (!card.hasClass('match') && !card.hasClass('show')) { //only if the class is not open already
		if (openCards.length<=1) { //react only if there is one or no cards open
			showSymbol(card);
			addToOpen(card);
			increaseCounter();
			setTimeout(checkMatch,800);//give some time to the user to see both cards
		}
	}
});

$('.restart').click(newGame);

$(document).ready(newGame);

// When the user clicks on <span> (x), close the modal
$('.close').click(function() {
    $('.modal').css('display', 'none');
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    $('.modal').css('display', 'none');
};

// When play again button is clicked, play a new game
$('.play').click(newGame);

// When player doesn't want to play anymore
$('.no-play').click(function() {
    $('.modal').css('display', 'none');
    clearInterval(timerVar);
});

