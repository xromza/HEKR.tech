"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, Loader, ArrowUp, Trash2, AlertCircle } from "lucide-react";
import { getPreview, checkout } from "../lib/order.service";
import { useToken } from "@/store/useToken";
import { formatPrice } from "../lib/utils";
import OrderNav from "@/components/OrderNav";
import type { PreOrderInterface } from "@/types/PreOrderInterface";
import { OrderErrorAlert } from "@/components/OrderErrorAlert";

// --- Типизация для формы доставки ---
interface DeliveryFormProps {
  onSubmit: (e: React.FormEvent) => void;
  warehouses: PreOrderInterface["warehouses"];
  selectedWarehouseId: number | null;
  setSelectedWarehouseId: (id: number) => void;
  address: string;
  setAddress: (v: string) => void;
  payment: string;
  setPayment: (v: string) => void;
  comment: string;
  setComment: (v: string) => void;
  submitting: boolean;
  selectedCount: number;
  submitError: string | Record<string, string> | null;
  allItems: any[];
}

const DeliveryForm = ({
  onSubmit, warehouses, selectedWarehouseId, setSelectedWarehouseId,
  address, setAddress, payment, setPayment, comment, setComment,
  submitting, selectedCount, submitError, allItems
}: DeliveryFormProps) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2">Выберите склад</label>
      <div className="flex flex-wrap gap-2">
        {warehouses.length === 0 && <p className="text-sm text-red-600">Нет доступных складов</p>}
        {warehouses.map((wh) => (
          <button
            key={wh.id}
            type="button"
            onClick={() => wh.availableForOrder && setSelectedWarehouseId(wh.id)}
            disabled={!wh.availableForOrder}
            className={`px-4 py-2 text-xs lg:text-sm uppercase tracking-wider border-2 transition ${selectedWarehouseId === wh.id ? "border-black bg-black text-white"
              : wh.availableForOrder ? "border-gray-300 hover:border-gray-400"
                : "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
              }`}
          >
            Склад #{wh.id}
          </button>
        ))}
      </div>
      {selectedWarehouseId && (
        <p className="text-xs text-gray-500 mt-2">
          {warehouses.find((w) => w.id === selectedWarehouseId)?.address}
        </p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider">Адрес доставки</label>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="г. Москва, ул. Примерная, д. 1"
        className="mt-1 block w-full border-b-2 border-gray-300 py-2 px-0 focus:border-black outline-none bg-transparent"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2">Способ оплаты</label>
      <div className="flex flex-wrap gap-2">
        {[{ l: "СБП", v: "SBP" }, { l: "КАРТА", v: "CARD" }, { l: "НАЛИЧНЫЕ", v: "CASH" }, { l: "СЧЕТ", v: "INVOICE" }].map((m) => (
          <button
            key={m.v}
            type="button"
            onClick={() => setPayment(m.v)}
            className={`px-4 py-2 text-xs lg:text-sm uppercase tracking-wider border-2 transition ${payment === m.v ? "border-black bg-black text-white" : "border-gray-300 hover:border-gray-400"
              }`}
          >
            {m.l}
          </button>
        ))}
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider">Комментарий</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        placeholder="Дополнительная информация (необязательно)"
        className="mt-1 block w-full border-b-2 border-gray-300 py-2 px-0 outline-none bg-transparent resize-none"
      />
    </div>

    {submitError && (
      <OrderErrorAlert error={submitError} items={allItems} />
    )}
    <button
      type="submit"
      disabled={submitting || selectedCount === 0}
      className="w-full bg-black text-white py-4 text-lg uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 transition"
    >
      {submitting
        ? <span className="flex items-center justify-center gap-2"><Loader className="animate-spin w-5 h-5" /> Оформление...</span>
        : `ЗАКАЗАТЬ (${selectedCount})`
      }
    </button>
  </form>
);

// --- Компонент для отображения информации о цене ---
const PriceInfo = ({ price, quantity }: { price: any; quantity: number }) => {
  const isWholesale = price.type === "WHOLESALE";

  return (
    <div className="text-xs space-y-1">
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${isWholesale
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-700"
          }`}>
          {isWholesale ? "ОПТОВАЯ" : "РОЗНИЧНАЯ"}
        </span>
        {!isWholesale && price.applied !== price.base && (
          <span className="text-red-600 line-through">
            {formatPrice(price.base)}
          </span>
        )}
      </div>

      {isWholesale && price.applied < price.base && (
        <div className="text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
          Ваша выгода: {formatPrice((price.base - price.applied) * quantity)} ({Math.round(((price.base - price.applied) / price.base) * 100)}%)
        </div>
      )}
    </div>
  );
};

// --- Главная страница ---
export default function OrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginValue = useToken((state) => state.user?.login);

  const [previewData, setPreviewData] = useState<PreOrderInterface | null>(null);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [removedIds, setRemovedIds] = useState<Set<number>>(new Set());
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);

  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("SBP");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | Record<string, string> | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const isInitialMount = useRef(true);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastFetchedSignature = useRef<string>("");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!previewData) return;

    const currentWarehouse = previewData.warehouses.find(w => w.id === selectedWarehouseId);
    const isCurrentAvailable = currentWarehouse?.availableForOrder ?? false;

    if (!isCurrentAvailable) {
      const firstAvailable = previewData.warehouses.find(w => w.availableForOrder);
      if (firstAvailable && firstAvailable.id !== selectedWarehouseId) {
        setSelectedWarehouseId(firstAvailable.id);
      }
    }
  }, [previewData, selectedWarehouseId]);

  const handleManualQuantity = (id: number, value: string) => {
    const val = parseInt(value);
    setQuantities(prev => ({
      ...prev,
      [id]: !isNaN(val) && val > 0 ? val : 1
    }));
  };

  const fetchPreview = useCallback(async (items: { variantId: number; quantity: number }[], isBackground = false) => {
    if (!loginValue) return;

    const signature = JSON.stringify(items.sort((a, b) => a.variantId - b.variantId));
    if (signature === lastFetchedSignature.current) return;

    lastFetchedSignature.current = signature;

    if (isBackground) setRefreshing(true);
    else setLoading(true);

    let fetchedData: PreOrderInterface | null = null;
    let fetchError: string | null = null;

    const handleSetData = (data: any) => { fetchedData = data; };
    const handleSetError = (err: any) => {
      if (typeof err === 'function') fetchError = err(fetchError);
      else fetchError = err;
    };
    const handleSetLoading = () => { };

    await getPreview({
      items,
      setData: handleSetData as any,
      setError: handleSetError as any,
      setLoading: handleSetLoading as any,
      setErrorMap: undefined as any,
      updateSession: undefined as any,
      updateToken: undefined as any
    });

    if (fetchError) {
      setError(fetchError);
    } else if (fetchedData) {
      const data = fetchedData as PreOrderInterface;
      setError(null);

      if (!isBackground) {
        setPreviewData(data);
        setAllItems(data.items);
        setSelectedIds(new Set(data.items.map(i => i.variantId)));
        setQuantities(Object.fromEntries(data.items.map(i => [i.variantId, i.quantity])));

        const firstAvailable = data.warehouses.find(w => w.availableForOrder);
        if (firstAvailable && !selectedWarehouseId) {
          setSelectedWarehouseId(firstAvailable.id);
        }
      } else {
        setAllItems(prev => prev.map(item => {
          const freshItem = data.items.find(i => i.variantId === item.variantId);
          return freshItem
            ? { ...item, subtotal: freshItem.subtotal, price: freshItem.price, availableAtWarehouses: freshItem.availableAtWarehouses }
            : item;
        }));

        setPreviewData(prev => prev ? {
          ...prev,
          totalPrice: data.totalPrice,
          warehouses: data.warehouses
        } : null);
      }
    }

    if (isBackground) setRefreshing(false);
    else setLoading(false);
  }, [loginValue, selectedWarehouseId]);

  useEffect(() => {
    if (!loginValue) { router.push("/"); return; }
    if (!isInitialMount.current) return;
    isInitialMount.current = false;

    const variants = searchParams.get("variants")?.split(",").map(Number);
    const qtys = searchParams.get("quantity")?.split(",").map(Number);

    if (!variants || !qtys || variants.length !== qtys.length) {
      router.push("/cart");
      return;
    }

    const initialItems = variants.map((v, i) => ({ variantId: v, quantity: qtys[i] }));
    fetchPreview(initialItems, false);
  }, [loginValue, searchParams, router, fetchPreview]);

  useEffect(() => {
    if (isInitialMount.current || !previewData) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const items = Array.from(selectedIds)
        .filter(id => !removedIds.has(id))
        .map(id => ({
          variantId: id,
          quantity: quantities[id] || 1
        }));

      if (items.length > 0) {
        fetchPreview(items, true);
      }
    }, 400);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [selectedIds, quantities, previewData, fetchPreview, removedIds]);

  const changeQuantity = (id: number, delta: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }));
  };

  const toggleSelect = (variantId: number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(variantId)) newSet.delete(variantId);
      else newSet.add(variantId);
      return newSet;
    });
  };

  const removeItem = (variantId: number) => {
    setRemovedIds(prev => {
      const newSet = new Set(prev);
      newSet.add(variantId);
      return newSet;
    });
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(variantId);
      return newSet;
    });
    setQuantities(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[variantId];
      return newQuantities;
    });
  };

  const toggleAll = () => {
    const activeItems = allItems.filter(i => !removedIds.has(i.variantId));
    if (selectedIds.size === activeItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(activeItems.map((item) => item.variantId)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWarehouseId) { setSubmitError("Выберите склад"); return; }
    if (!previewData) return;

    setSubmitting(true);
    setSubmitError(null);

    const orderItems = Array.from(selectedIds)
      .filter(id => !removedIds.has(id))
      .map(id => ({
        variantId: id,
        quantity: quantities[id] || 1
      }));

    let orderId: string | number | null = null;
    let checkoutErr: string | Record<string, string> | null = null;

    const handleSetOrderId = (d: any) => { orderId = d.id; };
    const handleSetCheckoutError = (err: any) => {
      if (typeof err === 'function') checkoutErr = err(checkoutErr);
      else checkoutErr = err;
    };

    await checkout({
      items: orderItems,
      warehouseId: selectedWarehouseId,
      address, payment, comment,
      setData: handleSetOrderId as any,
      setError: handleSetCheckoutError as any,
      setLoading: (() => { }) as any,
    });

    if (checkoutErr) {
      setSubmitError(checkoutErr);
    } else if (orderId) {
      router.push(`/order/${orderId}`);
    }

    setSubmitting(false);
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader className="animate-spin w-12 h-12" /></div>;
  if (error || !previewData) return (
    <div className="h-screen flex justify-center items-center px-4">
      <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded text-center max-w-md">
        <p className="font-medium">Ошибка</p>
        <p className="text-sm">{error || "Данные не загружены"}</p>
      </div>
    </div>
  );

  const activeItems = allItems.filter(item => !removedIds.has(item.variantId));
  const totalPrice = previewData.totalPrice || 0;

  return (
    <main className="h-full w-full mx-auto flex max-w-[1680px]">
      <div className="flex flex-col xl:flex-row w-full px-4 gap-6">
        <div className="flex-shrink-0 flex mb-4 xl:mb-0 items-center xl:items-start flex-col w-full xl:w-fit">
          <OrderNav onScrollToForm={scrollToForm}/>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-w-0">
          <div className="flex-1 overflow-y-auto relative order-2 lg:order-none min-w-0">
            {refreshing && (
              <div className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow-sm border border-gray-100 flex items-center gap-2 text-xs text-gray-500 animate-in fade-in duration-300">
                <Loader className="animate-spin w-3 h-3" /> Пересчет...
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold uppercase tracking-wider">Товары в заказе</h2>
              <button type="button" onClick={toggleAll} className="text-sm text-blue-600 hover:underline transition-colors">
                {selectedIds.size === activeItems.length ? "Снять все" : "Выбрать все"}
              </button>
            </div>

            <div className="space-y-6">
              {activeItems.map(item => {
                const isSelected = selectedIds.has(item.variantId);
                const qty = quantities[item.variantId] ?? item.quantity;

                const hasValidationError = submitError
                  && typeof submitError !== "string"
                  && submitError[String(item.variantId)];

                const stockOnSelected = item.availableAtWarehouses?.find((s: any) => s.warehouseId === selectedWarehouseId);
                const isAvailable = stockOnSelected ? stockOnSelected.availableQuantity >= qty : false;

                return (
                  <div
                    key={item.variantId}
                    className={`
                      relative flex gap-4 border-b pb-6 transition-all duration-300 
                      ${hasValidationError
                        ? "border-red-300 bg-red-50/30"
                        : "border-gray-200"
                      }
                      ${(!isSelected || !isAvailable) && !hasValidationError && "opacity-50"}
                    `}
                  >
                    {hasValidationError && (
                      <div className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md animate-in zoom-in-75 duration-300">
                        <AlertCircle size={14} />
                      </div>
                    )}

                    <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(item.variantId)} className="w-5 h-5 mt-2 accent-black cursor-pointer" />

                    <div className="relative w-24 h-24 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                      {item.mainImageUrl && <Image src={item.mainImageUrl} alt={item.title} fill className="object-contain" sizes="96px" />}
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <p className="font-bold text-lg leading-tight truncate">{item.brand}</p>
                            <p className="text-sm text-gray-600 uppercase truncate">{item.title}</p>
                            <p className="text-xs text-gray-500 mt-1 uppercase">Размер: {item.size}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.variantId)}
                            className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                            title="Удалить из заказа"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {hasValidationError && (
                          <div className="mt-2 bg-red-100 border border-red-200 text-red-800 text-xs px-3 py-2 rounded-md flex items-center gap-2 animate-in slide-in-from-top-1 duration-300">
                            <AlertCircle size={14} className="flex-shrink-0" />
                            <span className="font-medium">
                              {typeof submitError !== "string" && submitError[String(item.variantId)]}
                            </span>
                          </div>
                        )}

                        {isSelected && !hasValidationError && (
                          <div className="mt-2">
                            <PriceInfo price={item.price} quantity={qty} />
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-end mt-3 gap-3">
                        <div className="flex items-center gap-3 border border-gray-300 rounded px-2 py-1 bg-white flex-shrink-0">
                          <button type="button" onClick={() => changeQuantity(item.variantId, -1)} disabled={!isSelected || qty <= 1} className="disabled:opacity-50 hover:text-gray-600"><Minus size={14} /></button>
                          <input
                            type="number"
                            min="1"
                            value={qty}
                            onChange={(e) => handleManualQuantity(item.variantId, e.target.value)}
                            disabled={!isSelected}
                            className="w-10 text-center text-sm font-medium outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button type="button" onClick={() => changeQuantity(item.variantId, 1)} disabled={!isSelected} className="disabled:opacity-50 hover:text-gray-600"><Plus size={14} /></button>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-lg">{isSelected ? formatPrice(item.subtotal) : "—"}</p>
                          {isSelected && item.price && (
                            <p className="text-xs text-gray-500">
                              {formatPrice(item.price.applied)} × {qty} шт.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t-2 border-black flex justify-between text-2xl font-bold">
              <span>ИТОГО</span>
              <span>{selectedIds.size > 0 ? formatPrice(totalPrice) : "—"}</span>
            </div>

            {/* Мобильная версия формы */}
            {isMobile && (
              <div ref={formRef} className="mt-8 pt-6 border-t-2 border-gray-200">
                <h2 className="text-xl font-bold uppercase tracking-wider mb-4">Данные доставки</h2>
                <DeliveryForm
                  warehouses={previewData.warehouses}
                  selectedWarehouseId={selectedWarehouseId} setSelectedWarehouseId={setSelectedWarehouseId}
                  address={address} setAddress={setAddress}
                  payment={payment} setPayment={setPayment}
                  comment={comment} setComment={setComment}
                  submitting={submitting} selectedCount={selectedIds.size}
                  submitError={submitError} onSubmit={handleSubmit}
                  allItems={allItems}
                />
              </div>
            )}
          </div>

          {/* Десктопная версия формы (правая колонка) */}
          {!isMobile && (
            <aside className="w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 bg-gray-50 p-4 lg:p-6 border border-gray-200 rounded h-fit sticky top-4">
              <h2 className="text-xl font-bold uppercase tracking-wider mb-6">Данные доставки</h2>
              <DeliveryForm
                warehouses={previewData.warehouses}
                selectedWarehouseId={selectedWarehouseId} setSelectedWarehouseId={setSelectedWarehouseId}
                address={address} setAddress={setAddress}
                payment={payment} setPayment={setPayment}
                comment={comment} setComment={setComment}
                submitting={submitting} selectedCount={selectedIds.size}
                submitError={submitError} onSubmit={handleSubmit}
                allItems={allItems}
              />
            </aside>
          )}
        </div>
      </div>

      {/* Кнопка наверх для мобилки */}
      {isMobile && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 bg-black text-white p-3 rounded-full shadow-lg z-20">
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </main>
  );
}