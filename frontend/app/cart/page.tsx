import itemCardBucket from '@/components/ItemCardBucket'

    const pathCardImage = "/imageCardExample.jpg"
    const pathCardImage2 = "/pants.jpg"
    const brandName = "Rick Owens"
    const nameItem = "Ramones"
    const sizeItem = "42 IT | RU 44"
    const priceItem = 10000
    const colorItem = "черный"

const item = itemCardBucket(pathCardImage,brandName,nameItem,sizeItem,priceItem,colorItem)
const item2 = itemCardBucket(pathCardImage2,brandName,nameItem,sizeItem,priceItem,colorItem)
export default function Bucket(){
   
    return(
    <main className="h-full">
      <div className="flex flex-row flex-wrap items-start ml-[5%] mr-[8%] min-h-[400px] h-full gap-x-15">
        <div className="flex flex-col w-[10%] mr-[5%] gap-y-5">
          <h1 className="text-4xl font-black uppercase">Корзина</h1>
          <nav className="flex-1">
            <ul className="uppercase underline underline-offset-8 text-nowrap h-full flex flex-col justify-start">
              <li>Главная</li>
              <li className="mt-[8px]">Личный кабинет</li>
            </ul>
          </nav>
        </div>
        <div className='flex flex-col flex-1 gap-y-10'>
          <div className="flex flex-row flex-wrap gap-5">
            {item}
            {item}
            {item2}
            {item}
            {item2}
            {item}
            {item}
            {item2}
            {item}
            {item}
          </div>
          <div className='flex flex-col gap-y-5'>
            <div className='flex flex-row items-end justify-between border-b-2 w-[25%]'>
              <p className='uppercase text-2xl'>Итого</p><p className='uppercase text-xl'>266 440 ₽</p>
            </div>
            <div className='flex flex-col'>
              <p className='uppercase text-xs'>4 товара</p>
              <p className='uppercase text-xs'>Розница</p>
            </div>
            <button className='bg-[#000000] text-white border-solid border-1 rounded-lg w-[25%] h-[3rem]'>Перейти к оплате</button>
          </div>
        </div>
      </div>
    </main>
  );
}

                 
                
                 
                 
             

              
    
