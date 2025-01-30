"use client";

import { useState } from "react";
import { deal } from "../utils/gameLogic";
import Player from "../components/Player";

export default function Home() {
    const [gameState, setGameState] = useState(null);
    const players = ["Robert", "Meghan", "Thomas", "Anthony"];

    const startGame = () => {
        setGameState(deal(players));
    };

    return (
        <div>
            <h1>Shithead</h1>
            {!gameState ? (
                <button onClick={startGame}>Start Game</button>
            ) : (
                <>
                    {gameState.table.map((player, index) => (
                        <Player key={index} name={player.name} hand={player.hand} />
                    ))}
                    <h2>Draw Pile: {gameState.drawPile.length} cards left</h2>
                </>
            )}
        </div>
    );
}
