"use client"

import { Routes } from "@/config/config"
import { useBasketStore } from "@/lib/stores/basketStore"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

export default function OrdersAdd() {
	const [isAdded, setIsAdded] = useState<boolean>(false)
	const setBasket = useBasketStore(state => state.setBasket)

	useEffect(() => {
		const add = () => {
			if (!isAdded) {
				setBasket([
					{
						id: "6877b9f116ae59c7b60d0107",
						size: "M",
						color: "white",
						amount: 1,
					},
					{
						id: "6877b9f116ae59c7b60d0112",
						size: "M",
						color: "black",
						amount: 5,
					},
					{
						id: "6877b9f116ae59c7b60d0160",
						size: "M",
						color: "black",
						amount: 9,
					},
				])
				setIsAdded(true)
			}
		}

		add()
	}, [isAdded, setBasket])
	return isAdded ? redirect(Routes.Home) : <p>Adding...</p>
}
