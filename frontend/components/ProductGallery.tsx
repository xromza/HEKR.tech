"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { ImagesInterface } from "@/types/ImagesInterface";

interface ProductGalleryProps {
  images: ImagesInterface[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);
  const sortedImages = [...images].sort((a, b) => a.sortOrder - b.sortOrder)
  const mainImage = sortedImages[0];
  const thumbnails = sortedImages.slice(1);

  const openSlider = (index: number) => {
    setInitialSlide(index);
    setIsSliderOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeSlider = () => {
    setIsSliderOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <div className="flex gap-4 h-[450px] md:h-[600px] lg:h-[730px]">
        <div
          className="relative flex-1 bg-[#FBFAF8] rounded-xl overflow-hidden flex items-center justify-center group cursor-pointer"
          onClick={() => openSlider(0)}
        >
          <img
            src={mainImage?.url}
            alt={title}
            className="w-[90%] h-[90%] object-contain"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
        {thumbnails.length !== 0 &&
          <div className="w-1/4 flex flex-col gap-3 h-full">
            {thumbnails.map((img, index) => (
              <div
                key={img.sortOrder}
                onClick={() => openSlider(index)}
                className="flex-1 bg-[#FBFAF8] rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-80 transition"
              >
                <img
                  src={img.url}
                  alt={title}
                  className="w-[90%] h-[90%] object-contain"
                />
              </div>
            ))}
          </div>
        }
      </div>

      {isSliderOpen && (
        <div className="fixed inset-0 z-[100] bg-[#FAFAFA] flex items-center justify-center">

          <button
            onClick={closeSlider}
            className="absolute top-8 right-8 z-[110] p-2 text-gray-500 hover:text-black transition cursor-pointer"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <button className="swiper-custom-prev absolute left-4 md:left-12 z-[110] p-4 text-gray-400 hover:text-black transition cursor-pointer">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button className="swiper-custom-next absolute right-4 md:right-12 z-[110] p-4 text-gray-400 hover:text-black transition cursor-pointer">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <div className="w-full h-full max-w-[1200px] flex items-center justify-center px-4">
            <Swiper
              modules={[Navigation]}
              initialSlide={initialSlide}
              loop={true}
              navigation={{
                nextEl: '.swiper-custom-next',
                prevEl: '.swiper-custom-prev',
              }}
              spaceBetween={80}
              slidesPerView={1}
              speed={600}
              touchRatio={1.2}
              resistanceRatio={0.5}
              className="w-full h-[80vh] smooth-swiper"
            >
              {sortedImages.map((img) => (
                <SwiperSlide key={img.id} className="flex items-center justify-center w-full h-full">
                  <img
                    src={img.url}
                    alt={title}
                    className="w-full h-full object-contain mx-auto"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
}