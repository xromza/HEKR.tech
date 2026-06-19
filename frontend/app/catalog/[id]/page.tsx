import { getProduct } from "@/app/lib/Product";
import { ProductInterface } from "@/types/ProductInterface";
import { div } from "framer-motion/client";


export default async function CardPage({
    params,
}: { params: Promise<{ id: string }>; }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return <div className="w-full flex justify-center items-center">Товар не найден</div>
    }

     return (
    <div className="w-full flex flex-col items-center mx-auto max-w-[1920px] px-4 md:px-15">
      
      {/*  ВНУТРЕННИЙ КОНТЕЙНЕР */}
      <div className="w-full flex flex-col lg:flex-row gap-12 xl:gap-40 py-10">
        
        {/* 🖼️ ЛЕВАЯ ЧАСТЬ: Галерея (занимает всё свободное место) */}
        <div className="w-full lg:flex-1">
          <div className="flex gap-4 h-[450px] md:h-[600px] lg:h-[730px]">
            
            {/* Большое фото */}
            <div className="flex-1 bg-[#FBFAF8] rounded-xl overflow-hidden p-6 flex items-center justify-center">
              <img 
                src={product.mainImageUrl} 
                alt={product.title}
                className="w-[90%] h-[90%] object-contain" 
              />
            </div>

            {/* Миниатюры */}
            <div className="w-1/4 flex flex-col gap-3 h-full">
              {product.variants.flatMap(v => v.images).slice(0, 3).map((img) => (
                <div 
                  key={img.id} 
                  className="flex-1 bg-[#FBFAF8] rounded-lg overflow-hidden flex items-center justify-center"
                >
                  <img 
                    src={img.url} 
                    alt="" 
                    className="w-[90%] h-[90%] object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 📝 ПРАВАЯ ЧАСТЬ: Описание товара (фиксированная ширина) */}
        <div className="w-full lg:w-[500px] lg:shrink-0 space-y-8 text-left">
          
          {/* 1. ЗАГОЛОВОК И БРЕНД */}
          <div>
            <h1 className="lg:text-5xl font-bold leading-tight sm:text-4xl">{product.brand}</h1>
            <p className="text-xl uppercase font-medium mt-5">{product.title}</p>
          </div>

          {/* 2. ЦЕНЫ */}
          <div className="flex items-baseline gap-4">
            <span className="lg:text-2xl font-semibold sm:text-xl">{product.priceRetail.toLocaleString('ru-RU')} ₽</span>
            <span className="lg:text-2xl text-gray-400 font-regular uppercase sm:text-xl">/ {product.priceWholesale.toLocaleString('ru-RU')} ₽ Оптовая</span>
          </div>

          {/* 3. РАЗМЕРЫ */}
          <div>
            <p className="text-sm font-bold uppercase mt-10 mb-3">Размер (W)</p>
            <div className="lg:gap-4 flex flex-wrap gap-4 sm:gap-6">

            
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => {
            // Проверяем, есть ли этот размер в данных с бэкенда
            const variant = product.variants.find(v => v.size === size);
            
            // Проверяем наличие на складе
            const totalStock = variant?.stock.reduce((sum, s) => sum + s.quantity, 0) || 0;
            
            // Размер активен, если:
            // 1. Вариант существует в бэкенде
            // 2. isActive = true
            // 3. Есть наличие (quantity > 0)
            const isAvailable = variant && variant.isActive && totalStock > 0;

            return (
                <button
                key={size}
                disabled={!isAvailable}
                className={`
                    min-w-[67px] h-[70px] border-2 rounded-lg font-regular transition 
                    flex flex-col items-center justify-center
                    ${isAvailable 
                    ? 'border-black bg-white text-black hover:bg-black hover:text-white cursor-pointer' 
                    : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }
                `}
                >
                <span className="text-sm font-regular">{size}</span>
                </button>
            );
            })}



            </div>
          </div>

          <div className="border border-red-500 text-red-500 p-4 rounded-lg text-center text-sm font-regular uppercase">
            Обратите внимание что оптовая цена действует при покупке от {product.wholesaleThreshold} штук товара
          </div>

          <div className="flex gap-9">
            <button className="flex-1 bg-black text-white py-4 rounded-lg font-bold uppercase hover:bg-white border-2 border-black transition hover:text-black">
              Купить сейчас
            </button>
            <button className="flex-1 border-2 border-black text-black py-4 rounded-lg font-bold uppercase hover:bg-black hover:text-white transition">
              В корзину
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-11 pt-8 mt-15">
            
            <div className="space-y-5 text-sm">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-bold uppercase">Бренд</span>
                <span className="text-gray-600 uppercase">{product.brand}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-bold uppercase">Цвет</span>
                <span className="text-gray-600 uppercase">Чёрный</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-bold uppercase">Состав</span>
                <span className="text-gray-600 uppercase">Кожа</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold uppercase">Страна</span>
                <span className="text-gray-600 uppercase">Китай</span>
              </div>
            </div>

            <div>
              <p className="font-bold uppercase mb-5">Описание</p>
              <p className="text-gray-600 leading-relaxed text-sm uppercase">
                {product.description}
              </p>
            </div>
          </div>

          

        </div>
      </div>
    </div>
  );


    /*const product: ProductInterface = {
        id: Number(id),
        brand: "SAINTS KELLY",
        title: "КУРТКА ДУТАЯ",
        description: "КОЖАНАЯ МОДНАЯ КУРТКА, КОТОРАЯ ХОРОШО ПОДОЙДЕТ С ШИРОКИМИ ДЖИНСАМИ, ЛЮБАЯ ПУСТЬ ПОДХОДИТ",
        categoryId: 5,
        categoryName: "Верхняя одежда",
        isActive: true,
        priceRetail: 19600,
        priceWholesale: 12500,
        wholesaleThreshold: 8,
        mainImageUrl: "https://res.cloudinary.com/dcc2qkmq7/image/upload/v1778696821/glasses_main_lcn7se.png",
        variants: [
            {
                id: 101,
                productId: Number(id),
                sku: "SAINTS-KELLY-52",
                size: "52",
                color: "Чёрный",
                weight: 1,
                isActive: true,
                stock: [
                    { variantId: 101, warehouseId: 1, address: "Склад Москва", quantity: 15 }
                ],
                images: [
                    { id: 1, url: "https://res.cloudinary.com/dcc2qkmq7/image/upload/v1778696821/glasses_main_lcn7se.png", type: "MAIN", sortOrder: 1, createdAt: ""}
                ]
            },
            {
                id: 102,
                productId: Number(id),
                sku: "SAINTS-KELLY-56",
                size: "56",
                color: "Чёрный",
                weight: 1,
                isActive: true,
                stock: [
                    { variantId: 102, warehouseId: 1, address: "Склад Краснодар", quantity: 0 }
                ],
                images: []
            }
        ]
    };
    */

    /*
    return (
        <div className="w-full flex justify-center items-center">
            <div>Страница карточки (скоро тут будет красота, в разработке) {id}</div>
        </div>
    )
    */
}