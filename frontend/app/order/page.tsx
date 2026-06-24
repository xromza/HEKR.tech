"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Home, ShoppingCart, Minus, Plus, Loader } from "lucide-react";
import { getCart } from "../lib/cart.service";
import { checkout } from "../lib/order.service";
import { useToken } from "@/store/useToken";
import { CartInterface } from "@/types/CartInterface";
import { CartItemInterface } from "@/types/CartItemInterface";
import { VerboseOrderInterface } from "@/types/VerboseOrderInterface";
import { formatPrice } from "../lib/utils";
import OrderNav from "@/components/OrderNav";

// ---------- МОКОВЫЕ ДАННЫЕ (для тестирования без бэкенда) ----------
const mockItems: CartItemInterface[] = [
    {
      variantId: 1,
      brand: "Rick Owens",
      title: "DRKSHDW",
      size: "48 FR | RU 52",
      imageUrl: '',
      quantity: 1,
      subtotal: 78900,
      appliedPrice: 78900,
      availableStock: 10,
      color: "Черный",
      priceType: "RETAIL",
    },
    {
      variantId: 2,
      brand: "Rick Owens",
      title: "DRKSHDW",
      size: "48 FR | RU 52",
      imageUrl: "",
      quantity: 2,
      subtotal: 157800,
      appliedPrice: 78900,
      availableStock: 5,
      color: "Серый",
      priceType: "RETAIL",
    },
    {
      variantId: 3,
      brand: "Gucci",
      title: "Бомбер GG Marmont",
      size: "M",
      imageUrl: "",
      quantity: 1,
      subtotal: 185000,
      appliedPrice: 185000,
      availableStock: 3,
      color: "Черный",
      priceType: "RETAIL",
    },
    {
      variantId: 4,
      brand: "Prada",
      title: "Костюм из шерсти",
      size: "50",
      imageUrl: "",
      quantity: 1,
      subtotal: 210000,
      appliedPrice: 210000,
      availableStock: 2,
      color: "Темно-синий",
      priceType: "RETAIL",
    },
    {
      variantId: 5,
      brand: "Balmain",
      title: "Пиджак",
      size: "52",
      imageUrl: "",
      quantity: 1,
      subtotal: 320000,
      appliedPrice: 320000,
      availableStock: 4,
      color: "Бежевый",
      priceType: "RETAIL",
    },
    {
      variantId: 6,
      brand: "Dior",
      title: "Кроссовки",
      size: "42",
      imageUrl: "",
      quantity: 1,
      subtotal: 95000,
      appliedPrice: 95000,
      availableStock: 8,
      color: "Белый",
      priceType: "RETAIL",
    },

      
  ];
// ----------------------------------------------------------------

export default function CheckoutPage() {
  const router = useRouter();
  const loginValue = useToken((state) => state.user?.login);

  // Состояния корзины
  const [cartData, setCartData] = useState<CartInterface | null>(null);
  const [loadingCart, setLoadingCart] = useState<boolean>(true);
  const [errorCart, setErrorCart] = useState<string | null>(null);

  // Локальные состояния для выбранных товаров и их количества
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  // Данные формы
  const [warehouseId, setWarehouseId] = useState<number>(2);
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<string>("SBP");
  const [comment, setComment] = useState("");

  // Состояния отправки
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ---------- ИНИЦИАЛИЗАЦИЯ МОКОВ (временная) ----------
  useEffect(() => {
    // Устанавливаем выбранными все товары из моков
    const allIds = mockItems.map(item => item.variantId);
    setSelectedIds(new Set(allIds));
    const initialQuantities: Record<number, number> = {};
    mockItems.forEach(item => {
      initialQuantities[item.variantId] = item.quantity;
    });
    setQuantities(initialQuantities);
    // Имитируем завершение загрузки корзины
    setLoadingCart(false);
  }, []);
  // ----------------------------------------------------

  // ЗАКОММЕНТИРОВАННАЯ ЛОГИКА РЕАЛЬНОГО БЭКЕНДА (оставлена для будущего)
  /*
  useEffect(() => {
    if (!loginValue) {
      router.push("/");
      return;
    }
    const loadCart = async () => {
      const success = await getCart({
        setData: (data) => {
          setCartData(data as CartInterface);
          const items = (data as CartInterface).items;
          const allIds = items.map(item => item.variantId);
          setSelectedIds(new Set(allIds));
          const initialQuantities: Record<number, number> = {};
          items.forEach(item => {
            initialQuantities[item.variantId] = item.quantity;
          });
          setQuantities(initialQuantities);
        },
        setError: (msg) => setErrorCart(msg),
        setLoading: setLoadingCart,
      });
      if (!success) {
        // ошибка уже установлена
      }
    };
    loadCart();
  }, [loginValue, router]);

  useEffect(() => {
    if (cartData && cartData.items.length === 0) {
      router.push("/cart");
    }
  }, [cartData, router]);
  */

  // ---------- Используем моковые данные вместо реальных ----------
  // const items = cartData?.items || [];       // ЗАКОММЕНТИРОВАНО
  const items = mockItems;                      // ВРЕМЕННО
  // -------------------------------------------------------------

  // Функции изменения количества
  const changeQuantity = (variantId: number, delta: number) => {
    setQuantities(prev => {
      const current = prev[variantId] || 1;
      const newQty = Math.max(1, current + delta);
      return { ...prev, [variantId]: newQty };
    });
  };

  const setQuantityDirect = (variantId: number, value: number) => {
    const newQty = Math.max(1, Math.floor(value) || 1);
    setQuantities(prev => ({ ...prev, [variantId]: newQty }));
  };

  // Переключение выбора
  const toggleSelect = (variantId: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(variantId)) {
      newSet.delete(variantId);
    } else {
      newSet.add(variantId);
    }
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(item => item.variantId)));
    }
  };

  // Подсчет итоговой суммы (цена за единицу * количество)
  const totalPrice = items.reduce((sum, item) => {
    if (selectedIds.has(item.variantId)) {
      const qty = quantities[item.variantId] || item.quantity;
      const unitPrice = item.appliedPrice ?? (item.subtotal / item.quantity);
      return sum + unitPrice * qty;
    }
    return sum;
  }, 0);

  const selectedCount = selectedIds.size;

  // Отправка заказа
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const orderItems = items
      .filter(item => selectedIds.has(item.variantId))
      .map(item => ({
        variantId: item.variantId,
        quantity: quantities[item.variantId] || item.quantity,
      }));

    if (orderItems.length === 0) {
      setSubmitError("Выберите хотя бы один товар");
      return;
    }

    setSubmitting(true);
    try {
      const success = await checkout({
        items: orderItems,
        warehouseId,
        address,
        payment,
        comment,
        setData: (data) => {
          const order = data as VerboseOrderInterface;
          router.push(`/orders/${order.id}`);
        },
        setError: (msg) => setSubmitError(msg),
        setLoading: setSubmitting,
      });
      if (!success) {
        // ошибка уже в submitError
      }
    } catch (err) {
      setSubmitError("Неизвестная ошибка при оформлении заказа");
    } finally {
      setSubmitting(false);
    }
  };

  // Состояния загрузки и ошибок
  if (loadingCart) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader className="animate-spin w-12 h-12" />
      </div>
    );
  }

  if (errorCart) {
    return (
      <div className="h-screen flex justify-center items-center px-4">
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded text-center max-w-md">
          <p className="font-medium">Ошибка загрузки корзины</p>
          <p className="text-sm">{errorCart}</p>
        </div>
      </div>
    );
  }

  // Если нет товаров (редко, т.к. редирект)(такая ситуация невозможна)
  if (items.length === 0) {
    return null; // редирект сработает
  }

  // Основная вёрстка
  return (
    <div className="h-screen flex flex-row md:flex-col  max-w-[1680px] md:items-center gap-8">
      <div className="flex-1 flex overflow-hidden ">
        {/* Левая колонка – навигация (30%) */}
        {/*<OrderNav/>*/}
        {/* Центральная часть – товары с прокруткой */}
        <div className="flex-1 overscroll-auto  p-6 max-w-[50%]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Товары в корзине</h2>
            <button
              type="button"
              onClick={toggleAll}
              className="text-sm text-blue-600 hover:underline"
            >
              {selectedIds.size === items.length ? "Снять все" : "Выбрать все"}
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item) => {
              const isSelected = selectedIds.has(item.variantId);
              const qty = quantities[item.variantId] ?? item.quantity;
              const unitPrice = item.appliedPrice ?? (item.subtotal / item.quantity);
              const subtotal = isSelected ? unitPrice * qty : 0;

              return (
                <div
                  key={item.variantId}
                  className={`flex items-center gap-4 border-b border-gray-100 pb-4 ${
                    isSelected ? "opacity-100" : "opacity-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(item.variantId)}
                    className="w-5 h-5 accent-black"
                  />
                  <div className="relative w-20 h-20 bg-gray-100 flex-shrink-0">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg leading-tight">{item.brand}</p>
                    <p className="text-sm uppercase tracking-wide text-gray-600">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500">{item.size}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => changeQuantity(item.variantId, -1)}
                      disabled={!isSelected || qty <= 1}
                      className="p-1 border border-gray-300 rounded disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={qty}
                      onChange={(e) => setQuantityDirect(item.variantId, parseInt(e.target.value) || 1)}
                      disabled={!isSelected}
                      className="w-12 text-center border border-gray-300 rounded py-1 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => changeQuantity(item.variantId, 1)}
                      disabled={!isSelected}
                      className="p-1 border border-gray-300 rounded disabled:opacity-30"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right font-semibold min-w-[100px]">
                    {isSelected ? formatPrice(subtotal) : "—"}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t-2 border-black flex justify-between text-2xl font-bold">
            <span>ИТОГО</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </div>

        {/* Правая колонка – форма */}
        <aside className="w-[30%] min-w-[280px] bg-gray-50 p-6 overflow-y-auto border-l border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-wider">Данные доставки</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider">
                Склад
              </label>
              <select
                value={warehouseId}
                onChange={(e) => setWarehouseId(Number(e.target.value))}
                className="mt-1 block w-full border-b-2 border-gray-300 py-2 px-0 focus:border-black focus:ring-0 bg-transparent"
                required
              >
                <option value={1}>Склад №1 (Москва)</option>
                <option value={2}>Склад №2 (Санкт-Петербург)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider">
                Адрес доставки
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="г. Москва, ул. Примерная, д. 1"
                className="mt-1 block w-full border-b-2 border-gray-300 py-2 px-0 focus:border-black focus:ring-0 bg-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2">
                Выберите способ оплаты
              </label>
              <div className="flex flex-wrap gap-2">
                {["НАЛИЧНЫЕ", "КАРТА", "СБП", "СЧЕТ"].map((method) => {
                  const value =
                    method === "СБП"
                      ? "SBP"
                      : method === "КАРТА"
                      ? "CARD"
                      : method === "НАЛИЧНЫЕ"
                      ? "CASH"
                      : "INVOICE";
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPayment(value)}
                      className={`px-4 py-2 text-sm uppercase tracking-wider border-2 transition ${
                        payment === value
                          ? "border-black bg-black text-white"
                          : "border-gray-300 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {method}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider">
                Комментарий
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                placeholder="Дополнительная информация"
                className="mt-1 block w-full border-b-2 border-gray-300 py-2 px-0 focus:border-black focus:ring-0 bg-transparent resize-none"
              />
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm rounded">
                <p className="font-medium">Ошибка:</p>
                <p className="text-sm whitespace-pre-wrap">{submitError}</p>
                {submitError.includes("NotEnoughItems") && (
                  <p className="text-sm mt-1">Некоторые товары недоступны в нужном количестве.</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || selectedCount === 0}
              className="w-full bg-black text-white py-4 text-lg uppercase tracking-widest hover:bg-gray-800 transition disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="animate-spin w-5 h-5" />
                  Оформление...
                </span>
              ) : (
                `ЗАКАЗАТЬ (${selectedCount})`
              )}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}