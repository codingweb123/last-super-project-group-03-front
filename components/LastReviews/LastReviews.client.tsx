"use client"

import { getFeedbacks } from "@/lib/api/clientApi"
import ReviewsList from "../ReviewsList/ReviewsList"
import css from "./LastReviews.module.css"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Feedback } from "@/types/shop"

export default function LastReviewsClient() {
	const [totalPages, setTotalPages] = useState<number>(2)
	const [page, setPage] = useState<number>(1)
	const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
	const [isNewPortion, setIsNewPortion] = useState<boolean>(true)

	const { data } = useQuery({
		queryKey: ["lastFeedbacks", { page }],
		queryFn: () => getFeedbacks({ page }),
		staleTime: 15 * 60 * 1000,
		refetchOnMount: false,
		enabled: isNewPortion,
	})

	useEffect(() => {
		const setNewFeedbacks = () => {
			if (data && isNewPortion) {
				setTotalPages(data.totalPages)
				setIsNewPortion(false)
				if (page === 1) {
					setFeedbacks(data.feedbacks)
				} else {
					setFeedbacks(previous => [...previous, ...data.feedbacks])
				}
			}
		}
		setNewFeedbacks()
	}, [isNewPortion, data, page])

	const loadMore = () => {
		if (totalPages <= page) {
			return
		}

		setPage(page + 1)
		setIsNewPortion(true)
	}

	return (
		feedbacks && (
			<>
				<ReviewsList
					feedbacks={feedbacks}
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
