'use client';

import { useState } from 'react';

interface ToggleTextButtonProps {
  targetId: string;
  text: string;
}

export default function MainButton({ 
  targetId, 
  text, 
}: ToggleTextButtonProps) {
  const [isTextVisible, setIsTextVisible] = useState(false);

  const handleToggle = () => {
    const targetElement = document.getElementById(targetId);
    
    if (!targetElement) {
      console.error(`Элемент с id "${targetId}" не найден`);
      return;
    }

    if (!isTextVisible) {
      targetElement.textContent = text;
      targetElement.className="uppercase w-[45%] mt-[1rem] mb-[1rem]";
    } else {
      targetElement.textContent = '';
      targetElement.className="";
    }
    
    setIsTextVisible(!isTextVisible);
  };

  if(!isTextVisible){
  return (
    <button 
      onClick={handleToggle}
      className="rounded-full bg-[#EDEDEB] w-[35px] h-[35px]"
    >
     +
    </button>
  );
}
else{
    return (
    <button 
      onClick={handleToggle}
      className="rounded-full bg-[#000000] w-[35px] h-[35px] text-[#FFFFFF] rotate-45"
    >
     +
    </button>
  );
}
}