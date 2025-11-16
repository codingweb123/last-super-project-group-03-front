'use client'

import { useBasketStore } from '@/lib/stores/basketStore';
import css from './GoodsOrderList.module.css';
import Image from 'next/image';
import { useQueries } from '@tanstack/react-query';
import {getSingleGood} from '@/lib/api/clientApi';

export default function GoodsOrderList() {
    const basket = useBasketStore(state => state.basket);
    const setBasket = useBasketStore(state => state.setBasket);

    const goodsQuery = useQueries({
        queries: basket.map((good) => ({
            queryKey: ['good', good.id],
            queryFn: () => getSingleGood(good.id),
        })),
    });

    const isLoading = goodsQuery.some(q => q.isLoading);
    const hasNoData = goodsQuery.some(q => !q.data);
    
    if (isLoading || hasNoData) {
        return <p>Loading...</p>;
    };

    const fullBasket = basket.map((good, i) => {
        const fullData = goodsQuery[i].data!;
        return {
            ...good,
            ...fullData
        }
    });

    const handleChange = (id: string, newAmount: number) => {
        setBasket(basket.map((good) =>
        good.id===id ? {...good, amount: newAmount}: good))
    }

    const handleRemoveGood = (id: string) => {
        setBasket(basket.filter(good => good.id !== id));
    }
    
    const totalSum = fullBasket.reduce((acc, good) => acc + good.price?.value * good.amount, 0);

    return <>
        <ul className={css.goodsList}>
            {fullBasket.map((good)=>
            <li className={css.goodCard} key={good._id}>
                    <Image
                        src={good.image}
                        width={82}
                        height={101}
                        alt={good.name}
                        className={css.image}
                    />
                    <div className={css.contentBox}>
                        <div className={css.goodInfo}>
                            <div className={css.headingBox}>
                                <h2 className={css.goodName}>{good.name}</h2>
                                <div className={css.reviewsContainer}>
                                    <div className={css.reviewBox}>
                                        <svg width={16} height={16}>
                                            <use href='/icons.svg#i-star-filled'></use>
                                        </svg>
                                        <p className={css.stars}>{good.stars}</p>
                                    </div>
                                    <div className={css.reviewBox}>
                                        <svg width={16} height={16}>
                                            <use href='/icons.svg#i-comment'></use>
                                        </svg>
                                        <p className={css.comments}>{good.feedbacks.length}</p>
                                    </div>
                                </div>
                            </div>
                            <p className={css.price}>{good.price?.value} грн</p>
                        </div>
                        <div className={css.goodNav}>
                            <input
                                className={css.quantity}
                                type="number"
                                min={1}
                                name={good?._id}
                                value= {good.amount}
                                onChange={(e) => handleChange(good.id, Number(e.target.value))} />
                            <button className={css.trashBtn} onClick={()=>handleRemoveGood(good.id)}>
                                <svg width={24} height={24}>
                                    <use href='/icons.svg#i-trash'></use>
                                </svg>
                            </button>
                        </div>
                    </div>
            </li>
            )}
        </ul>
        <div className={css.totalBox}>
            <div className={css.goodsSum}>
                <p className={css.sumTitle}>Проміжний підсумок</p>
                <p className={css.sum}>{totalSum}</p>
            </div>
            <p className={css.delivery}>Доставка</p>
            <div className={css.goodsTotalSum}>
                <p className={css.totalTitle}>Всього</p>
                <p className={css.totalSum}>{totalSum}</p>
            </div>
        </div>
    </>
}
