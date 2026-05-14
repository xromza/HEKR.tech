import itemCardBucket from '@/components/ItemCardBucket'
import CartOrder from '@/components/cartOrder'
import NavCart from '@/components/navCart'

    const pathCardImage = "/imageCardExample.jpg"
    const pathCardImage2 = "/pants.jpg"
    const brandName = "Rick Owens"
    const nameItem = "Ramones"
    const sizeItem = "42 IT | RU 44"
    const priceItem = 10000
    const colorItem = "черный"

const item = itemCardBucket(pathCardImage,brandName,nameItem,sizeItem,priceItem,colorItem)
const item2 = itemCardBucket(pathCardImage2,brandName,nameItem,sizeItem,priceItem,colorItem)
export default function cart(){
   
    return(
    <main className="h-full">
      <div className="flex flex-row flex-wrap items-start ml-[5%] mr-[8%] min-h-[400px] h-full gap-x-15">
        <NavCart/>
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
          <CartOrder/>
        </div>
      </div>
    </main>
  );
}

                 
                
                 
                 
             

              
    
