'use client';

import { Dispatch, SetStateAction } from "react";

interface MainButtonProps {
  isTextVisible: boolean;
  setIsTextVisible: Dispatch<SetStateAction<boolean>>;
}


export default function MainButton({ isTextVisible, setIsTextVisible }: MainButtonProps) {

  return (
    <button
      onClick={() => setIsTextVisible(!isTextVisible)}
      className={`${isTextVisible ? "bg-[#000000] text-[#FFFFFF] rotate-45" : "bg-[#EDEDEB]"}
       transition duration-300 rounded-full 
       w-[35px] h-[35px] cursor-pointer`}
    >
      +
    </button>
  );
}