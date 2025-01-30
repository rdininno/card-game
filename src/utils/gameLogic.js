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
        if (playPile[i].value !== "3") return playPile[i];
    }
    return playPile[0];
}

export function isValidMove(selectedCard, topCard, playPile) {
    if (!topCard) return true;

    if (selectedCard.value === "10" && topCard.value !== "7") return true;

    if (topCard.value === "10" && selectedCard.value !== "10") return false;

    if (selectedCard.value === "2" && topCard.value !== "10") return true;
    if (selectedCard.value === "3" && topCard.value !== "10") return true;

    if (topCard.value === "7") {
        return getCardValue(selectedCard) <= 7;
    }

    let lastVisibleCard = getLastVisibleCard(playPile);
    return getCardValue(selectedCard) >= getCardValue(lastVisibleCard);
}

export function hasValidMoves(hand, playPile) {
    if (playPile.length === 0) return true;

    const topCard = playPile[playPile.length - 1];
    return hand.some(card => isValidMove(card, topCard, playPile));
}