"use client"

import { getCategories } from "@/lib/api/clientApi"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Category } from "@/types/shop"
import CategoriesList from "../CategoriesList/CategoriesList"
import css from "./PopularCategories.module.css"

export default function PopularCategoriesClient() {
	const [page, setPage] = useState<number>(1)
	const [totalPages, setTotalPages] = useState<number>(2)
	const [categories, setCategories] = useState<Category[]>([])
	const [isNewPortion, setIsNewPortion] = useState<boolean>(true)

	const { data } = useQuery({
		queryKey: ["popularCategories", { page }],
		queryFn: () => getCategories({ page }),
		staleTime: 15 * 60 * 1000,
		refetchOnMount: false,
		enabled: isNewPortion,
	})

	useEffect(() => {
		const setNewCategories = () => {
			if (data && isNewPortion) {
				setTotalPages(data.totalPages)
				setIsNewPortion(false)
				if (page === 1) {
					setCategories(data.categories)
				} else {
					setCategories(previous => [...previous, ...data.categories])
				}
			}
		}
		setNewCategories()
	}, [isNewPortion, data, page])

	const loadMore = () => {
		if (totalPages <= page) {
			return
		}

		setPage(page + 1)
		setIsNewPortion(true)
	}

	return (
		categories && (
			<>
				<CategoriesList
					prefix="_popular"
					isSwiper={true}
					categories={categories}
					leftBtnClass={css.leftBtn}
					rightBtnClass={css.rightBtn}
				/>
				<ul className={css.navBtns}>
					<li>
						<button
							type="button"
							className={`${css.navBtn} ${css.leftBtn}`}
							aria-label="Navigate previous slide">
							<svg className="icon" width={24} height={24}>
								<use href="/icons.svg#i-arrow"></use>
							</svg>
						</button>
					</li>
					<li>
						<button
							type="button"
							className={`${css.navBtn} ${css.rightBtn}`}
							onClick={loadMore}
							aria-label="Navigate next slide">
							<svg className="icon" width={24} height={24}>
								<use href="/icons.svg#i-arrow"></use>
							</svg>
						</button>
					</li>
				</ul>
			</>
		)
	)
}
