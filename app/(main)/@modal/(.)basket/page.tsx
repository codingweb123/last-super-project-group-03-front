"use client"

import Modal from "@/components/Modal/Modal"
import css from "./BasketModal.module.css"
import { useRouter } from "next/navigation"
import GoodsOrderList from "@/components/GoodsOrderList/GoodsOrderList"
import MessageNoInfo from "@/components/MessageNoInfo/MessageNoInfo"
import { useBasketStore } from '@/lib/stores/basketStore';

export default function BasketModal() {
    const router = useRouter()
    const onClose = () => router.back()

    const basket = useBasketStore(state => state.basket);

    return (
        <Modal onClose={onClose} modalClass={css.modal}>
            <div className={css.container}>
                <button className={css.closeBtn} onClick={onClose}>
                    <svg width={14} height={14}>
                        <use href="/icons.svg#i-cross"></use>
                    </svg>
                </button>
                <h1 className={css.title}>Ваш кошик</h1>
                {basket.length > 0
                    ? (<>
                        <GoodsOrderList/>
                        <div className={css.btnContainer}>
                            <button className={css.continueBtn} onClick={() => router.push('/goods')}>Продовжити покупки</button>
                            <button className={css.orderBtn} onClick={() => router.push('/order')}>Оформити замовлення</button>
                        </div></>
                    )
                    : <MessageNoInfo text="Ваш кошик порожній, мершій до покупок!" buttonText="До покупок" onClick={() => router.push('/goods')} />}
            </div>
        </Modal>
    )
}
