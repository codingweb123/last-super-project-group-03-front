"use client"

import Modal from "@/components/Modal/Modal"
import css from "./BasketModal.module.css"
import { useRouter } from "next/navigation"

export default function BasketModal() {
	const router = useRouter()
	const onClose = () => router.back()

	return (
		<Modal onClose={onClose} modalClass={css.modal}>
			<p>Basket Modal</p>
		</Modal>
	)
}
