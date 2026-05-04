'use client'
import Image from 'next/image'
import MainButton from '@/components/mainButton';


export default function Home() {
  const backgroundImageModel = {
        backgroundImage: 'url("/homePage_backText.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
    };
  
  return (
  <main className=''>
    <div className='flex flex-col flex-end w-full  mt-[15rem]  backgroundImage: ' style={backgroundImageModel}>
          <Image
           src="/homePage_models.webp" 
           width={736} 
           height={916} 
           alt="Логотип компании HEKR, состоящий из белых букв, написанных по часовой стрелке, на черном фоне " 
           className='ml-[25%] mr-[25%]'
           />
        <div className='bg-[#E8E7E3] flex flex-row justify-between items-center h-[3rem]' >
        <span className='font-bold'>СКИДКА 20% НА ВСЕ ПРОДУКТЫ</span><span className='font-bold'>СКИДКА 20% НА ВСЕ ПРОДУКТЫ</span><span className='font-bold'>СКИДКА 20% НА ВСЕ ПРОДУКТЫ</span><span className='font-bold'>СКИДКА 20% НА ВСЕ ПРОДУКТЫ</span><span className='font-bold'>СКИДКА 20% НА ВСЕ ПРОДУКТЫ</span>
        </div>
      </div>
      <article className='flex flex-col justify-between bg-[#FFFFFF] mt-[12rem] mb-[12rem] ml-[5%] mr-[5%] h-[23rem]'>
        <h2 className='uppercase text-5xl font-semibold mb-[3rem]'>Часто задаваемые вопросы</h2>
        <div className='flex flex-col justify-between h-[95%]'>
          <div className='flex flex-row justify-between w-full'>
            <div className='border-b w-[95%]'>
              <h3 className='uppercase text-3xl font-normal'>Можно ли вернуть товар при обнаружении брака?</h3>
              <p id='text1' className='uppercase w-[45%]'></p>
            </div>
             <MainButton
            targetId="text1"
            text="fefefefesf"
            />
          </div>
         <div className='flex flex-row justify-between w-full'>
            <div className='border-b w-[95%]'>
              <h3 className='uppercase text-3xl font-normal'>По какому принципу работает оптовая закупка?</h3>
              <p id='text2'className='uppercase w-[45%]'></p>
            </div>
            <MainButton
            targetId="text2"
            text="fefefefesf"
            />
          </div>
          <div className='flex flex-row justify-between w-full'>
            <div className='border-b w-[95%]'>
              <h3 className='uppercase text-3xl font-normal'>Доставка задерживается. Могу ли отменить заказ?</h3>
              <p id='text3' className='uppercase w-[45%]' ></p>
            </div>
            <MainButton
            targetId="text3"
            text="У каждого товара есть своё фиксированное количество, при заказе которого включается режим “оптовая закупка”, цена за единицу товара уменьшается и вы заказываете оптом"
            />
          </div>
          <div className='flex flex-row justify-between w-full'>
            <div className='border-b w-[95%]'>
              <h3 className='uppercase text-3xl font-normal'>Можно ли вернуть товар при обнаружении брака?</h3>
              <p id='text4' className='uppercase w-[45%] '></p>
            </div>
            <MainButton
            targetId="text4"
            text="fefefefesf"
            />
          </div>
        </div>
      </article>
      <article className='flex flex-row  justify-between ml-[5%] mr-[5%]'>
          <div className='flex flex-col justify-between w-[50%] h-[90%] mt-[10%]'>
              <h2 className='uppercase font-normal text-5xl font-semibold'>О нас <span className='text-[#b3b3b3]'>HEKR</span></h2>
              <p className='uppercase font-normal text-2xl  mt-[2rem] text-left'>Hekr Store - это интернет-магазин для тех, кто ценит стиль и любит модно одеваться. Мы представляем лучшие мировые бренды, такие как: Gucci, Prada, Moncler, Maison Margiela и другие.</p>
              <p className='uppercase font-normal text-2xl  mt-[2rem] text-left'>C 2020 года мы обслуживаем тысячи клиентов по всей россии. У нас закупаются лучшие оптовики и лучшие розничные клиенты. Мы - это про стиль, мы - это про ответственность и силу на рынке.</p>
              <div className='flex flex-row justify-between w-[70%] mt-[2rem]'>
                <div className='bg-[#fcfcfc] w-[40%] h-full p-4 border-solid border-1 rounded-2xl border-[#e3e3e3]'><span className='font-extrabold text-5xl tracking-wider ml-[5%]'>22+</span><p className='ml-[5%] text-[#626262]'>брендов</p></div>
                <div className='bg-[#fcfcfc] w-[40%] h-full p-4 border-solid border-1 rounded-2xl border-[#e3e3e3]'><span className='font-extrabold text-5xl tracking-wider ml-[5%]'>15K</span><p className='ml-[11%] text-[#626262]'>товаров</p></div>
              </div>
          </div>
          <Image src="/about_us.jpg"
          width={660}
          height={687}
          alt='Модель'/>
      </article>
  </main>
  );
}
