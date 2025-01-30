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
    
    const handleCardClick = (playerIndex, cardIndex) => {
      if (playerIndex !== currentPlayerIndex) {
        alert("It's not your turn!");
        return;
      }

      const selectedCard = gameState.table[playerIndex].hand.inHand[cardIndex];
      
      const updatedGameState = {...gameState};

      updatedGameState.table[playerIndex].hand.inHand.splice(cardIndex, 1);

      setGameState(updatedGameState);

      setPlayPile([...playPile, selectedCard]);

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
                          handleCardClick={handleCardClick}/>
                    ))}
                    <h2>Draw Pile: {gameState.drawPile.length} cards left</h2>
                </>
            )}
        </div>
    );
}
