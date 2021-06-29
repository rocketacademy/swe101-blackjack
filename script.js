//Global Variables
var blackjackLimit = 21;
var userStand = false;
var gameState = false;
var gameMode = "players";
var playerName = "";
var numberOfPlayers = 1;
var turn = 0;

var deck;
var playerCounter = 0;
var botHand = [];
var playersObj = [];
var wager = 0;

var displayHand = function (hand) {
  var counter = 0;
  var outputMessage = "Current Hand:<br>";
  while (counter < hand.length) {
    outputMessage += `${hand[counter].name} of ${hand[counter].icon}<br>`;
    counter += 1;
  }
  return outputMessage;
};

var displayPoints = function () {
  var outputMessage = `You now have ${playersObj[playerCounter].points}, remember to play moderately!`;
  return outputMessage;
};

var getCurrentSumHand = function (hand) {
  var total = 0;
  var counter = 0;
  var countAce = 0;
  while (counter < hand.length) {
    if (hand[counter].rank <= 10 && hand[counter].rank >= 2) {
      total += hand[counter].rank;
    } else if (hand[counter].rank >= 11) total += 10;
    else {
      countAce += 1;
      total += 11;
    }
    counter++;
  }

  if (total > blackjackLimit) {
    if (countAce > 0) {
      var counter = 0;
      while (counter < countAce && total > blackjackLimit) {
        total -= 10;
        counter++;
      }
    }
  }
  return total;
};

var makeDeck = function () {
  var cardDeck = [];
  var suits = ["hearts", "diamonds", "clubs", "spades"];
  var suitsIcon = ["♥", "♦", "♣", "♠"];
  var suitIndex = 0;
  while (suitIndex < suits.length) {
    var currentSuit = suits[suitIndex];
    var currentSuitIcon = suitsIcon[suitIndex];
    var rankCounter = 1;
    while (rankCounter <= 13) {
      var cardName = rankCounter;
      if (cardName == 1) {
        cardName = "ace";
      } else if (cardName == 11) {
        cardName = "jack";
      } else if (cardName == 12) {
        cardName = "queen";
      } else if (cardName == 13) {
        cardName = "king";
      }
      var card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        icon: currentSuitIcon,
      };
      cardDeck.push(card);
      rankCounter += 1;
    }
    suitIndex += 1;
  }
  return cardDeck;
};

var shuffleCards = function (cardDeck) {
  var currentIndex = 0;
  while (currentIndex < cardDeck.length) {
    var randomIndex = Math.floor(Math.random() * cardDeck.length);
    var randomCard = cardDeck[randomIndex];
    var currentCard = cardDeck[currentIndex];
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;
    currentIndex = currentIndex + 1;
  }
  return cardDeck;
};

var drawOneCard = function () {
  var cardDrawn = deck.pop();
  return cardDrawn;
};

var isBlackJack = function (hand) {
  var sum = getCurrentSumHand(hand);
  if (sum === blackjackLimit) {
    return true;
  } else return false;
};

var getWinner = function (hand) {
  var userHandTotal = getCurrentSumHand(hand);
  var botHandTotal = getCurrentSumHand(botHand);
  if (userHandTotal > botHandTotal) return "user";
  else return "bot";
};

var checkHandLimit = function (hand) {
  if (getCurrentSumHand(hand) > blackjackLimit) {
    return true;
  } else return false;
};

deck = shuffleCards(makeDeck());

var drawCards = function () {
  var counter = 0;
  while (counter < numberOfPlayers) {
    playersObj[counter].hand.push(drawOneCard());
    playersObj[counter].hand.push(drawOneCard());
    counter++;
  }
  botHand.push(drawOneCard());
  botHand.push(drawOneCard());
};

var playBlackJackPlayer = function (hand, input) {
  if (playersObj[playerCounter].stand == false && input == "hit") {
    hand.push(drawOneCard());
    if (checkHandLimit(hand)) {
      playersObj[playerCounter].state = true;
      playersObj[playerCounter].points -= Number(
        playersObj[playerCounter].wager
      );
      return `Oops busted! You lose, your total hand is ${getCurrentSumHand(
        hand
      )}<br><br>${playersObj[playerCounter].name} Hand<br>${displayHand(
        hand
      )}<br><br>Bot Hand<br>${displayHand(botHand)}<br>${displayPoints()}`;
    }
    if (isBlackJack(hand)) {
      playersObj[playerCounter].state = true;
      playersObj[playerCounter].points += Number(
        playersObj[playerCounter].wager
      );
      return `Congratulations, you win! <br><br> ${
        playersObj[playerCounter].name
      } Hand<br>${displayHand(hand)}<br><br>Bot Hand<br>${displayHand(
        botHand
      )}<br>${displayPoints()}`;
    }
  }

  if (playersObj[playerCounter].stand && getCurrentSumHand(botHand) > 16) {
    playersObj[playerCounter].state = true;
    var winner = getWinner(hand);
    if (winner == "user") {
      playersObj[playerCounter].points += Number(
        playersObj[playerCounter].wager
      );
      return `Congratulations, you win! <br><br> ${
        playersObj[playerCounter].name
      } Hand<br>${displayHand(hand)}<br><br>Bot Hand<br>${displayHand(
        botHand
      )}<br>${displayPoints()}`;
    } else {
      playersObj[playerCounter].points -= Number(
        playersObj[playerCounter].wager
      );
      return `Oh nooo, you lose! The bot had ${getCurrentSumHand(
        botHand
      )}.<br><br> ${playersObj[playerCounter].name} Hand<br>${displayHand(
        hand
      )}<br><br>Bot Hand<br>${displayHand(botHand)}<br>${displayPoints()}`;
    }
  }

  return `${playersObj[playerCounter].name} Hand<br>${displayHand(
    hand
  )}<br><br>Bot Hand<br>${displayHand(botHand)}<br>${displayPoints()}`;
};

var checkIfAllStand = function () {
  var counter = 0;
  var check = false;
  while (counter < numberOfPlayers) {
    if (playersObj[counter].stand == true) {
      check = true;
    } else {
      check = false;
      break;
    }
  }
  return check;
};

var checkIfAllDone = function () {
  var counter = 0;
  var check = false;
  while (counter < numberOfPlayers) {
    if (playersObj[counter].state == true) {
      check = true;
    } else {
      check = false;
      break;
    }
  }
  return check;
};

var drawBotHand = function () {
  if (getCurrentSumHand(botHand) <= 16) {
    botHand.push(drawOneCard());
    if (checkHandLimit(botHand)) {
      gameState = true;
      var counter = 0;
      while (counter < numberOfPlayers) {
        playersObj[counter].points += playersObj[counter].wager;
        counter++;
      }
      return `Bot Busted! The bot total hand is ${getCurrentSumHand(botHand)}
      <br><br>Congratulations, all of the players win! <br><br>Bot Hand<br>${displayHand(
        botHand
      )}<br>Please press continue to check the updated points.`;
    }

    if (isBlackJack(botHand)) {
      gameState = true;
      var counter = 0;
      while (counter < numberOfPlayers) {
        playersObj[counter].points -= playersObj[counter].wager;
        counter++;
      }
      return `Oh noooo, the bot won! <br><br> Bot Hand<br>${displayHand(
        botHand
      )}<br>Please press continue to check the updated points.`;
    }
  }
  return `<br><br>Bot Hand<br>${displayHand(
    botHand
  )}<br> Please click 'Submit' to continue.`;
};

var main = function (input) {
  if (gameMode == "players") {
    numberOfPlayers = Number(input);
    if (numberOfPlayers > 3 || numberOfPlayers < 1) {
      return "There should be at least 1 player and not over 3 players.";
    } else {
      var counter = 0;
      while (counter < numberOfPlayers) {
        var player = {
          points: 100,
          stand: false,
          hand: [],
          wager: 0,
          name: "",
        };
        playersObj.push(player);
        counter++;
      }
      gameMode = "input";
      return `There will be ${numberOfPlayers} players. Proceed to inputting the names of the players.`;
    }
  }
  if (gameState == true) {
    deck = shuffleCards(makeDeck());
    var outputMessage = "";
    var counter = 0;
    while (counter < numberOfPlayers) {
      outputMessage += `${playersObj[counter].name} now has ${playersObj[counter].points}<br>`;
      playersObj[counter].hand = [];
      counter++;
    }
    gameState = false;
    gameMode = "wager";
    return `${outputMessage}<br><br> You can continue playing by inputting the wager of the first player.`;
  }
  if (gameMode == "input") {
    if (playerCounter < numberOfPlayers) {
      playersObj[playerCounter].name = input;
      playerCounter += 1;
      return `Hi ${
        playersObj[playerCounter - 1].name
      }! Welcome to Blackjack, you start off with ${
        playersObj[playerCounter - 1].points
      } points.<br> Proceed to inputting the name of the next player.`;
    }
    gameMode = "wager";
    playerCounter = 0;
    return `All of the player's name are inputted. Proceeding to getting the wagers.`;
  }

  if (gameMode == "wager") {
    if (playerCounter < numberOfPlayers) {
      playersObj[playerCounter].wager = Number(input);
      playerCounter += 1;
      return `Phew! you waged ${
        playersObj[playerCounter - 1].wager
      } points, let's see if you will win or lose that points.<br><br>
      Proceed to entering the next player wager.`;
    }
    gameMode = "start";
    playerCounter = 0;
    return `All of the player's wagers are inputted. Proceeding to the game.`;
  }

  if (gameMode == "start") {
    var outputMessage = "Blackjack game is now starting, drawing cards.";
    drawCards();
    gameMode = "player";
    return `${outputMessage}<br>Proceeding to ${playersObj[playerCounter].name} turn.`;
  }

  if (gameMode == "player") {
    if (playerCounter == Number(numberOfPlayers)) {
      playerCounter = 0;
      return drawBotHand();
    }

    if (checkIfAllDone()) {
      gameState = true;
      return "Click 'Submit' to continue.";
    }

    var outputMessage = `This is ${playersObj[playerCounter].name}'s turn.<br><br>`;
    if (!turn && !playersObj[playerCounter].stand) {
      outputMessage += `Player Hand<br>${displayHand(
        playersObj[playerCounter].hand
      )}<br><br>Bot Hand<br>${displayHand(
        botHand
      )}<br><br>Do you want to 'hit' or 'stand'?`;
      turn = 1;
      return outputMessage;
    } else {
      if (input == "stand") {
        playersObj[playerCounter].stand = true;
        outputMessage = `You have chosen to stand. <br><br>Player Hand<br>${displayHand(
          playersObj[playerCounter].hand
        )}<br><br>Bot Hand<br>${displayHand(
          botHand
        )}<br><br>Click 'Submit' to continue.`;
        playerCounter += 1;
        turn = 0;
        return outputMessage;
      }
      if (input == "hit") {
        outputMessage += playBlackJackPlayer(playersObj[playerCounter], input);
        playerCounter += 1;
        return outputMessage;
      }
      if (playersObj[playerCounter].stand) {
        outputMessage += playBlackJackPlayer(
          playersObj[playerCounter],
          "stand"
        );
        playerCounter += 1;
        return outputMessage;
      }
    }
  }
};
