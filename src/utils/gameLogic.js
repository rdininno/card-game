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