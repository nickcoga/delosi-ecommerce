import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  productId: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  hasHydrated: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
};

// Capturado dentro de la función creadora para que onRehydrateStorage pueda
// actualizar el estado sin referenciar `useCartStore` (ver DEC-007): esa
// referencia se evaluaría antes de que `create()` termine de asignarse.
let setCartState: ((partial: Partial<CartState>) => void) | undefined;

export const useCartStore = create<CartState>()(
  persist(
    (set) => {
      setCartState = set;
      return {
      items: [],
      hasHydrated: false,
      addItem: (item, quantity = 1) => {
        const safeQuantity = Math.max(1, Math.floor(quantity));
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + safeQuantity }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: safeQuantity }],
          };
        });
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      setQuantity: (productId, quantity) => {
        const safeQuantity = Math.floor(quantity);
        set((state) => {
          if (safeQuantity <= 0) {
            return {
              items: state.items.filter((i) => i.productId !== productId),
            };
          }
          return {
            items: state.items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: safeQuantity }
                : i
            ),
          };
        });
      },
      };
    },
    {
      name: "delosi-cart",
      storage: createJSONStorage(() => localStorage),
      // Solo el contenido real del carrito se persiste; hasHydrated es un
      // flag transitorio de UI y nunca debe guardarse ni leerse de localStorage.
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => () => {
        setCartState?.({ hasHydrated: true });
      },
    }
  )
);

export const selectItemCount = (state: CartState) =>
  state.items.reduce((total, item) => total + item.quantity, 0);
