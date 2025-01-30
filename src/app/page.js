"use client"; 

import { useState } from "react";
import { getDeck, shuffle } from "../utils/gameLogic";
import styles from "./page.module.css";
import Card from "@/components/Card";

export default function Home() {
    const [deck, setDeck] = useState(getDeck());

    const shuffleDeck = () => {
        setDeck([...shuffle(deck)]);
    };

    return (
        <div>
            <h1>Full Card Deck</h1>
            <button onClick={shuffleDeck}>Shuffle Deck</button>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginTop: "20px" }}>
                {deck.map((card, index) => (
                    <Card key={index} suit={card.suit} value={card.value} />
                ))}
            </div>
        </div>
    );
}
