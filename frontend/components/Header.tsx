'use client'
import Image from 'next/image'
import { useState } from 'react'
import Login from './Login';
import { useRouter } from 'next/navigation';

export default function Header() {
  let count_of_brands = 0;
  let count_of_female = 0;
  let count_of_man = 0;
  let count_of_sale = 0;
  const router = useRouter();
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const toggleLogin = () => setIsLoginVisible(!isLoginVisible);
  const closeLogin = () => setIsLoginVisible(false);

  return (
    <header className='absolute bg-white w-full h-[200px] '>
      <div className='flex flex-row w-full h-[80%] items-end justify-around uppercase ml-[1%]'>
        <button
          onClick={() => router.push("/")}
          className="cursor-pointer"
          
          >
          <Image src="https://res.cloudinary.com/dcc2qkmq7/image/upload/v1777939108/logo_ryssvy.svg"
            width={96}
            height={69}
            alt="Логотип компании HEKR, состоящий из белых букв, написанных по часовой стрелке, на черном фоне " />
        </button>
        <nav className='w-[80%] flex flex-row items-center justify-between h-[50%] '>
          <ul className='w-[60%] flex flex-row justify-between'>
            <li><a className='hover:underline'>Sale</a><span className='text-gray-300'> {count_of_sale}</span></li>
            <li><a className='hover:underline'>Мужская коллекция</a><span className='text-gray-300'> {count_of_man}</span></li>
            <li><a className='hover:underline'>Женская коллекция</a><span className='text-gray-300'> {count_of_female}</span></li>
            <li><a className='hover:underline'>Бренды</a><span className='text-gray-300'> {count_of_brands}</span></li>
          </ul>
          <ul className='w-[25%] flex flex-row flex-nowrap justify-between '>
            <li className='flex flex-row'><Image src="./header_icon_logIn.svg" alt="" width={24} height={24} /><button className='uppercase hover:underline' onClick={toggleLogin}>Войти</button></li>
            <li className='flex flex-row'><Image src="./header_icon_search.svg" alt="" width={24} height={24} />Поиск</li>
            <li className='flex flex-row'><Image src="./header_icon_bucket.svg" alt="" width={24} height={24} />Корзина</li>
          </ul>
        </nav>
      </div>
      <Login isVisible={isLoginVisible} onClose={closeLogin} />
    </header>
  );
}