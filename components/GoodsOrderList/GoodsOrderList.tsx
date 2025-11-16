'use client'

import { useBasketStore } from '@/lib/stores/basketStore';
import css from './GoodsOrderList.module.css';
import Image from 'next/image';
import { useQueries } from '@tanstack/react-query';
import {getSingleGood} from '@/lib/api/clientApi';

export default function GoodsOrderList({ isModal }: { isModal?: boolean }) {
	const basket = useBasketStore(state => state.basket)
	const setBasket = useBasketStore(state => state.setBasket)

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

		newBasket[index] = {
			...newBasket[index],
			amount: value,
		}

		setBasket(newBasket)
	}

	const removeFromBasket = (index: number) => {
		const newBasket = basket.filter((_, sid) => sid != index)
		setBasket(newBasket)
	}

	return (
		goods && (
			<>
				<ul className={isModal ? css.modal : ""}>
					{goods.map(
						({ data: good }, index) =>
							good && (
								<li key={good._id} className={css.good}>
									<Image
										src={good.image}
										width={82}
										height={101}
										className={css.image}
										alt={good.name}
									/>
									<div
										aria-label="Cloth from basket information"
										className={css.goodInfo}>
										<h3 className={css.name}>
											{good.name}
											<p>
												<svg className="icon" width={16} height={16}>
													<use href="/icons.svg#i-star-filled"></use>
												</svg>
												{good.stars}
												<span>
													<svg className="icon" width={16} height={16}>
														<use href="/icons.svg#i-comment"></use>
													</svg>
													{good.feedbacks.length}
												</span>
											</p>
										</h3>
										<div className={css.priceAmountDelete}>
											<p>{good.price.value} грн</p>
											<input
												type="number"
												min={1}
												max={99}
												onChange={e => changeBasketAmount(e, index)}
												value={basket[index].amount}
											/>
											<button
												type="button"
												onClick={() => removeFromBasket(index)}>
												<svg className="icon" width={24} height={24}>
													<use href="/icons.svg#i-trash"></use>
												</svg>
											</button>
										</div>
									</div>
								</li>
							)
					)}
				</ul>
				<hr className={css.hr} />
				<p className={css.sumBefore}>
					Проміжний підсумок
					<span>{sum} грн</span>
				</p>
				<p className={css.delivery}>Доставка</p>
				<p className={css.sum}>
					Всього
					<span>{sum} грн</span>
				</p>
			</>
		)
	)
}
