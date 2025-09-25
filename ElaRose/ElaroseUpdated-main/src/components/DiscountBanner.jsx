import { useEffect, useState } from 'react';

const DiscountBanner = ({ discounts, currentIndex, message }) => {
    const [displayMessage, setDisplayMessage] = useState(message);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (discounts.length > 1) {
            setIsAnimating(true);

            // Small delay to trigger animation
            const timeout = setTimeout(() => {
                setDisplayMessage(message);
                setIsAnimating(false);
            }, 150);

            return () => clearTimeout(timeout);
        } else {
            setDisplayMessage(message);
        }
    }, [currentIndex, message, discounts.length]);

    return (
        <span
            className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'
                }`}
        >
            {displayMessage}
        </span>
    );
};

export default DiscountBanner;