import React, { useState, useEffect, useRef } from 'react'

export default function useIntersection(element: React.MutableRefObject<Element>, rootMargin: string): boolean {
    const [isVisible, setState] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setState(entry.isIntersecting);
            }, { rootMargin }
        );

        element.current && observer.observe(element.current);

        return () => observer.disconnect();
    }, []);

    return isVisible;
};
