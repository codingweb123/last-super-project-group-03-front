import Link from "next/link"
import { Routes } from "@/config/config"
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query"
import { getGoods } from "@/lib/api/clientApi"
import css from "./PopularGoods.module.css"
import PopularGoodsClient from "./PopularGoods.client"

export default async function PopularGoods() {
	const queryClient = new QueryClient()
	await queryClient.prefetchQuery({
		queryKey: ["popularGoods", { page: 1 }],
		queryFn: () => getGoods({}),
		staleTime: 15 * 60 * 1000,
	})

	return (
		<section className={`section ${css.popularGoods}`} id="goods">
			<div className={`container ${css.container}`}>
				<ul className={css.info}>
					<li>
						<h2>Популярні товари</h2>
					</li>
					<li>
						<Link href={Routes.Goods} className={css.button}>
							Всі товари
						</Link>
					</li>
				</ul>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<PopularGoodsClient />
				</HydrationBoundary>
			</div>
		</section>
	)
}
