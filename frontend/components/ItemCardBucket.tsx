import Image from "next/image"

export default function itemCardBucket(pathCardImage:string, brandName:string, nameItem:string,sizeItem:string,priceItem:number, colorItem:string, ){
           return(       
            <div className=" min-w-[10%] h-[200px] flex flex-row items-center gap-x-10 border-solid border-2 rounded-2xl border-[#000000]">
                <div className="flex flex-row items-center m-[2px]">
                    <div>
                        <Image
                            src={pathCardImage}
                            width={130}
                            height={132}
                            className="rounded-full"
                            alt="Картинка карточки товара"
                        />
                    </div>
                    <div className='flex flex-col flex-nowrap text-nowrap'>
                        <p className="underline font-bold underline-offset-5 ">{brandName}<button className=" ml-[2rem] mr-[2rem] text-xs">x</button></p>
                        <p className="">{nameItem}</p>
                        <p className="font-normal text-xs">{sizeItem}</p>
                        <p className="font-normal text-sm">Цвет: {colorItem}</p>
                        <p className="font-normal text-sm mt-[1rem]">{priceItem} ₽</p>
                    </div>
                </div>
            </div>
           )
}