export default function CartOrder(){
    return(
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
    )
}