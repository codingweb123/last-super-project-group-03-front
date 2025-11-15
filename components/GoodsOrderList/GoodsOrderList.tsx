'use client'

import { useBasketStore } from '@/lib/stores/basketStore';
import css from './GoodsOrderList.module.css';
import Image from 'next/image';
import { useState } from 'react';

export default function GoodsOrderList() {
	const basket = useBasketStore(state => state.basket);
	const setBasket = useBasketStore(state => state.setBasket);

	const [quantity, setQuantity] = useState<{ [key: string]: number }>(() => {
		const initialQuantity: { [key: string]: number } = {};
		basket.forEach(good => {
			initialQuantity[good._id] = 1;
		});
		return initialQuantity;
	});

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const id = event.target.name;
		const value = Number(event.target.value);
		setQuantity((good) => ({ ...good, [id]: Math.max(1, value) }))
	};

	const handleRemoveGood = (id: string) => {
		setBasket(basket.filter(good => good._id !== id));
	}
	
	const totalSum = basket.reduce((acc, good) => acc + good.price * (quantity[good._id] || 1), 0);

	return <>
		<ul className={css.goodsList}>
			{basket.map((good)=>
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
										<p className={css.stars}>{good.rating}</p>
									</div>
									<div className={css.reviewBox}>
										<svg width={16} height={16}>
											<use href='/icons.svg#i-comment'></use>
										</svg>
										<p className={css.comments}>{good.reviews}</p>
									</div>
								</div>
							</div>
							<p className={css.price}>{good.price} грн</p>
						</div>
						<div className={css.goodNav}>
							<input
								className={css.quantity}
								type="number"
								min={1}
								name={good._id}
								value={quantity[good._id] || 1}
								onChange={(e) => handleChange(e)} />
							<button className={css.trashBtn} onClick={()=>handleRemoveGood(good._id)}>
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
