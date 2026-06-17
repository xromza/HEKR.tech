'use client';
import { useEffect, useState } from "react";

export default function useMobile(width: number = 768) {
    const [isMobile, setIsMobile] = useState<boolean | undefined>(false);
    useEffect(() => {
        const checkMobile = () => {
            const mql = window.matchMedia(`(max-width: ${width}px)`);
            setIsMobile(mql.matches);
            console.log(mql.matches);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        }
    }, [width])

    return !!isMobile;
}