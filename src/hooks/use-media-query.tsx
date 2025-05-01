import { useState, useEffect } from 'react';

/**
 * A hook that returns whether the specified media query matches the current viewport
 * @param query The media query to check
 * @returns A boolean indicating whether the media query matches
 */
export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);

        // Set initial value
        setMatches(mediaQuery.matches);

        // Define callback for changes
        const handleChange = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Add event listener
        mediaQuery.addEventListener('change', handleChange);

        // Clean up
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [query]);

    return matches;
};

export default useMediaQuery;