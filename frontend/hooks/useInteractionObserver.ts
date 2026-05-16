import {useEffect, useRef} from 'react'

export function useInteractionObserver(callback: () => void, dependencies: any[]) {
    const observationTarget = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    callback()
                }
            },
            {threshold: 1.0}
        );

        if (observationTarget.current) {
            observer.observe(observationTarget.current)
        }
        return () => observer.disconnect();
    }, dependencies)

    return observationTarget;
}