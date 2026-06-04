import Image from 'next/image'
import SliderDiscount from '@/components/SliderDiscount';
import FAQ from '@/components/FAQ';
import AboutImage from '@/components/AboutImage';
import Parallax from '@/components/Parallax';

export default function Home() {
  const backgroundImageModel = {
    backgroundImage: 'url("/homePage_backText.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
  };

  return (
    <main>
      <div className='flex justify-center w-full' style={backgroundImageModel}>
        <Image
          src="/main_asian.png"
          width={736}
          height={916}
          alt="Логотип компании HEKR, состоящий из белых букв, написанных по часовой стрелке, на черном фоне "
          className='select-none'
        />
      </div>
      <SliderDiscount />
      <div className="max-w-[1920px] mx-auto"><FAQ />
      </div>
      <article className='uppercase grid mx-auto max-w-[1920px] grid-cols-1 gap-2 md:gap-[8rem] px-6 md:px-[6rem] lg:grid-cols-2'>
        <div className='flex flex-col gap-6'>
          <h2 className='font-normal text-4xl md:text-5xl mb-4 font-semibold'>О нас <span className='text-[#b3b3b3]'>HEKR</span></h2>
          <p className='font-normal text-2xl text-left'>Hekr Store - это интернет-магазин для тех, кто ценит стиль и любит модно одеваться. Мы представляем лучшие мировые бренды, такие как: Gucci, Prada, Moncler, Maison Margiela и другие.</p>
          <p className='font-normal text-2xl text-left'>C 2020 года мы обслуживаем тысячи клиентов по всей россии. У нас закупаются лучшие оптовики и лучшие розничные клиенты. Мы — это про стиль, мы — это про ответственность и силу на рынке.</p>
          <div className='grid grid-cols-2 gap-3 md:gap-12 h-full items-center'>
            <div className='bg-[#fcfcfc] p-4 border-solid border-1 rounded-2xl border-[#e3e3e3]'>
              <span className='font-bold text-5xl tracking-wider'>22+</span>
              <p className='text-[#626262]'>брендов</p>
            </div>
            <div className='bg-[#fcfcfc] p-4 border-solid border-1 rounded-2xl border-[#e3e3e3]'>
              <span className='font-bold text-5xl tracking-wider'>15K</span>
              <p className='text-[#626262]'>товаров</p>
            </div>
          </div>
        </div>
        <AboutImage />
      </article>
    </main>
  );
}
