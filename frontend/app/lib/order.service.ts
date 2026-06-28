import { ApiArgs } from "@/types/ApiArgs";
import api from "./api";
import { OrderInterface } from "@/types/OrderInterface";
import { VerboseOrderInterface } from "@/types/VerboseOrderInterface";
import { OrderShippingInterface } from "@/types/OrderCheckoutInterface";
import { OrderItemRequest } from "@/types/OrderItemRequest";
import { PreOrderInterface } from "@/types/PreOrderInterface";

export async function getOrders({ setData,
    setError,
    setLoading }: Pick<ApiArgs, 'setData' | 'setError' | 'setLoading'>) {
    try {
        setLoading(true);
        setError(null);
        const res = await api.get<OrderInterface[]>("/v1/orders", {
            withCredentials: true
        });
        console.log("GET ORDERS SUCCESSFUL: ", res.data)
        setData(res.data);
        return true;
    } catch (err: any) {

        if (err?.isAuthError && err.message === "SESSION_EXPIRED") {
            setError("Сессия истекла. Пожалуйста, войдите в аккаунт заново.");
        } else if (err.error || err.response?.data?.error) {
            const mainMessage = err.description || err.response?.data?.description || "Произошла ошибка при получении списка заказов";
            setError(mainMessage);
        } else {
            setError(err?.response?.data?.description || "Не удалось загрузить заказы");
        }
        return false;
    } finally {
        setLoading(false);
    }
}

export async function getOrder({
    id,
    setData,
    setError,
    setLoading
}: { id: number } & Pick<ApiArgs, 'setData' | 'setError' | 'setLoading'>) {
    try {
        setLoading(true);
        setError(null);
        const res = await api.get<VerboseOrderInterface>(`/v1/orders/${id}`, {
            withCredentials: true
        });
        console.log("GET ORDER SUCCESSFUL: ", res.data)
        setData(res.data);
        return true;
    } catch (err: any) {
        const serverErrors = err.error || err.response?.data?.error;
        const mainMessage = err.description || err.response?.data?.description || "Произошла ошибка при получении заказа";
        if (serverErrors) {
            setError(mainMessage);
        }
        return false;
    } finally {
        setLoading(false);
    }
}

export async function checkout({
    items,
    warehouseId,
    address,
    payment,
    comment,
    setData,
    setError,
    setLoading }:
    OrderShippingInterface & Pick<ApiArgs, 'setData' | 'setError' | 'setLoading'>) {
    try {
        setLoading(true);
        setError(null);
        const res = await api.post<VerboseOrderInterface>(`/v1/orders`, {
            items: items,
            warehouseId: warehouseId,
            address: address,
            payment: payment,
            comment: comment
        }, {
            withCredentials: true
        });
        console.log("CHECKOUT SUCCESSFUL: ", res.data)
        setData(res.data);
        return true;
    } catch (err: any) {
        const errorData = err.response?.data;
        
        const mainMessage = errorData?.description || "Произошла ошибка при заказе";
        const errorMap = errorData?.errors;

        if (errorMap) {
            setError(errorMap); 
        } else {
            setError(mainMessage);
        }
        return false;
    } finally {
        setLoading(false);
    }
}

export async function getPreview({
    items,
    setData,
    setError,
    setLoading
}: { items: OrderItemRequest[] } & ApiArgs) {
    try {
        setLoading(true);
        setError(null);
        const res = await api.post<PreOrderInterface>(`/v1/orders/preview`, {
            items: items,
        }, {
            withCredentials: true
        });
        console.log("PREORDER FETCH SUCCESSFUL: ", res.data)
        setData(res.data);
        return true;
    } catch (err: any) {
        const serverErrors = err.error || err.response?.data?.error;
        const mainMessage = err.description || err.response?.data?.description || "Произошла ошибка при заказе всей корзины";
        if (serverErrors) {
            setError(mainMessage);
        }
        return false;
    } finally {
        setLoading(false);
    }
}