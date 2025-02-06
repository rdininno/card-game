"use client";

import { useState } from "react";
import { deal, isValidMove, getCardValue, hasCards } from "../utils/gameLogic";
import Player from "../components/Player";
import Card from "@/components/Card";
import "../app/gametable.css";


const players = ["Robert", "Meghan", "Thomas", "Anthony"];

export default function Home() {
  const [gameState, setGameState] = useState(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playPile, setPlayPile] = useState([]);

  const getNextPlayerIndex = (currentIndex, gameState, numEights = 0) => {
    let nextIndex = (currentIndex + numEights + 1) % players.length;

    while (!hasCards(gameState.table[nextIndex])) {
        nextIndex = (nextIndex + 1) % players.length;

        if (nextIndex === currentIndex) break;
    }

    return nextIndex;
  };
  
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

      updatedGameState.table[playerIndex].hand.inHand.sort((a, b) => getCardValue(a) - getCardValue(b));
      setPlayPile([]);
  
      setCurrentPlayerIndex(getNextPlayerIndex(currentPlayerIndex, updatedGameState));

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
      let numEights = selectedCards.filter(card => card.value === "8").length;
    
      alert(`Player skipped ${numEights} turn(s)!`);

      setPlayPile([...playPile, ...selectedCards]);

      if (checkAndBurnPile(playPile, selectedCards, setPlayPile, setGameState, updatedGameState)) {
        return;
      }

      const playerHand = updatedGameState.table[playerIndex].hand.inHand;
    
      if (updatedGameState.drawPile.length > 0) {
        if (playerHand.length < 3) {
            playerHand.push(updatedGameState.drawPile.pop());
        }
      }

      let nextPlayer = getNextPlayerIndex(currentPlayerIndex, updatedGameState, numEights);

      setTimeout(() => {
        setCurrentPlayerIndex(nextPlayer);
      }, 100);

      setGameState(updatedGameState);
      return;
    } 

    setPlayPile([...playPile, ...selectedCards]);

    if (checkAndBurnPile(playPile, selectedCards, setPlayPile, setGameState, updatedGameState)) {
      return;
    }

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
  
    setCurrentPlayerIndex(getNextPlayerIndex(currentPlayerIndex, updatedGameState));

    setGameState(updatedGameState);
  } 

  const startGame = () => {
    setGameState(deal(players));
  };

  return (
      <div className="gametable">
        <div className="player-zone">
          {!gameState ? (
              <button onClick={startGame} className="btn start-game">Start Game</button>
          ) : (
              <>
                <div className="playpile">
                  {playPile.length > 0 ? (
                    <>
                      {playPile.slice(-4).map((card, index) => (
                        <Card 
                          key={index} 
                          suit={card.suit} 
                          value={card.value} 
                          className={`pile-card pile-card-${index}`} 
                        />
                      ))}
                    </>
                  ) : (
                    <p>No cards played yet</p>
                  )}
                </div>

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
                <h2 className="drawpile">Draw Pile: {gameState.drawPile.length} cards left</h2>
              </>
          )}
        </div>
      </div>
  );
}
