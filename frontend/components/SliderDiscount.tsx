"use client";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Open_Sans } from "next/font/google";

import 'swiper/css';
import 'swiper/css/autoplay';

const open_sans = Open_Sans({
    subsets: ['latin', 'cyrillic'],
    weight: ['400', '600', '700', '800'],
    variable: '--font-inter',
});

export default function SliderDiscount() {

    const text = "СКИДКА 20% на все продукты";
    const duplicates = Array(20).fill(text);

    return (
        <div className="w-full p-3 bg-[#E8E7E3]">
            <style dangerouslySetInnerHTML={{
                __html: `
                .ticker-swiper .swiper-wrapper {
                    transition-timing-function: linear !important;
                    display: flex !important;
                }
            `}} />
            <Swiper
                slidesPerView={"auto"}
                spaceBetween={50}
                modules={[Autoplay]}
                autoplay={{ delay: 0, disableOnInteraction: false }}
                speed={8000}
                loopAdditionalSlides={5}
                allowTouchMove={false}
                className="pointer-events-none ticker-swiper"
                loop={true}
            >
                {duplicates.map((item, idx) => (
                    <SwiperSlide key={idx} className="!w-auto">
                        <div className={`${open_sans.className} font-bold uppercase`}>
                            {item}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}