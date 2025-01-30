import react from "react";

const Card = ({ suit, value }) => {
    return (
        <div>
            {value} of {suit}
        </div>
    );
};

export default Card;