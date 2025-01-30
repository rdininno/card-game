"use client";

import react from "react";

const Card = ({ suit, value, hidden = false, onClick }) => {
    return (
        <div onClick={onClick}>
            {hidden ? "🂠" : `${value} of ${suit}`}
        </div>
    );
};

export default Card;