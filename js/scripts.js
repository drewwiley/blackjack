// Set messages after game over. The table/game looks like Rob made it. change this.
// What about those stupid 11, 12, 13?
// What about aces?
// the player can hit forever?
// there is no win counter/bet system
// there is no "deck" to draw from
// the cards arent red or black like they should
// cards are lame; find images
// there is no delay on showing the cards...it's instant
// You can see the dealers 2nd card on deal. Thats unfair (to the house)

// 1. When the user clicks deal, deal.
var theDeck = [];
var playersHand= [];
var dealersHand= [];
var topOfTheDeck = 4;

$(document).ready(function() {


	$('.deal-button').click(function() {
		createDeck(); //Run a function that creates an array of 1H through 13C
		shuffleDeck();
		// Push onto the playersHand array, the new card. Then place it in the DOM
		playersHand.push(theDeck[0]);
		setTimeout(function(){
		placeCard('player', 'one', theDeck[0])}, 500);
		dealersHand.push(theDeck[1]);
		setTimeout(function(){
		placeCard('dealer', 'one', theDeck[1])}, 1000);
		playersHand.push(theDeck[2]);
		setTimeout(function(){
		placeCard('player', 'two', theDeck[2])}, 1500);
		dealersHand.push(theDeck[3]);
		setTimeout(function(){
		placeCard('dealer', 'two', theDeck[3])}, 2000);

	setTimeout(function(){

		calculateTotal(playersHand, 'player');
		calculateTotal(dealersHand, 'dealer');}, 3000)

		


	});

	$('.hit-button').click(function() {
		var playerTotal = calculateTotal(playersHand, 'player');
		if (playerTotal <= 21){
			var slotForNewCard = '';
			if(playersHand.length == 2){slotForNewCard = "three";}
			else if(playersHand.length == 3){slotForNewCard = "four";}
			else if(playersHand.length == 4){slotForNewCard = "five";}
			else if(playersHand.length == 5){slotForNewCard = "six";}
			placeCard('player', slotForNewCard, theDeck[topOfTheDeck])
			playersHand.push(theDeck[topOfTheDeck]);
			calculateTotal(playersHand, 'player');
			topOfTheDeck++;
			console.log(slotForNewCard);

			
		}
			else if (playerTotal > 21) {
				$('.row-winner').html("You have busted with " +playerTotal + ". Click reset to deal again");
			 $('.hit-button').prop('disabled', true);
		}
		
});
	$('.stand-button').click(function() {
		var slotForNewCard = '';
	
		//Player clicked on stand. What happens to the player? Nothing.
			var dealerTotal = calculateTotal(dealersHand, 'dealer');
			while (dealerTotal < 17){
				//Dealer has less than 17, hit away
				if(dealersHand.length == 2) {slotForNewCard = "three"}
				else if(dealersHand.length == 3) {slotForNewCard = "four"}
				else if(dealersHand.length == 4) {slotForNewCard = "five"}
				else if(dealersHand.length == 5) {slotForNewCard = "six"}
				placeCard('dealer', slotForNewCard, theDeck[topOfTheDeck])
				dealersHand.push(theDeck[topOfTheDeck]);
				dealerTotal = calculateTotal(dealersHand, 'dealer');
				topOfTheDeck++;
			}

			// Dealer has atleast 17; check to see who won.
			checkWin();

	});
	$('.reset-button').click(function(){
        playersHand = []; // empty the players hand
        dealersHand = []; // empty the dealers hand
        theDeck = []; // empty the deck
        topOfTheDeck = 5; // reset top of deck to 5
        $('.row-winner').text(''); // reset win/loss/push message to an empty string
        $('.card').text(''); // reset cards to blank
        $('.player-total-number').text('0'); // reset number in player total html
        $('.dealer-total-number').text('0'); // reset number in dealer total html
        $('.hit-button').prop('disabled', false);
		$('.stand-button').prop('disabled', false);
		$('.deal-button').prop('disabled', false);
    });
});

function placeCard(who, where, cardToPlace){
	var classSelector = '.'+who+'-cards .card-'+where;

	setTimeout(function(){

	$(classSelector).html('<img src="cards/'+cardToPlace+'.png">');}, 500)


}

function createDeck(){
	// Fill the deck with:
	// 52 cards
	// 	-4 Suits
	// 	-h, s, d, c
	var suits= ['h', 's', 'd', 'c'];
	for(s=0; s<suits.length; s++){
		for(c=1; c<= 13; c++) {
			theDeck.push(c+suits[s]);
		}
	}
}
function shuffleDeck(){
// [1]
// [2]
// [3]
// ...
// [50]
// [51]
// [52]

	for(i=1; i<1000; i++){
		card1 = Math.floor(Math.random() * theDeck.length);
		card2 = Math.floor(Math.random() * theDeck.length);
		var temp = theDeck[card1];
		theDeck[card1] = theDeck[card2];
		theDeck[card2] = temp;

	}
	// console.log(theDeck)
}

function calculateTotal(hand, whosTurn){
    // console.log(hand);
    // console.log(whosTurn);
    var hasAce = false; //init Ace as false
    var cardValue = 0;
    var total = 0;
    for (var i = 0; i < hand.length; i++){
        cardValue = Number(hand[i].slice(0,-1));    
        if (cardValue > 10){
            cardValue = 10;
        }
        else if (cardValue == 1 && ((total + 11) <= 21)) {
        	cardValue = 11;
        	hasAce = true;
        }else if ((cardValue + total) > 22 && (hasAce)){
        	total = total - 10;
        	hasAce= false;
        }


        total += cardValue;
    }
    // update the html with the new total
    var elementToUpdate = '.'+whosTurn+'-total-number';
    $(elementToUpdate).text(total);

    return total;
    console.log(total);
}

function checkWin() {
		// get player total

	var playersTotal = calculateTotal(playersHand, 'player');
	// get dealers total
	var dealerTotal = calculateTotal(dealersHand, 'dealer');

	if (playersTotal > 21) {
		// player has busted, set a message that says this
    $('.row-winner').text("You have busted with " +playersTotal + ". The dealer wins with " +dealerTotal + ". Click reset to deal again");
	
	}
	else if (dealerTotal > 21) {
		// Dealer has busted, set a message that says this
		$('.row-winner').text("The dealer has busted with " +dealerTotal +". You win with " +playersTotal+ ". Click reset to deal again");
	} else {
		// Neither player has more than 21
		if (playersTotal > dealerTotal && dealerTotal < 21) {
			// Player won. Say this somewhere
			$('.row-winner').text("You win with " + playersTotal+". Dealer had "+dealerTotal+". Click reset to deal again");
		}
		else if (dealerTotal > playersTotal) {
			$('.row-winner').text("You lose with " + playersTotal+". Dealer had "+dealerTotal+". Click reset to deal again");
		}
		else {
			// Push. (tie) Say this somewhere
			$('.row-winner').text("Push. Player and dealer both have " +dealerTotal+". Click reset to deal again");
		}
	}
	$('.hit-button').prop('disabled', true);
	$('.stand-button').prop('disabled', true);
	$('.deal-button').prop('disabled', true);
	
	
	
}
