"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, Loader, ArrowUp } from "lucide-react";
import { getPreview, checkout } from "../lib/order.service";
import { useToken } from "@/store/useToken";
import { formatPrice } from "../lib/utils";
import OrderNav from "@/components/OrderNav"; // ваш компонент навигации
import type { PreOrderInterface } from "@/types/PreOrderInterface";
import type { OrderItemRequest } from "@/types/OrderItemRequest";
import type { CartInterface } from "@/types/CartInterface";
import type { ApiArgs } from "@/types/ApiArgs";

export default function OrderPage() {

  const mockPreviewData: PreOrderInterface = {
  totalPrice: 356500,
  items: [
    {
      productId: 1,
      variantId: 101,
      brand: "SAINTS KELLY",
      title: "КУРТКА ДУТАЯ",
      sku: "SK-JKT-BLK-L",
      size: "L",
      color: "Черный",
      mainImageUrl: "",
      quantity: 1,
      maxAvailableQuantity: 5,
      isAvailable: true,
      price: { base: 19600, applied: 19600, type: "RETAIL" },
      subtotal: 19600,
      availableAtWarehouses: [
        { warehouseId: 1, availableQuantity: 5 },
        { warehouseId: 2, availableQuantity: 4 },
      ],
    },
    {
      productId: 2,
      variantId: 102,
      brand: "SAINTS KELLY",
      title: "ДЖИНСЫ ШИРОКИЕ",
      sku: "SK-JNS-GRY-32",
      size: "32",
      color: "Серый",
      mainImageUrl: "",
      quantity: 2,
      maxAvailableQuantity: 10,
      isAvailable: true,
      price: { base: 18250, applied: 18250, type: "RETAIL" },
      subtotal: 36500,
      availableAtWarehouses: [
        { warehouseId: 1, availableQuantity: 10 },
        { warehouseId: 2, availableQuantity: 4 },
      ],
    },
    {
      productId: 3,
      variantId: 103,
      brand: "Rick Owens",
      title: "DRKSHDW",
      sku: "RO-DRK-001",
      size: "48 FR | RU 52",
      color: "Черный",
      mainImageUrl: "",
      quantity: 1,
      maxAvailableQuantity: 3,
      isAvailable: true,
      price: { base: 78900, applied: 78900, type: "RETAIL" },
      subtotal: 78900,
      availableAtWarehouses: [
        { warehouseId: 1, availableQuantity: 3 },
        { warehouseId: 2, availableQuantity: 1 },
      ],
    },
  ],
  warehouses: [
    { id: 1, address: "г. Москва, ул. Петровка, д. 2 (Центральный хаб)", isAvailableForOrder: true },
    { id: 2, address: "г. Санкт-Петербург, Невский пр., д. 15 (Северный хаб)", isAvailableForOrder: true },
    { id: 3, address: "г. Казань, ул. Баумана, д. 44 (Поволжье)", isAvailableForOrder: false },
    { id: 4, address: "г. Новосибирск, Красный пр., д. 100 (Сибирь)", isAvailableForOrder: false },
  ],
};
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

  //  ФЛАГ ДЛЯ ПРЕДОТВРАЩЕНИЯ БЕСКОНЕЧНОГО ЦИКЛА
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // ✅ ПРОСТОЙ ФЛАГ: БЫЛА ЛИ УЖЕ ПЕРВАЯ ЗАГРУЗКА?
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

  // Для мобильной версии — реф на форму
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
  const createApiArgs = <T,>(overrides: Partial<ApiArgs>): ApiArgs => ({
    setData: () => {},
    setError: () => {},
    setErrorMap: () => {},
    setLoading: () => {},
    updateSession: () => {},
    updateToken: () => {},
    ...overrides,
  });

   // ===== ОСНОВНАЯ ФУНКЦИЯ ЗАГРУЗКИ ПРЕВЬЮ =====
  const fetchPreview = useCallback(async (items: OrderItemRequest[]) => {
     console.log("🔵 [fetchPreview] ВЫЗВАН с items:", items);
    if (items.length === 0) {
       console.log("🔵 [fetchPreview] items пуст → очищаем");
      setPreviewData(null);
      setSelectedWarehouseId(null);
      return;
    }

    setIsPreviewLoading(true);
    console.log("🔵 [fetchPreview] setIsPreviewLoading = true");
    
    try {
      // ⚠️ ДЛЯ ТЕСТА ИСПОЛЬЗУЕМ МОК
      await new Promise(resolve => setTimeout(resolve, 500));
      const preview = mockPreviewData;
       console.log("🔵 [fetchPreview] Мок загружен, обновляем previewData");
     // ✅ НЕ ОБНОВЛЯЕМ selectedIds И quantities, ЕСЛИ ЭТО НЕ ПЕРВАЯ ЗАГРУЗКА
      setPreviewData(preview);
      setSelectedWarehouseId(null);
       console.log("🔵 [fetchPreview] previewData обновлён");
      
      

  // Загрузка данных
  /*useEffect(() => {
    if (!loginValue) {
      /*router.push("/");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const variantsParam = searchParams.get("variants");
        const quantitiesParam = searchParams.get("quantity");

        if (!variantsParam || !quantitiesParam) { //если нет ничего в поисковой строке,то переводим главную? 
            router.push('/');
            return;
        } 

        const variantIds = variantsParam.split(",").map(Number);
        const quantitiesArray = quantitiesParam.split(",").map(Number);

        const items: OrderItemRequest[] = variantIds.map((id, idx) => ({
        variantId: id,
        quantity: quantitiesArray[idx] || 1,
      }));

        if (items.length === 0) {
          setError("Нет товаров для оформления");
          setLoading(false);
          return;
        }

        // Запрос превью
        const success = await getPreview({
          items,
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
  }, [loginValue, searchParams, router]);*/

  } catch (err) { // подставить вместо catch выше
      console.error("Error fetching preview:", err);
      
    } finally {
      setIsPreviewLoading(false);
      console.log("🔵 [fetchPreview] setIsPreviewLoading = false");
    }
  }, []);

  // ===== DEBOUNCE ДЛЯ ПЕРЕЗАПРОСА =====
  const debouncedFetchPreview = useCallback((items: OrderItemRequest[]) => {
     console.log("🟣 [debouncedFetchPreview] ВЫЗВАН с items:", items);
    if (debounceTimer) {
       console.log("🟣 [debouncedFetchPreview] Очищаем предыдущий таймер");
      clearTimeout(debounceTimer);
    }
    console.log("🟣 [debouncedFetchPreview] Устанавливаем новый таймер на 2.5 сек");
    const timer = setTimeout(() => {
      console.log("🟣 [debouncedFetchPreview] ТАЙМЕР СРАБОТАЛ → вызываем fetchPreview");
      fetchPreview(items);
    }, 2500);

    setDebounceTimer(timer);
     console.log("🟣 [debouncedFetchPreview] Таймер установлен");
  }, [debounceTimer, fetchPreview]);

  // ===== ОТСЛЕЖИВАНИЕ ИЗМЕНЕНИЙ В СОСТАВЕ ЗАКАЗА =====
 /* useEffect(() => {
    if (!previewData) return;

    const currentItems = previewData.items
      .filter(item => selectedIds.has(item.variantId))
      .map(item => ({
        variantId: item.variantId,
        quantity: quantities[item.variantId] ?? item.quantity,
      }));

    if (currentItems.length > 0) {
      debouncedFetchPreview(currentItems);
    } else {
      setPreviewData(null);
      setSelectedWarehouseId(null);
    }
  }, [selectedIds, quantities, previewData, debouncedFetchPreview]);*/


  // ✅ ИСПОЛЬЗУЕМ МОК ВМЕСТО РЕАЛЬНОГО ЗАПРОСА
    
  useEffect(() => {
    console.log("🟢 [useEffect] Начальная загрузка START");
    // ЗАКОММЕНТИРОВАНО для теста
    // if (!loginValue) {
    //   router.push("/");
    //   return;
    // }

    const loadData = async () => {
       console.log("🟢 [loadData] Начало загрузки данных");
      setLoading(true);
      setError(null);

      try {
        // ✅ ИСПОЛЬЗУЕМ МОК ВМЕСТО РЕАЛЬНОГО ЗАПРОСА
       await new Promise(resolve => setTimeout(resolve, 500)); // Имитация задержки
      const preview = mockPreviewData;
       console.log("🟢 [loadData] Мок загружен:", preview);
      
      setPreviewData(preview);
       console.log("🟢 [loadData] setPreviewData выполнен");
      
      const allIds = preview.items.map((item) => item.variantId);
      setSelectedIds(new Set(allIds));
       console.log("🟢 [loadData] setSelectedIds выполнен, allIds:", allIds);
      
      const initialQuantities: Record<number, number> = {};
      preview.items.forEach((item) => {
        initialQuantities[item.variantId] = item.quantity;
      });
      setQuantities(initialQuantities);
      console.log("🟢 [loadData] setQuantities выполнен:", initialQuantities);
      setIsInitialLoad(false);
        
        // Склад не выбираем автоматически
        setSelectedWarehouseId(null);
        console.log("🟢 [loadData] setSelectedWarehouseId выполнен");
       // ✅ ПОМЕЧАЕМ, ЧТО ПЕРВАЯ ЗАГРУЗКА ЗАВЕРШЕНА
        setIsInitialLoadDone(true);
        console.log("🟢 [loadData] setIsInitialLoadDone = true");

      } catch (err: any) {
        console.error("Error fetching preview:", err);
      } finally {
        setIsPreviewLoading(false);
        setLoading(false);
         console.log("🟢 [loadData] setLoading = false, загрузка завершена");
      }
    };

    loadData(); // ✅ ТОЛЬКО ОДИН ВЫЗОВ
    console.log("🟢 [useEffect] Начальная загрузка END");
  }, []); // ✅ ПУСТОЙ МАССИВ ЗАВИСИМОСТЕЙ - выполняется один раз

  // ===== 2. ОБНОВЛЕНИЕ ПРИ ИЗМЕНЕНИИ СОСТАВА =====
  useEffect(() => {
    console.log("🟡 [useEffect-обновление] Сработал! isInitialLoadDone:", isInitialLoadDone, "previewData:", !!previewData);
    // Если данных нет — ничего не делаем
   if (!isInitialLoadDone || !previewData){ console.log("🟡 [useEffect-обновление] ПРОПУСК (isInitialLoadDone или previewData)"); return;} 

    // Формируем актуальный список товаров
     console.log("🟡 [useEffect-обновление] Формируем currentItems");
    const currentItems = previewData.items
      .filter(item => selectedIds.has(item.variantId))
      .map(item => ({
        variantId: item.variantId,
        quantity: quantities[item.variantId] ?? item.quantity,
      }));

       console.log("🟡 [useEffect-обновление] currentItems:", currentItems);

    // Если ничего не выбрано — очищаем данные
    if (currentItems.length === 0) {
      console.log("🟡 [useEffect-обновление] currentItems пуст → очищаем данные");
      setPreviewData(null);
      setSelectedWarehouseId(null);
      return;
    }

    // Запускаем debounce
    console.log("🟡 [useEffect-обновление] Запускаем debouncedFetchPreview");
    debouncedFetchPreview(currentItems);
  }, [selectedIds, quantities, isInitialLoadDone]); //
  
  useEffect(() => {  //очистка таймера
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
  const availableWarehouses = warehouses.filter((w) => w.isAvailableForOrder);

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
console.log("🔵 [Рендер] loading:", loading, "previewData:", !!previewData);
  // Состояния загрузки
  if (loading) {
    console.log("🔵 [Рендер] ПОКАЗЫВАЕМ СПИННЕР");
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader className="animate-spin w-12 h-12" />
      </div>
    );
  }

  if (error || !previewData) {
    console.log("🔵 [Рендер] ПОКАЗЫВАЕМ ОШИБКУ");
    return (
      <div className="h-screen flex justify-center items-center px-4">
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded text-center max-w-md">
          <p className="font-medium">Ошибка</p>
          <p className="text-sm">{error || "Данные не загружены"}</p>
        </div>
      </div>
    );
  }
  console.log("Количество складов:", warehouses.length);
  console.log("🔵 [Рендер] ПОКАЗЫВАЕМ ОСНОВНУЮ СТРАНИЦУ");
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
              const unitPrice = item.price.applied;
              const subtotal = unitPrice * qty;
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
                      const isAvailable = wh.isAvailableForOrder === true;
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
          <aside className="w-[35%] lg:w-[30%] xl:w-[25%] min-w-[200px] lg:min-w-[250px] bg-gray-50 p-4 lg:p-6 border-l border-gray-200 overflow-y-auto">
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
                   const isAvailable = wh.isAvailableForOrder === true;
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