"use client";

import React from "react";
import Card from "./Card";
import "../app/player.css";


const Player = ({ name, hand, playerIndex, isCurrentPlayer, handleCardClick, drawPileEmpty }) => {
    return (
        <div className="player">
            <h2 className="player-name">{name} {isCurrentPlayer ? "(Your Turn)" : ""}</h2>

            <div className="player-hand">
                <div className="player-cards facedown">
                    {hand.faceDown.map((_, i) => (
                        <Card 
                            key={i} 
                            hidden 
                            onClick={() => {
                                if (isCurrentPlayer && hand.inHand.length === 0 && hand.faceUp.length === 0 && drawPileEmpty) {
                                    handleCardClick(playerIndex, i, false, true);
                                }
                            }} />
                    ))}
                </div>

                <div className="player-cards faceup">
                    {hand.faceUp.map((card, i) => (
                        <Card key={i} suit={card.suit} value={card.value} 
                        onClick={() => {
                            if (isCurrentPlayer && hand.inHand.length === 0 && drawPileEmpty) {
                                handleCardClick(playerIndex, i, true, false);
                            }
                        }}/>
                    ))}
                </div>

                <div className="player-cards inhand">
                    {hand.inHand.map((card, i) => (
                        <Card key={i} suit={card.suit} value={card.value} onClick={() => handleCardClick(playerIndex, i, false, false)} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Player;
