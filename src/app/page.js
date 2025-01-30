"use client";

import { useState } from "react";
import { deal, isValidMove, hasValidMoves } from "../utils/gameLogic";
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

    if (fromFaceDown) {
      selectedCard = updatedGameState.table[playerIndex].hand.faceDown[cardIndex];
    } else if (fromFaceUp) {
      selectedCard = updatedGameState.table[playerIndex].hand.faceUp[cardIndex];
    } else {
      selectedCard = updatedGameState.table[playerIndex].hand.inHand[cardIndex];
    }

    const topCard = playPile.length > 0 ? playPile[playPile.length - 1] : null;

    if (playPile.length > 0 && !isValidMove(selectedCard, topCard, playPile)) {
        alert("Invalid move! You must pick up the play pile.");
        updatedGameState.table[playerIndex].hand.inHand.push(...playPile);
        setPlayPile([]);
        setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
        setGameState(updatedGameState);
        return;
    }

    if (fromFaceDown) {
      updatedGameState.table[playerIndex].hand.faceDown.splice(cardIndex, 1);
    } else if (fromFaceUp) {
      updatedGameState.table[playerIndex].hand.faceUp.splice(cardIndex, 1);
    } else {
      updatedGameState.table[playerIndex].hand.inHand.splice(cardIndex, 1);
    }

    if (selectedCard.value === "2") {
      alert("Build it up");
    } else if (selectedCard.value === "3") {
      alert("Invisible! The next player must play on the card below.");
    } else if (selectedCard.value === "10") {
      if (topCard?.value === "10" || playPile.every(card => card.value === "10")) {
          setPlayPile([...playPile, selectedCard]);
      } else {
          let anyPlayerHasTen = gameState.table.some(player =>
              player.hand.inHand.some(card => card.value === "10")
          );
          if (!anyPlayerHasTen) {
              alert("No more 10s! Last player picks up the pile.");
              updatedGameState.table[playerIndex].hand.inHand.push(...playPile);
              setPlayPile([]);
              setGameState(updatedGameState);
              return;
          } else {
              setPlayPile([...playPile, selectedCard]);
          }
      }
    } else if (selectedCard.value === "8") {
      alert("Player skipped!");
      setCurrentPlayerIndex((currentPlayerIndex + 2) % players.length);
    } 

    setPlayPile([...playPile, selectedCard]);

    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;

    if (!hasValidMoves(updatedGameState.table[nextPlayerIndex].hand.inHand, playPile)) {
        alert(`${updatedGameState.table[nextPlayerIndex].name} has no valid moves! They must pick up the play pile.`);
        updatedGameState.table[nextPlayerIndex].hand.inHand.push(...playPile);
        setPlayPile([]);
        setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
        setGameState(updatedGameState);
        return;
    }

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
