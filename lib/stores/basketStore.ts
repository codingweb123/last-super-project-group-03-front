import { Cloth } from "@/types/shop"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface BasketStore {
	basket: Cloth[]
	setBasket: (basket: Cloth[]) => void
	clearBasket: () => void
}

export const useBasketStore = create<BasketStore>()(
	persist(
		set => ({
			basket: [],
			setBasket: basket => set(() => ({ basket })),
			clearBasket: () => set(() => ({ basket: [] })),
		}),
		{
			name: "clothica-basket",
			partialize: state => ({ basket: state.basket }),
		}
	)
)
