import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    variantId: number;
    quantity: number;
}

interface CartState {
    inCarts: CartItem[];
    addInCarts: (variantId: number) => void;
    isInCarts: (variantId: number) => boolean;
    decrementQuantity: (variantId: number) => void;
    incrementQuantity: (variantId: number) => void;
    removeFromCart: (variantId: number) => void;
    getTotalItems: () => number;
    clearCart: () => void;
}

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            inCarts: [],

            isInCarts: (variantId) => 
                get().inCarts.some((item) => item.variantId === variantId),

            addInCarts: (variantId) => {
                const { inCarts } = get();
                const exists = inCarts.find((item) => item.variantId === variantId);

                if (exists) {
                    get().incrementQuantity(variantId);
                } else {
                    set({
                        inCarts: [...inCarts, { variantId, quantity: 1 }]
                    });
                }
            },

            incrementQuantity: (variantId) => {
                set((state) => ({
                    inCarts: state.inCarts.map((item) =>
                        item.variantId === variantId 
                            ? { ...item, quantity: item.quantity + 1 } 
                            : item
                    ),
                }));
            },

            decrementQuantity: (variantId) => {
                const { inCarts, removeFromCart } = get();
                const item = inCarts.find((i) => i.variantId === variantId);

                if (!item) return;

                if (item.quantity <= 1) {
                    removeFromCart(variantId);
                } else {
                    set({
                        inCarts: inCarts.map((i) =>
                            i.variantId === variantId 
                                ? { ...i, quantity: i.quantity - 1 } 
                                : i
                        ),
                    });
                }
            },

            removeFromCart: (variantId) => {
                set((state) => ({
                    inCarts: state.inCarts.filter((item) => item.variantId !== variantId),
                }));
            },

            getTotalItems: () => 
                get().inCarts.reduce((acc, item) => acc + item.quantity, 0),

            clearCart: () => set({ inCarts: [] }),
        }),
        {
            name: 'cart-storage',
        }
    )
);