"use client";

import React from "react";
import Card from "./Card";

const Player = ({ name, hand }) => {
    return (
        <div>
            <h2>{name}</h2>

            <h3>Face-Down Cards:</h3>
            <div style={{ display: "flex", gap: "10px" }}>
                {hand.faceDown.map((_, i) => (
                    <Card key={i} hidden />
                ))}
            </div>

            <h3>Face-Up Cards:</h3>
            <div style={{ display: "flex", gap: "10px" }}>
                {hand.faceUp.map((card, i) => (
                    <Card key={i} suit={card.suit} value={card.value} />
                ))}
            </div>

            <h3>In-Hand Cards:</h3>
            <div style={{ display: "flex", gap: "10px" }}>
                {hand.inHand.map((card, i) => (
                    <Card key={i} suit={card.suit} value={card.value} />
                ))}
            </div>
        </div>
    );
};

export default Player;
