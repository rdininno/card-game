"use client";

import React from "react";
import Card from "./Card";

const Player = ({ name, hand, playerIndex, isCurrentPlayer, handleCardClick, drawPileEmpty }) => {
    return (
        <div>
            <h2>{name} {isCurrentPlayer ? "(Your Turn)" : ""}</h2>

            <h3>Face-Down Cards:</h3>
            <div>
                {hand.faceDown.map((_, i) => (
                    <Card key={i} hidden 
                        onClick={() => {
                            if (isCurrentPlayer && hand.inHand.length === 0 && hand.faceUp.length === 0 && drawPileEmpty) {
                                handleCardClick(playerIndex, i, false, true);
                            }
                        }} />
                ))}
            </div>

            <h3>Face-Up Cards:</h3>
            <div >
                {hand.faceUp.map((card, i) => (
                    <Card key={i} suit={card.suit} value={card.value} 
                    onClick={() => {
                        if (isCurrentPlayer && hand.inHand.length === 0 && drawPileEmpty) {
                            handleCardClick(playerIndex, i, true, false);
                        }
                    }}/>
                ))}
            </div>

            <h3>In-Hand Cards (Click to Play):</h3>
            <div>
                {hand.inHand.map((card, i) => (
                    <Card key={i} suit={card.suit} value={card.value} onClick={() => handleCardClick(playerIndex, i, false, false)} />
                ))}
            </div>
        </div>
    );
};

export default Player;
