import Image from 'next/image'
import SliderDiscount from '@/components/SliderDiscount';
import FAQ from '@/components/FAQ';
import AboutImage from '@/components/AboutImage';

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
          src="https://res.cloudinary.com/dcc2qkmq7/image/upload/main_e9xeff.png"
          width={736}
          height={916}
          alt="Логотип компании HEKR, состоящий из белых букв, написанных по часовой стрелке, на черном фоне "
          className=''
        />
      </div>
      <SliderDiscount />
      <FAQ />
      <article className='uppercase grid grid-cols-1 gap-2 md:gap-[8rem] px-6 md:px-[6rem] lg:grid-cols-2'>
        <div className='flex flex-col gap-6'>
          <h2 className='font-normal text-4xl md:text-5xl mb-4 font-semibold'>О нас <span className='text-[#b3b3b3]'>HEKR</span></h2>
          <p className='font-normal text-2xl text-left'>Hekr Store - это интернет-магазин для тех, кто ценит стиль и любит модно одеваться. Мы представляем лучшие мировые бренды, такие как: Gucci, Prada, Moncler, Maison Margiela и другие.</p>
          <p className='font-normal text-2xl text-left'>C 2020 года мы обслуживаем тысячи клиентов по всей россии. У нас закупаются лучшие оптовики и лучшие розничные клиенты. Мы — это про стиль, мы — это про ответственность и силу на рынке.</p>
          <div className='grid grid-cols-2 gap-3 md:gap-12 lg:me-[10rem]'>
            <div className='bg-[#fcfcfc] h-full p-4 border-solid border-1 rounded-2xl border-[#e3e3e3]'>
              <span className='font-extrabold text-5xl tracking-wider'>22+</span>
              <p className='text-[#626262]'>брендов</p>
            </div>
            <div className='bg-[#fcfcfc] h-full p-4 border-solid border-1 rounded-2xl border-[#e3e3e3]'>
              <span className='font-extrabold text-5xl tracking-wider'>15K</span>
              <p className='text-[#626262]'>товаров</p>
            </div>
          </div>
        </div>
        <AboutImage/>
      </article>
    </main>
  );
}
