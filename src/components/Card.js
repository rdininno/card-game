import react from "react";

const Card = ({ suit, value, hidden = false }) => {
    return (
        <div>
            {hidden ? "🂠" : `${value} of ${suit}`}
        </div>
    );
};

export default Card;