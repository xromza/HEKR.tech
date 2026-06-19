import { ApiArgs } from "@/types/ApiArgs";
import { CartInterface } from "@/types/CartInterface";
import { OrderItemRequest } from "@/types/OrderItemRequest";
import api from "./api";
import { CartItemInterface } from "@/types/CartItemInterface";

export async function getCart({ setData,
    setError,
    setLoading }: Pick<ApiArgs, 'setData' | 'setError' | 'setLoading'>) {
    try {
        setError(null);
        setLoading(true);
        const res = await api.get<CartInterface>("/v1/cart", {
            withCredentials: true
        });
        console.log("GET CART SUCCESSFUL: ", res.data);
        setData(res.data);
        return true;
    } catch (err: any) {
        if (err?.isAuthError && err.message === "SESSION_EXPIRED") {
            setError("Сессия истекла. Пожалуйста, войдите в аккаунт заново.");
        } else if (err.error || err.response?.data?.error) {
            const mainMessage = err.description || err.response?.data?.description || "Произошла ошибка при получении корзины";
            setError(mainMessage);
        } else {
            setError(err?.response?.data?.description || "Не удалось загрузить заказы");
        }
        return false;
    }
    finally {
        setLoading(false);
    }
}
export async function changeQuantityCart({
    variantId,
    quantity,
    setData,
    setError,
    setLoading
}: OrderItemRequest & Pick<ApiArgs, 'setData' | 'setError' | 'setLoading'>) {
    try {
        setLoading(true);
        setData(null);
        setError(null);

        const res = await api.post<CartItemInterface>("/v1/cart",
            {
                variantId: variantId,
                quantity: quantity
            },
            {
                withCredentials: true
            }
        )
        console.log("GET CART SUCCESSFUL: ", res.data);
        setData(res.data);
        return true;

    }
    catch (err: any) {
        const serverErrors = err.error || err.response?.data?.error;
        const mainMessage = err.description || err.response?.data?.description || "Произошла ошибка при добавлении в корзину";
        if (serverErrors) {
            setError(mainMessage);
        }
        return false;
    }
    finally {
        setLoading(false);
    }
}

export async function deleteSingleItem({
    variantId,
    setError,
    setLoading
}: { variantId: number } & Pick<ApiArgs, 'setError' | 'setLoading'>) { 
    try {
        setLoading(true);
        setError(null);

        await api.delete(`/v1/cart/${variantId}`, {
            withCredentials: true
        });
        
        console.log(`ITEM ${variantId} DELETED SUCCESSFUL (204)`);
        return true; 

    } catch (err: any) {
        const mainMessage = err.response?.data?.description || "Произошла ошибка при удалении товара";
        setError(mainMessage);
        return false;
    } finally {
        setLoading(false);
    }
}

export async function deleteAllItems({
    setError,
    setLoading
}: Pick<ApiArgs, 'setError' | 'setLoading'>) { 
    try {
        setLoading(true);
        setError(null);

        // Бэк вернет 204 No Content
        await api.delete(`/v1/cart`, {
            withCredentials: true
        });
        
        console.log("ALL ITEMS DELETED SUCCESSFUL (204)");
        return true;

    } catch (err: any) {
        const mainMessage = err.response?.data?.description || "Произошла ошибка при очистке корзины";
        setError(mainMessage);
        return false;
    } finally {
        setLoading(false);
    }
}
