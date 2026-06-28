import api from "./api";
import { ApiArgs } from "@/types/ApiArgs";

// ==========================================
// ИНТЕРФЕЙСЫ АРГУМЕНТОВ ФУНКЦИЙ
// ==========================================

interface UpdateStockArgs {
    warehouseId: number;
    variantId: number;
    quantity: number;
}

interface GetUsersArgs {
    page?: number;
    size?: number;
    sort?: string;
    approved: boolean;
}

interface UpdateUserApprovalArgs {
    userId: number;
    approved: boolean;
}

interface UpdateOrderStatusArgs {
    orderId: number;
    status: string;
    comment: string;
}

interface CreateProductArgs {
    productDto: any; // Замените на ProductRequestDto при наличии
}

interface UpdateProductArgs {
    productId: number;
    productDto: any;
}

interface CreateVariantArgs {
    productId: number;
    dto: any; // Замените на ProductVariantRequestDto при наличии
}

interface UpdateVariantArgs {
    productId: number;
    variantId: number;
    dto: any;
}

interface UploadVariantImageArgs {
    productId: number;
    variantId: number;
    formData: FormData; // Для отправки файлов картинок
}

interface DeleteVariantImageArgs {
    productId: number;
    variantId: number;
    imageId: number;
}

interface UpdateDiscountArgs {
    categoryId: number;
    discount: number;
}

// Универсальный тип для админских методов, исключающий клиентские токены и сессии
type AdminApiArgs = Omit<ApiArgs, "setErrorMap" | "updateSession" | "updateToken">;

// ==========================================
// СЕРВИСНЫЕ ФУНКЦИИ
// ==========================================

export async function getAdminProductsList({
    setData,
    setError,
    setLoading
}: AdminApiArgs) {
    try {
        setLoading(true);
        setError(null);
        // Запрашиваем большую страницу с verbose=true, чтобы получить в content массив ProductInterface
        const res = await api.get<any>("/v1/products?size=1000&verbose=true");

        // В Spring Data Page массив лежит в поле content
        setData(res.data.content || []);
    } catch (err: any) {
        const msg = err.response?.data?.message || err.message;
        setError(msg);
        console.error("GET ADMIN PRODUCTS ERROR: ", msg);
    } finally {
        setLoading(false);
    }
}

export async function getCategories({ setData, setError, setLoading }: AdminApiArgs) {
    try {
        setLoading(true);
        // Запрашиваем категории (замени на свой актуальный эндпоинт для категорий)
        const res = await api.get("/v1/categories");
        setData(res.data);
    } catch (err: any) {
        setError(err.response?.data?.message || "Ошибка загрузки категорий");
    } finally {
        setLoading(false);
    }
}

/**
 * Получить список всех складов
 */
export async function getWarehouses({
    setData,
    setError,
    setLoading
}: AdminApiArgs) {
    try {
        setLoading(true);
        setError(null);
        const res = await api.get<any[]>("/v1/admin/warehouse");
        setData(res.data);
        return res.data;
    } catch (err: any) {
        const msg = err.response?.data?.message || err.message;
        setError(msg);
        console.error("GET WAREHOUSES ERROR: ", msg);
    } finally {
        setLoading(false);
    }
}

/**
 * Создать новый склад
 */
export async function createNewWarehouse({
    address,
    setData,
    setError,
    setLoading
}: { address: string } & AdminApiArgs) {
    try {
        setLoading(true);
        setError(null);
        const res = await api.post<any>("/v1/admin/warehouse", address, {
            headers: { 'Content-Type': 'text/plain' }
        });
        setData(res.data);
        return res.data;
    } catch (err: any) {
        const msg = err.response?.data?.message || err.message;
        setError(msg);
        console.error("CREATE WAREHOUSE ERROR: ", msg);
    } finally {
        setLoading(false);
    }
}
export async function getUserById({ id, setData, setError, setLoading }: { id: number } & AdminApiArgs) {
    try {
        setLoading(true);
        const res = await api.get(`/admin/users/${id}`); // Путь согласно контроллеру
        setData(res.data);
    } catch (err: any) {
        setError(err.response?.data?.message || "Ошибка загрузки пользователя");
    } finally {
        setLoading(false);
    }
}
/**
 * Обновить или добавить остатки на складе
 */
export async function updateStock({
    warehouseId,
    variantId,
    quantity,
    setData,
    setError,
    setLoading
}: UpdateStockArgs & AdminApiArgs) {
    try {
        setLoading(true);
        setError(null);
        const res = await api.put<any>(
            `/v1/admin/stock/${warehouseId}`,
            quantity,
            {
                params: { variantId },
                headers: { 'Content-Type': 'application/json' }
            }
        );
        setData(res.data);
        return res.data;
    } catch (err: any) {
        const msg = err.response?.data?.message || err.message;
        setError(msg);
        console.error("UPDATE STOCK ERROR: ", msg);
    } finally {
        setLoading(false);
    }
}

/**
 * Получить все остатки на конкретном складе
 */
export async function getStockOnWarehouse({
    warehouseId,
    setData,
    setError,
    setLoading
}: { warehouseId: number } & AdminApiArgs) {
    try {
        setLoading(true);
        setError(null);
        const res = await api.get<any[]>(`/v1/admin/stock/${warehouseId}`);
        setData(res.data);
        return res.data;
    } catch (err: any) {
        const msg = err.response?.data?.message || err.message;
        setError(msg);
        console.error("GET STOCK ERROR: ", msg);
    } finally {
        setLoading(false);
    }
}

/**
 * Получить остаток конкретного варианта товара на конкретном складе
 */
export async function getVariantStockOnWarehouse({
    warehouseId,
    variantId,
    setData,
    setError,
    setLoading
}: { warehouseId: number; variantId: number } & AdminApiArgs) {
    try {
        setLoading(true);
        setError(null);
        const res = await api.get<any>(`/v1/admin/stock/${warehouseId}/`, {
            params: { variantId }
        });
        setData(res.data);
        return res.data;
    } catch (err: any) {
        const msg = err.response?.data?.message || err.message;
        setError(msg);
        console.error("GET VARIANT STOCK ERROR: ", msg);
    } finally {
        setLoading(false);
    }
}

export async function getAdminOrders({ page = 0, size = 10, setData, setError, setLoading }: any) {
    try {
        setLoading(true);
        const res = await api.get(`/v1/admin/orders?page=${page}&size=${size}&sort=id,asc`);
        setData(res.data);
    } catch (err: any) {
        setError(err.response?.data?.message || "Ошибка загрузки заказов");
    } finally {
        setLoading(false);
    }
}

/**
 * Получить список пользователей с пагинацией и фильтром подтверждения
 */
export async function getUsers({
    page = 0,
    size = 10,
    approved,
    setData, // ожидаем, что здесь будет функция, которая примет { content, totalPages, ... }
    setError,
    setLoading
}: any) {
    try {
        setLoading(true);
        setError(null);
        // Теперь бэкенд возвращает Page<User>
        const res = await api.get("/v1/admin/users", {
            params: {
                page, size, approved,
                sort: "id,asc"
            }
        });

        setData(res.data);
        return res.data;
    } catch (err: any) {
        setError(err.response?.data?.message || err.message);
    } finally {
        setLoading(false);
    }
}
/**
 * Изменить статус верификации/подтверждения пользователя (ROLE_ADMIN)
 */
export async function updateUserApproval({
    userId,
    approved,
    setData,
    setError,
    setLoading
}: UpdateUserApprovalArgs & AdminApiArgs) {
    try {
        setLoading(true);
        setError(null);
        const res = await api.patch<any>(`/v1/admin/users/${userId}`, null, {
            params: { approved }
        });
        setData(res.data);
        return res.data;
    } catch (err: any) {
        const msg = err.response?.data?.message || err.message;
        setError(msg);
        console.error("UPDATE USER APPROVAL ERROR: ", msg);
    } finally {
        setLoading(false);
    }
}

/**
 * Обновить статус заказа
 */
export async function updateOrderStatus({
    orderId,
    status,
    comment,
    setData,
    setError,
    setLoading
}: UpdateOrderStatusArgs & AdminApiArgs) {
    try {
        setLoading(true);
        setError(null);
        const res = await api.patch<any>(`/v1/admin/orders/${orderId}/status`, {
            status,
            comment
        });
        setData(res.data);
        return res.data;
    } catch (err: any) {
        const msg = err.response?.data?.message || err.message;
        setError(msg);
        console.error("UPDATE ORDER STATUS ERROR: ", msg);
    } finally {
        setLoading(false);
    }
}

/**
 * Создать новый продукт
 */
export async function createProduct({
    productDto,
    setData,
    setError,
    setLoading
}: CreateProductArgs & AdminApiArgs) {
    try {
        setLoading(true);
        setError(null);
        const res = await api.post<any>("/v1/admin/products", productDto);
        setData(res.data);
        return res.data;
    } catch (err: any) {
        const msg = err.response?.data?.message || err.message;
        setError(msg);
        console.error("CREATE PRODUCT ERROR: ", msg);
    } finally {
        setLoading(false);
    }
}

/**
 * Частично обновить/изменить существующий продукт
 */
export async function updateProduct({
    productId,
    productDto,
    setData,
    setError,
    setLoading
}: UpdateProductArgs & AdminApiArgs) {
    try {
        setLoading(true);
        setError(null);
        const res = await api.patch<any>(`/v1/admin/products/${productId}`, productDto);
        setData(res.data);
        return res.data;
    } catch (err: any) {
        const msg = err.response?.data?.message || err.message;
        setError(msg);
        console.error("UPDATE PRODUCT ERROR: ", msg);
    } finally {
        setLoading(false);
    }
}

/**
 * Создать новую категорию
 */
export async function createCategory({
    categoryDto,
    setData,
    setError,
    setLoading
}: { categoryDto: any } & AdminApiArgs) {
    try {
        setLoading(true);
        setError(null);
        const res = await api.post<any>("/v1/admin/categories", categoryDto);
        setData(res.data);
        return res.data;
    } catch (err: any) {
        const msg = err.response?.data?.message || err.message;
        setError(msg);
        console.error("CREATE CATEGORY ERROR: ", msg);
    } finally {
        setLoading(false);
    }
}

/**
 * Создать вариант для существующего продукта
 */
export async function createProductVariant({
    productId,
    dto,
    setData,
    setError,
    setLoading
}: CreateVariantArgs & AdminApiArgs) {
    try {
        setLoading(true);
        setError(null);
        const res = await api.post<any>(`/v1/admin/products/${productId}/variants`, dto);
        setData(res.data);
        return res.data;
    } catch (err: any) {
        const msg = err.response?.data?.message || err.message;
        setError(msg);
        console.error("CREATE VARIANT ERROR: ", msg);
    } finally {
        setLoading(false);
    }
}

/**
 * Изменить параметры существующего варианта продукта
 */
export async function updateProductVariant({
    productId,
    variantId,
    dto,
    setData,
    setError,
    setLoading
}: UpdateVariantArgs & AdminApiArgs) {
    try {
        setLoading(true);
        setError(null);
        const res = await api.patch<any>(`/v1/admin/products/${productId}/variants/${variantId}`, dto);
        setData(res.data);
        return res.data;
    } catch (err: any) {
        const msg = err.response?.data?.message || err.message;
        setError(msg);
        console.error("UPDATE VARIANT ERROR: ", msg);
    } finally {
        setLoading(false);
    }
}

/**
 * Загрузить изображение для конкретного варианта продукта
 */
export async function uploadVariantImage({
    productId,
    variantId,
    formData,
    setData,
    setError,
    setLoading
}: UploadVariantImageArgs & AdminApiArgs) {
    try {
        setLoading(true);
        setError(null);
        const res = await api.post<any>(
            `/v1/admin/products/${productId}/variants/${variantId}/images`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setData(res.data);
        return res.data;
    } catch (err: any) {
        const msg = err.response?.data?.message || err.message;
        setError(msg);
        console.error("UPLOAD IMAGE ERROR: ", msg);
    } finally {
        setLoading(false);
    }
}

/**
 * Удалить изображение варианта продукта
 */
export async function deleteVariantImage({
    productId,
    variantId,
    imageId,
    setData,
    setError,
    setLoading
}: DeleteVariantImageArgs & AdminApiArgs) {
    try {
        setLoading(true);
        setError(null);
        const res = await api.delete<any>(`/v1/admin/products/${productId}/variants/${variantId}/images/${imageId}`);
        setData(res.data);
        return res.data;
    } catch (err: any) {
        const msg = err.response?.data?.message || err.message;
        setError(msg);
        console.error("DELETE IMAGE ERROR: ", msg);
    } finally {
        setLoading(false);
    }
}

/**
 * Обновить скидку для категории
 */
export async function updateCategoryDiscount({
    categoryId,
    discount,
    setData,
    setError,
    setLoading
}: UpdateDiscountArgs & AdminApiArgs) {
    try {
        setLoading(true);
        setError(null);
        const res = await api.patch<any>(`/v1/admin/discounts/${categoryId}`, discount, {
            headers: { 'Content-Type': 'application/json' }
        });
        setData(res.data);
        return res.data;
    } catch (err: any) {
        const msg = err.response?.data?.message || err.message;
        setError(msg);
        console.error("UPDATE DISCOUNT ERROR: ", msg);
    } finally {
        setLoading(false);
    }
}