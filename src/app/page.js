"use client";

import { useState } from "react";
import { deal, isValidMove } from "../utils/gameLogic";
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
    let selectedCards = [];

    if (fromFaceDown) {
      selectedCard = updatedGameState.table[playerIndex].hand.faceDown[cardIndex];
      selectedCards = [selectedCard];
    
      updatedGameState.table[playerIndex].hand.faceDown.splice(cardIndex, 1);
    } else if (fromFaceUp) {
      selectedCard = updatedGameState.table[playerIndex].hand.faceUp[cardIndex];
      selectedCards = [selectedCard];
    
      updatedGameState.table[playerIndex].hand.faceUp.splice(cardIndex, 1);
    } else {
      selectedCard = updatedGameState.table[playerIndex].hand.inHand[cardIndex];
      selectedCards = updatedGameState.table[playerIndex].hand.inHand.filter(card => card.value === selectedCard.value);
    }

    const topCard = playPile.length > 0 ? playPile[playPile.length - 1] : null;

    if (playPile.length > 0 && !isValidMove(selectedCard, topCard, playPile)) {
      alert("Invalid move! You must pick up the play pile.");
  
      if (fromFaceDown) {
          updatedGameState.table[playerIndex].hand.faceDown.splice(cardIndex, 1);
      } else if (fromFaceUp) {
          updatedGameState.table[playerIndex].hand.faceUp.splice(cardIndex, 1);
      } else {
          updatedGameState.table[playerIndex].hand.inHand = updatedGameState.table[playerIndex].hand.inHand.filter(card => !selectedCards.includes(card));
      }
  
      const newPlayPile = [...playPile, ...selectedCards];
      setPlayPile(newPlayPile);
  
      updatedGameState.table[playerIndex].hand.inHand.push(...newPlayPile);
      setPlayPile([]);
  
      setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
      setGameState(updatedGameState);
      return;
    }

    if (fromFaceDown) {
      updatedGameState.table[playerIndex].hand.faceDown.splice(cardIndex, 1);
    } else if (fromFaceUp) {
      updatedGameState.table[playerIndex].hand.faceUp = updatedGameState.table[playerIndex].hand.faceUp.filter(card => card.value !== selectedCard.value);
    } else {
      updatedGameState.table[playerIndex].hand.inHand = updatedGameState.table[playerIndex].hand.inHand.filter(card => card.value !== selectedCard.value);
    }

    if (selectedCard.value === "2") {
      alert("Build it up!");
      setPlayPile([...playPile, selectedCard]);
      setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
      setGameState(updatedGameState);
    } else if (selectedCard.value === "3") {
      alert("Invisible! The next player must play on the card below.");
      setPlayPile([...playPile, selectedCard]);
      setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
      setGameState(updatedGameState);
    } else if (selectedCard.value === "10") {
      if (topCard && topCard.value === "10" && selectedCard.value !== "10") {
        alert("You must play a 10 on a 10! Pick up the pile.");
        updatedGameState.table[playerIndex].hand.inHand.push(...playPile);
        setPlayPile([]);
        setGameState(updatedGameState);
        setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    }
    } else if (selectedCard.value === "8") {
      alert("Player skipped!");

      let nextPlayer = (currentPlayerIndex + 2) % players.length;

      setTimeout(() => {
          setCurrentPlayerIndex(nextPlayer);
      }, 100); 

      setGameState(updatedGameState);
    } 

    setPlayPile([...playPile, ...selectedCards]);

    const playerHand = updatedGameState.table[playerIndex].hand.inHand;
    const cardsPlayed = selectedCards.length;
    
    if (updatedGameState.drawPile.length > 0) {
      if (playerHand.length >= 3) {
        playerHand.push(updatedGameState.drawPile.pop());
      } else {
        const cardsToPickUp = Math.min(cardsPlayed, updatedGameState.drawPile.length);
        for (let i = 0; i < cardsToPickUp; i++) {
          playerHand.push(updatedGameState.drawPile.pop());
        }
      }
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
