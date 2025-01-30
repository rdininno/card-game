"use client";

import { useState } from "react";
import { deal } from "../utils/gameLogic";
import Player from "../components/Player";
import Card from "@/components/Card";

const players = ["Robert", "Meghan", "Thomas", "Anthony"];

export default function Home() {
    const [gameState, setGameState] = useState(null);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [playPile, setPlayPile] = useState([]);
    
    const handleCardClick = (playerIndex, cardIndex, fromFaceUp = false, fromFaceDown = false) => {
      if (playerIndex !== currentPlayerIndex) {
        alert("It's not your turn!");
        return;
      }

      const updatedGameState = {...gameState};
      
      let selectedCard;

      if(fromFaceDown) {
        selectedCard = updatedGameState.table[playerIndex].hand.faceDown[cardIndex];
        updatedGameState.table[playerIndex].hand.faceDown.splice(cardIndex, 1);
      } else if (fromFaceUp) {
        selectedCard = updatedGameState.table[playerIndex].hand.faceUp.splice(cardIndex, 1)[0];
      } else {
        selectedCard = gameState.table[playerIndex].hand.inHand[cardIndex];
        updatedGameState.table[playerIndex].hand.inHand.splice(cardIndex, 1);
      }
      
      setPlayPile([...playPile, selectedCard]);
      
      while (
        updatedGameState.drawPile.length > 0 &&
        updatedGameState.table[playerIndex].hand.inHand.length < 3
      ) {
        const newCard = updatedGameState.drawPile.pop();
        updatedGameState.table[playerIndex].hand.inHand.push(newCard);
      }

      if (
        updatedGameState.table[playerIndex].hand.inHand.length === 0 &&
        updatedGameState.table[playerIndex].hand.faceUp.length === 0 &&
        updatedGameState.table[playerIndex].hand.faceDown.length === 0
      ) {
        alert(`${updatedGameState.table[playerIndex].name} is out!`);
      }

      const playersWithCards = updatedGameState.table.filter(player => 
        player.hand.inHand.length > 0 ||
        player.hand.faceUp.length > 0 ||
        player.hand.faceDown.length > 0
      );

      if (playersWithCards.length === 1) {
        alert(`${playersWithCards[0].name} You are the Shithead!`);
        return;
      }

      setGameState(updatedGameState);

      setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    }

    const startGame = () => {
        setGameState(deal(players));
    };

    return (
        <div>
            <h1>Shithead</h1>

            <h3>Play Pile:</h3>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                {playPile.length > 0 ? (
                    <Card suit={playPile[playPile.length - 1].suit} value={playPile[playPile.length - 1].value} />
                ) : (
                    <p>No cards played yet</p>
                )}
            </div>

            {!gameState ? (
                <button onClick={startGame}>Start Game</button>
            ) : (
                <>
                    {gameState.table.map((player, index) => (
                        <Player 
                          key={index}
                          name={player.name}
                          hand={player.hand}
                          playerIndex={index} 
                          isCurrentPlayer={index === currentPlayerIndex}
                          handleCardClick={handleCardClick}
                          drawPileEmpty={gameState.drawPile.length === 0}
                        />
                    ))}
                    <h2>Draw Pile: {gameState.drawPile.length} cards left</h2>
                </>
            )}
        </div>
    );
}
