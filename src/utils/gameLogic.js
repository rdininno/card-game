const suits = ["Spades", "Diamonds", "Clubs", "Hearts"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

// Create a full deck
export function getDeck() {
    let deck = [];

    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }

    return deck;
}

// Shuffle the deck
export function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); 
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap
    }
    return deck;
}

export function deal(players) {
    let deck = shuffle(getDeck());
    let table = [];

    for (let j = 0; j < players.length; j++) {
        let playerHand = {
            faceDown: [],
            faceUp: [],
            inHand: []
        };

        for (let i = 0; i < 9; i++) {
            let card = deck.pop();

            if (i < 3) {
                card.position = "face-down";
                playerHand.faceDown.push(card);
            } else if (i < 6) {
                card.position = "face-up";
                playerHand.faceUp.push(card);
            } else {
                card.position = "in-hand";
                playerHand.inHand.push(card);
            }
        }

        table.push({
            name: players[j],
            hand: playerHand
        });
    }
    return { table, drawPile: deck };
}

export function getCardValue(card) {
    const valueMap = {
        "A": 14, "K": 13, "Q": 12, "J": 11,
        "10": 10, "9": 9, "8": 8, "7": 7, "6": 6,
        "5": 5, "4": 4, "3": 3, "2": 2
    };
    return valueMap[card.value] || 0;
}

function getLastVisibleCard(playPile) { 
    for (let i = playPile.length - 1; i >= 0; i--) {
        if (playPile[i].value !== "3") {
            return playPile[i];
        }
    }
    return playPile[0];
}

export function isValidMove(selectedCard, topCard, playPile) {
    if (!topCard) return true;

    if (selectedCard.value === "10" && topCard.value !== "7") return true;
    if (topCard.value === "10" && selectedCard.value !== "10") return false;

    if (selectedCard.value === "2" && topCard.value !== "10") return true;
    if (selectedCard.value === "3" && topCard.value !== "10") return true;
    
    let lastVisibleCard = getLastVisibleCard(playPile);

    if (topCard.value === "7" || lastVisibleCard.value === "7") {
        return getCardValue(selectedCard) <= 7;
    }

    return getCardValue(selectedCard) >= getCardValue(lastVisibleCard);
}

export function hasCards(player) {
    return (
        player.hand.inHand.length > 0 ||
        player.hand.faceUp.length > 0 ||
        player.hand.faceDown.length > 0
    );
}

export function getNextPlayerIndex(currentIndex, gameState, numEights = 0) {
    let nextIndex = (currentIndex + numEights + 1) % gameState.table.length;

    while (!hasCards(gameState.table[nextIndex])) {
        nextIndex = (nextIndex + 1) % gameState.table.length;

        if (nextIndex === currentIndex) break;
    }

    return nextIndex;
}

export function checkAndBurnPile(
    playPile, 
    selectedCards, 
    setPlayPile, 
    setGameState, 
    updatedGameState, 
    currentPlayerIndex, 
    setCurrentPlayerIndex
) {
    const newPile = [...playPile, ...selectedCards];
    const lastFourCards = newPile.slice(-4);

    if (lastFourCards.length === 4 && lastFourCards.every(card => card.value === lastFourCards[0].value)) {
        alert("🔥 Pile burned! All cards discarded. You get another turn!");

        setPlayPile([]);

        if (removePlayerFromGame(currentPlayerIndex, updatedGameState, setGameState, setCurrentPlayerIndex)) {
            return true;
        }

        setGameState(updatedGameState);
        return true;
    }

    return false;
}

export function removePlayerFromGame(currentPlayerIndex, updatedGameState, setGameState, setCurrentPlayerIndex) {
    if (currentPlayerIndex >= updatedGameState.table.length) {
        return false;
    }

    const player = updatedGameState.table[currentPlayerIndex];

    if (!player || !player.hand) {
        return false;
    }

    if (
        player.hand.inHand.length === 0 &&
        player.hand.faceUp.length === 0 &&
        player.hand.faceDown.length === 0
    ) {
        alert(`${player.name} is out of the game!`);

        updatedGameState.table.splice(currentPlayerIndex, 1);

        if (updatedGameState.table.length === 1) {
            alert(`${updatedGameState.table[0].name}, you are the Shithead!`);
            setGameState(updatedGameState);
            return true;
        }

        const nextPlayer = getNextPlayerIndex(
            Math.max(0, currentPlayerIndex - 1), 
            updatedGameState
        );
        setCurrentPlayerIndex(nextPlayer);
    }

    setGameState(updatedGameState);
    return false;
}