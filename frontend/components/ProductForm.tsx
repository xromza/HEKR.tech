"use client";

import { useState } from "react";
import { changeQuantityCart, deleteSingleItem } from "@/app/lib/cart.service";
import { ProductInterface } from "@/types/ProductInterface";
import { ProductVariantInterface } from "@/types/ProductVariantInterface";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "lucide-react";

interface ProductFormProps {
  product: ProductInterface;
}

export default function ProductForm({ product }: ProductFormProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartData, setCartData] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [addedQuantity, setAddedQuantity] = useState<number>(0);

  const variants = product.variants as ProductVariantInterface[];
  const allColors = [...new Set(variants.map((v) => v.color))];
  const allSizes = [...new Set(variants.map((v) => v.size))];

  const isColorAvailable = (color: string) => {
    return variants.some((v) => v.color === color && v.isActive && v.stock.reduce((sum, s) => sum + s.quantity, 0) > 0);
  };

  const isSizeAvailable = (size: string) => {
    return variants.some((v) => v.size === size && v.isActive && v.stock.reduce((sum, s) => sum + s.quantity, 0) > 0);
  };

  const handleAddToCart = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!selectedColor || !selectedSize) {
      setError("Выберите цвет и размер товара");
      return;
    }

    const variant = variants.find((v) => v.color === selectedColor && v.size === selectedSize);
    const totalStock = variant?.stock.reduce((sum, s) => sum + s.quantity, 0) || 0;

    if (!variant || !variant.isActive || totalStock === 0) {
      setError("Товар закончился");
      return;
    }

    const isSuccess = await changeQuantityCart({
      variantId: variant.id,
      quantity: 1,
      setData: setCartData,
      setError: setError,
      setLoading: setIsLoading
    });

    if (isSuccess) {
      setAddedQuantity(1);
      setSuccessMessage("Товар успешно добавлен в корзину!");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleUpdateQuantity = async (newQuantity: number) => {
    setError(null);
    const variant = variants.find((v) => v.color === selectedColor && v.size === selectedSize);
    if (!variant) return;

    if (newQuantity === 0) {
      const isSuccess = await deleteSingleItem({ variantId: variant.id, setError, setLoading: setIsLoading });
      if (isSuccess) setAddedQuantity(0);
      return;
    }

    const totalStock = variant.stock.reduce((sum, s) => sum + s.quantity, 0);
    if (newQuantity > totalStock) {
      setError(`Доступно только ${totalStock} шт.`);
      return;
    }

    const isSuccess = await changeQuantityCart({ variantId: variant.id, quantity: newQuantity, setData: setCartData, setError, setLoading: setIsLoading });
    if (isSuccess) setAddedQuantity(newQuantity);
  };

  return (
    <div className="w-full lg:w-[500px] lg:shrink-0 space-y-8 text-left">
      <div>
        <h1 className="lg:text-5xl font-bold leading-tight sm:text-4xl">{product.brand}</h1>
        <p className="text-xl uppercase font-medium mt-5">{product.title}</p>
      </div>

      <div className="flex items-baseline gap-4">
        <span className="lg:text-2xl font-semibold sm:text-xl">{product.priceRetail.toLocaleString("ru-RU")} ₽</span>
        <span className="lg:text-2xl text-gray-400 font-regular uppercase sm:text-xl">/ {product.priceWholesale.toLocaleString("ru-RU")} ₽ Оптовая</span>
      </div>

      <div>
        <p className="text-sm font-bold uppercase mt-10 mb-3">Цвет</p>
        <div className="flex flex-wrap gap-3">
          {allColors.map((color) => {
            const available = isColorAvailable(color);
            const isSelected = selectedColor === color;
            return (
              <button key={color} disabled={!available} onClick={() => { setSelectedColor(color); setError(null); setAddedQuantity(0); }}
                className={`px-4 h-[40px] border-2 rounded-lg font-regular transition uppercase ${!available ? "border-gray-200 text-gray-400 cursor-not-allowed" : ""} ${available && !isSelected ? "border-gray-200 hover:border-black bg-white text-black cursor-pointer" : ""} ${isSelected ? "border-black bg-black text-white cursor-pointer" : ""}`}>
                <span className="text-sm font-regular">{color}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-bold uppercase mt-10 mb-3">Размер (W)</p>
        <div className="lg:gap-4 flex flex-wrap gap-4 sm:gap-6">
          {allSizes.map((size) => {
            const available = isSizeAvailable(size);
            const isSelected = selectedSize === size;
            return (
              <button key={size} disabled={!available} onClick={() => { setSelectedSize(size); setError(null); setAddedQuantity(0); }}
                className={`min-w-[67px] h-[70px] border-2 rounded-lg font-regular transition flex flex-col items-center justify-center ${!available ? "border-gray-200 text-gray-400 cursor-not-allowed" : ""} ${available && !isSelected ? "border-gray-200 hover:border-black bg-white text-black cursor-pointer" : ""} ${isSelected ? "border-black bg-black text-white cursor-pointer" : ""}`}>
                <span className="text-sm font-regular">{size}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex gap-9 h-[60px]">

        <button className="flex-1 bg-black text-white rounded-lg font-bold uppercase hover:bg-white border-2 border-black transition hover:text-black">Купить сейчас</button>
        <div
          onClick={() => addedQuantity === 0 && handleAddToCart()}
          className={`flex-1 border-2 flex items-center justify-center border-black rounded-lg font-bold 
            ${addedQuantity === 0 ? 'text-white hover:bg-white cursor-pointer hover:text-black bg-black' : 'text-black bg-white'} transition`}

        >
          <AnimatePresence mode="wait">
            {addedQuantity === 0 ? (
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="flex-1 font-bold 
            uppercase transition flex justify-center">
                {isLoading ? <Loader className="animate-spin" /> : "В корзину"}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1.0 }}
                exit={{ opacity: 0, scale: 1.2 }}
                className="flex-1 flex items-center justify-between overflow-hidden">
                <button disabled={isLoading} onClick={() => handleUpdateQuantity(addedQuantity - 1)} className="w-14 h-full flex items-center justify-center transition text-2xl font-medium cursor-pointer">−</button>
                <div className="font-bold w-full text-lg flex flex-row items-center justify-center gap-2">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={addedQuantity}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}
                    >{addedQuantity}
                    </motion.div>
                  </AnimatePresence>
                  шт.
                </div>
                <button disabled={isLoading} onClick={() => handleUpdateQuantity(addedQuantity + 1)} className="w-14 h-full flex items-center justify-center transition text-2xl font-medium cursor-pointer">+</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
      <div className="py-2">
        <AnimatePresence mode="popLayout">
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0 }}
              className="ring ring-red-200 py-2 w-full bg-red-50 rounded-lg overflow-hidden"
            >
              <div className="px-3 py-2 text-center text-sm text-red-600">
                {error}
              </div>
            </motion.div>
          )}
          {successMessage && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0 }}
              className="bg-green-50 text-green-600 py-2 rounded-lg text-sm font-medium border border-green-200"
            >
              <div className="px-3 py-2 text-center text-sm text-green-600">
                {successMessage}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-11 pt-8 mt-15">
        <div className="space-y-5 text-sm">
          <div className="flex justify-between border-b border-gray-100 pb-2"><span className="font-bold uppercase">Бренд</span><span className="text-gray-600 uppercase">{product.brand}</span></div>

          <div className="flex justify-between border-b border-gray-100 pb-2"><span className="font-bold uppercase">Категория</span><span className="text-gray-600 uppercase">{product.categoryName}</span></div>

        </div>
        <div>
          <p className="font-bold uppercase mb-5">Описание</p>

          <p className="text-gray-600 leading-relaxed text-sm uppercase">{product.description}</p>
        </div>
      </div>
    </div>
  );
}