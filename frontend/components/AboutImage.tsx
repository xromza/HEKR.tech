"use client";

import Image from "next/image";
import Parallax from "./Parallax";
import useMobile from "@/hooks/useMobile";

export default function AboutImage() {
    const isMobile = useMobile();
    return (
        <div>
            {isMobile ?
                <div className="flex items-center mt-35 relative justify-center bg-gray-100 rounded-3xl p-4 pb-0">
                    <Image src="https://res.cloudinary.com/dcc2qkmq7/image/upload/about_m39rgz.png"
                        width={660}
                        height={687}
                        alt='Модель'
                        className='-mt-30 select-none'
                    />
                </div>
                :
                <Parallax>
                    <div className="flex items-center mt-5 relative justify-center bg-gray-100 rounded-3xl p-4 pb-0 [transform-style:preserve-3d]">
                        <Image src="https://res.cloudinary.com/dcc2qkmq7/image/upload/about_m39rgz.png"
                            width={660}
                            height={687}
                            alt='Модель'
                            className='-mt-30 select-none antialiased'
                            style={{ transform: "translateZ(25px)" }}
                        />
                    </div>
                </Parallax>
            }
        </div>
    )
}