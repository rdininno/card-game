"use client";

import React from "react";
import "../app/card.css";

const suitSymbols = {
  Hearts: "♥",
  Diamonds: "♦",
  Clubs: "♣",
  Spades: "♠"
};

const Card = ({ suit, value, hidden = false, onClick }) => {
    const suitSymbol = suitSymbols[suit] || "";
    const suitClass = suit === "Hearts" || suit === "Diamonds" ? "red" : "black";

    return (
        <div onClick={onClick} className={`card ${suitClass}`}>
            {hidden ? (
                <div className="card-back">🂠</div>
            ) : (
                <>
                    <div className="corner top-left">
                        <div className="card-value">{value}</div>
                        <div className="card-suit">{suitSymbol}</div>
                    </div>

                    <div className="card-center">{suitSymbol}</div>

                    <div className="corner bottom-right">
                        <div className="card-value">{value}</div>
                        <div className="card-suit">{suitSymbol}</div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Card;