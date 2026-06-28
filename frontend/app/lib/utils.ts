import { CartItemInterface } from "@/types/CartItemInterface";
import { OrderItemInterface } from "@/types/OrderItemInterface";
import { OrderItemRequest } from "@/types/OrderItemRequest";

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("ru-RU").format(num);
}

/**
 * Возвращает правильную форму слова в зависимости от числительного.
 * @param count - Количество
 * @param titles - Массив из трех форм [форма_для_1, форма_для_2, форма_для_5]
 * @returns Строку с нужной формой слова
 * * Пример: getEnding(5, ['товар', 'товара', 'товаров']) => 'товаров'
 */
export const getEnding = (count: number, titles: [string, string, string]): string => {
  const absCount = Math.abs(count) % 100;
  const lastDigit = absCount % 10;

  // Исключение для чисел от 11 до 14 (11 товаров, 12 товаров и т.д.)
  if (absCount > 10 && absCount < 20) {
    return titles[2];
  }
  
  // Для чисел, оканчивающихся на 2, 3, 4 (кроме 12, 13, 14) -> 2 товара
  if (lastDigit > 1 && lastDigit < 5) {
    return titles[1];
  }
  
  // Для чисел, оканчивающихся на 1 (кроме 11) -> 1 товар
  if (lastDigit === 1) {
    return titles[0];
  }
  
  // Для всех остальных (0, 5-9) -> 5 товаров
  return titles[2];
};

export const mapToOrderSubmit = ({cartItems}: {cartItems: CartItemInterface[]}): OrderItemRequest[] => {
  return cartItems.map(item => ({
                variantId: item.variantId,
                quantity: item.quantity
            }));
}