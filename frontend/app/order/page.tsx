"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, Loader, ArrowUp } from "lucide-react";
import { getPreview, checkout } from "../lib/order.service";
import { useToken } from "@/store/useToken";
import { formatPrice } from "../lib/utils";
import OrderNav from "@/components/OrderNav";
import type { PreOrderInterface } from "@/types/PreOrderInterface";
import type { OrderItemRequest } from "@/types/OrderItemRequest";
import type { ApiArgs } from "@/types/ApiArgs";

export default function OrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginValue = useToken((state) => state.user?.login);

  // Состояния
  const [previewData, setPreviewData] = useState<PreOrderInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Выбор товаров и количества
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);

  // Данные формы
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<string>("SBP");
  const [comment, setComment] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Для debounce
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

  // Для мобильной версии
  const formRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Вспомогательная функция для ApiArgs
  const createApiArgs = (overrides: Partial<ApiArgs>): ApiArgs => ({
    setData: () => {},
    setError: () => {},
    setErrorMap: () => {},
    setLoading: () => {},
    updateSession: () => {},
    updateToken: () => {},
    ...overrides,
  });

  
  const fetchPreview = useCallback(async (items: OrderItemRequest[]) => { // основная функция загрузки getPreview
    if (items.length === 0) {
      setPreviewData(null);
      setSelectedWarehouseId(null);
      return;
    }

    setIsPreviewLoading(true);

    try {
      const success = await getPreview({
        items,
        ...createApiArgs({
          setData: (data) => {
            const preview = data as PreOrderInterface;
            setPreviewData(preview);
            setSelectedWarehouseId(null);
          },
          setError: (msg) => setError(msg),
          setLoading: () => {},
        })
      });

      if (!success) {
        // ошибка уже в setError
      }
    } catch (err) {
      console.error("Error fetching preview:", err);
    } finally {
      setIsPreviewLoading(false);
    }
  }, []);

 
  const debouncedFetchPreview = useCallback((items: OrderItemRequest[]) => { //debounce для перезапроса
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      fetchPreview(items);
    }, 2500);

    setDebounceTimer(timer);
  }, [debounceTimer, fetchPreview]);

  
  useEffect(() => { // одноразовая начальная загрузка
    if (!loginValue) {
      router.push("/");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const variantsParam = searchParams.get("variants");
        const quantitiesParam = searchParams.get("quantity");

        if (!variantsParam || !quantitiesParam) {
          router.push("/cart");
          return;
        }

        const variantIds = variantsParam.split(",").map(Number);
        const quantitiesArray = quantitiesParam.split(",").map(Number);

        if (variantIds.length !== quantitiesArray.length) {
          setError("Количество товаров и количество единиц не совпадают");
          setLoading(false);
          return;
        }

        const initialItems: OrderItemRequest[] = variantIds.map((id, idx) => ({
          variantId: id,
          quantity: quantitiesArray[idx] || 1,
        }));

        if (initialItems.length === 0) {
          setError("Нет товаров для оформления");
          setLoading(false);
          return;
        }

        // Загружаем превью без debounce при первой загрузке
        const success = await getPreview({
          items: initialItems,
          ...createApiArgs({
            setData: (data) => {
              const preview = data as PreOrderInterface;
              setPreviewData(preview);

              const allIds = preview.items.map((item) => item.variantId);
              setSelectedIds(new Set(allIds));

              const initialQuantities: Record<number, number> = {};
              preview.items.forEach((item) => {
                initialQuantities[item.variantId] = item.quantity;
              });
              setQuantities(initialQuantities);

              setSelectedWarehouseId(null);
              setIsInitialLoadDone(true);
            },
            setError: (msg) => setError(msg),
            setLoading: () => {},
          })
        });

        if (!success) {
          // ошибка уже в setError
        }
      } catch (err: any) {
        setError(err.message || "Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [loginValue, searchParams, router]);

  
  useEffect(() => { //обновление при изменении состава заказа
    if (!isInitialLoadDone || !previewData) return;

    const currentItems = previewData.items
      .filter((item) => selectedIds.has(item.variantId))
      .map((item) => ({
        variantId: item.variantId,
        quantity: quantities[item.variantId] ?? item.quantity,
      }));

    if (currentItems.length === 0) {
      setPreviewData(null);
      setSelectedWarehouseId(null);
      return;
    }

    debouncedFetchPreview(currentItems);
  }, [selectedIds, quantities, isInitialLoadDone]);

  
  useEffect(() => { // очистка таймера
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);
  
  
  
  
  // Обработчики количества
  const changeQuantity = (variantId: number, delta: number) => {
    setQuantities((prev) => {
      const current = prev[variantId] || 1;
      let newQty = Math.max(1, current + delta);
      const item = previewData?.items.find((i) => i.variantId === variantId);
      if (item && newQty > item.maxAvailableQuantity) {
        newQty = item.maxAvailableQuantity;
      }
      return { ...prev, [variantId]: newQty };
    });
  };

  const setQuantityDirect = (variantId: number, value: number) => {
    const num = Math.floor(value);
    if (isNaN(num) || num < 1) return;
    const item = previewData?.items.find((i) => i.variantId === variantId);
    const max = item?.maxAvailableQuantity || Infinity;
    const finalQty = Math.min(num, max);
    setQuantities((prev) => ({ ...prev, [variantId]: finalQty }));
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
    if (!previewData) return;
    if (selectedIds.size === previewData.items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(previewData.items.map((item) => item.variantId)));
    }
  };

  // Проверка наличия на складе
  /*const isStockSufficient = (variantId: number, warehouseId: number, quantity: number) => {
    const item = previewData?.items.find((i) => i.variantId === variantId);
    if (!item) return false;
    const stock = item.availableAtWarehouses.find((s) => s.warehouseId === warehouseId);
    return stock ? stock.availableQuantity >= quantity : false;
  };*/

  

  // Итоговая сумма
  const totalPrice = previewData?.totalPrice || 0;
  const selectedCount = selectedIds.size;
  const items = previewData?.items || [];
  const warehouses = previewData?.warehouses || [];
  const availableWarehouses = warehouses.filter((w) => w.availableForOrder);

  // Отправка заказа
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedWarehouseId) {
      setSubmitError("Выберите склад");
      return;
    }
    if (!address.trim()) {
      setSubmitError("Введите адрес доставки");
      return;
    }

    const orderItems = previewData!.items
      .filter((item) => selectedIds.has(item.variantId))
      .map((item) => ({
        variantId: item.variantId,
        quantity: quantities[item.variantId] ?? item.quantity,
      }));

    if (orderItems.length === 0) {
      setSubmitError("Выберите хотя бы один товар");
      return;
    }

    setSubmitting(true);
    try {
      const success = await checkout({
        items: orderItems,
        warehouseId: selectedWarehouseId,
        address,
        payment,
        comment,
        setData: (data) => {
          router.push(`/orders/${data.id}`);
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
  // Состояния загрузки
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader className="animate-spin w-12 h-12" />
      </div>
    );
  }

  if (error || !previewData) {
    return (
      <div className="h-screen flex justify-center items-center px-4">
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded text-center max-w-md">
          <p className="font-medium">Ошибка</p>
          <p className="text-sm">{error || "Данные не загружены"}</p>
        </div>
      </div>
    );
  }
  // Рендер
  return (
    <div className="h-screen flex flex-col max-w-[1680px] mx-auto">
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Навигация */}
        <div className="w-full lg:w-[30%] xl:w-[25%] min-w-[200px] lg:min-w-[250px]">
          <OrderNav onScrollToForm={scrollToForm} />
        </div>

        {/* Центральная часть - товары */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 order-2 md:order-none">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Товары в заказе</h2>
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

              //БЕРЁМ ГОТОВЫЕ ДАННЫЕ ОТ БЭКЕНДА
              const subtotal = item.subtotal; // бэкенд уже посчитал конечную сумму
              


              const stockOnSelected = item.availableAtWarehouses.find(
                (s) => s.warehouseId === selectedWarehouseId
              );
              const isAvailable = stockOnSelected
                ? stockOnSelected.availableQuantity >= qty
                : false;

              return (
                <div
                  key={item.variantId}
                  className={`flex flex-col border-b border-gray-100 pb-4 ${
                    isAvailable ? "opacity-100" : "opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(item.variantId)}
                      className="w-5 h-5 accent-black"
                    />
                    <div className="relative w-20 h-20 bg-gray-100 flex-shrink-0">
                      {item.mainImageUrl && (
                        <Image
                          src={item.mainImageUrl}
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
                  </div>

                  {/* Вторая строка: контролы количества и цена */}
                  <div className="flex items-center justify-end gap-4 mt-2 md:mt-3 pl-9 md:pl-0">
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
                        className="w-full min-w-[24px] max-w-[40px] lg:max-w-[52px] text-center border border-gray-300 rounded py-1 text-sm lg:text-base disabled:opacity-50"
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
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t-2 border-black flex justify-between text-2xl font-bold">
            <span>ИТОГО</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>

          {/* Мобильная версия формы - внизу */}
          {isMobile && (
            <div ref={formRef} className="mt-8 pt-4 border-t-2 border-gray-200">
              <h2 className="text-xl font-bold uppercase tracking-wider mb-4">
                Данные доставки
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Выбор склада (кнопки) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2">
                    Выберите склад
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {warehouses.length === 0 && (
                      <p className="text-sm text-red-600">Нет доступных складов</p>
                    )}
                    {warehouses.map((wh) => {
                      const isAvailable = wh.availableForOrder === true;
                      const isSelected = selectedWarehouseId === wh.id;
                      return (
                        <button
                          key={wh.id}
                          type="button"
                          onClick={() =>{ if(isAvailable) setSelectedWarehouseId(wh.id)}}
                          disabled={!isAvailable}
                          className={`px-4 py-2 text-sm uppercase tracking-wider border-2 transition duration-700 ease-out ${
                            isSelected
                              ? "border-black bg-black text-white" : isAvailable ? "border-gray-300 text-gray-600 hover:border-gray-400"
                             : "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
                                }`}
                              >
                          Склад #{wh.id}
                        </button>
                      );
                    })}
                  </div>
                  {selectedWarehouseId && (
                    <p className="text-xs text-gray-500 mt-1">
                      {warehouses.find(w => w.id === selectedWarehouseId)?.address}
                    </p>
                  )}
                </div>

                {/* Адрес */}
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

                {/* Способ оплаты */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2">
                    Выберите способ оплаты
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["НАЛИЧНЫЕ", "КАРТА", "СБП", "СЧЕТ"].map((method) => {
                      const value = method === "СБП" ? "SBP" : method === "КАРТА" ? "CARD" : method === "НАЛИЧНЫЕ" ? "CASH" : "INVOICE";
                      return (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPayment(value)}
                          className={`px-4 py-2 text-sm uppercase tracking-wider border-2 transition duration-700 ease-out ${
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

                {/* Комментарий */}
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
            </div>
          )}
        </div>

        {/* Десктопная версия формы - справа */}
        {!isMobile && (
          <aside className="w-[35%] lg:w-[30%] xl:w-[25%] min-w-[200px] lg:min-w-[250px] bg-gray-50 p-4 lg:p-6 border-l border-gray-200  h-[70vh]">
            <h2 className="text-xl font-bold uppercase tracking-wider mb-4">
              Данные доставки
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Выбор склада (кнопки) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2">
                  Выберите склад
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableWarehouses.length === 0 && (
                    <p className="text-sm text-red-600">Нет доступных складов</p>
                  )}
                  {warehouses.map((wh) => {
                   const isAvailable = wh.availableForOrder === true;
                   const isSelected = selectedWarehouseId === wh.id;
                    return (
                      <button
                        key={wh.id}
                        type="button"
                        onClick={() =>{if(isAvailable) setSelectedWarehouseId(wh.id)}}
                        disabled={!isAvailable}
                        className={`px-3 py-1.5 text-xs lg:text-sm uppercase tracking-wider border-2 transition duration-700 ease-out ${
                           isSelected
                              ? "border-black bg-black text-white" : isAvailable ? "border-gray-300 text-gray-600 hover:border-gray-400"
                             : "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
                                }`}
                      >
                        Склад #{wh.id}
                      </button>
                    );
                  })}
                </div>
                {selectedWarehouseId && (
                  <p className="text-xs text-gray-500 mt-1">
                    {warehouses.find(w => w.id === selectedWarehouseId)?.address}
                  </p>
                )}
              </div>

              {/* Адрес */}
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

              {/* Способ оплаты */}
              <div>
                <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2">
                  Выберите способ оплаты
                </label>
                <div className="flex flex-wrap gap-2">
                  {["НАЛИЧНЫЕ", "КАРТА", "СБП", "СЧЕТ"].map((method) => {
                    const value = method === "СБП" ? "SBP" : method === "КАРТА" ? "CARD" : method === "НАЛИЧНЫЕ" ? "CASH" : "INVOICE";
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPayment(value)}
                        className={`px-3 py-1.5 text-xs lg:text-sm uppercase tracking-wider border-2 duration-700 ease-out ${
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

              {/* Комментарий */}
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
        )}
      </div>

      {/* Кнопка наверх (мобильная) */}
      {isMobile && (
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="fixed bottom-6 right-6 bg-black text-white px-4 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition z-20"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}