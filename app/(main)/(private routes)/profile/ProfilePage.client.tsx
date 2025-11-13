"use client"

import css from "./ProfilePage.module.css"

import { useRouter } from "next/navigation"

import MessageNoInfo from "@/components/MessageNoInfo/MessageNoInfo"
import UserInfoForm from "@/components/UserInfoForm/UserInfoForm"
import { Routes } from "@/config/config"
import { Order } from "@/types/shop"
import toast from "react-hot-toast"
import { logout } from "@/lib/api/clientApi"
import { useAuthStore } from "@/lib/stores/authStore"

interface Props {
	ordersList: Order[]
}

export default function ProfileClient({ ordersList }: Props) {
	const router = useRouter()
	const clearIsAuthenticated = useAuthStore(state => state.clearIsAuthenticated)

	const onLogout = async () => {
		try {
			await logout()
			clearIsAuthenticated()
			toast.success("Successfully logged out")
			router.push(Routes.Home)
		} catch {
			toast.error("Error while logging out...")
		}
	}

	return (
		<div className="container">
			<h1 className={css.h1}>Кабінет</h1>
			<div className={css.cabinetContainer}>
				<div className={css.infoContainer}>
					<h2 className={css.h2}>Особиста інформація</h2>
					<UserInfoForm />
				</div>
				<div className={css.ordersContainer}>
					<h2 className={`${css.h2} ${css.ordersTitle}`}>Мої замовлення</h2>
					{ordersList.length ? (
						<div className={css.orders}>
							<ul>
								{ordersList.map(({ date, orderNum }) => (
									<li className={css.order} key={orderNum}>
										<p className={css.date}>{date}</p>
										<p className={css.orderNum}>№{orderNum}</p>
									</li>
								))}
							</ul>
							<ul>
								{ordersList.map(({ orderNum, sum }) => (
									<li className={css.order} key={orderNum}>
										<p>Сума:</p>
										<p className={css.sum}>{sum} грн</p>
									</li>
								))}
							</ul>
							<ul className={css.statusGroup}>
								{ordersList.map(({ orderNum, status }) => {
									let ukrStatus:
										| "У процесі"
										| "Комплектується"
										| "Виконано"
										| "Скасовано"
									switch (status) {
										case "processing":
											ukrStatus = "У процесі"
											break
										case "packing":
											ukrStatus = "Комплектується"
											break
										case "success":
											ukrStatus = "Виконано"
											break
										default:
											ukrStatus = "Скасовано"
									}
									return (
										<li className={css.order} key={orderNum}>
											<p>Статус:</p>
											<p className={css.status}>{ukrStatus}</p>
										</li>
									)
								})}
							</ul>
						</div>
					) : (
						<MessageNoInfo
							text="У вас ще не було жодних замовлень! Мершій до покупок!"
							buttonText="До покупок"
							onClick={() => router.push(Routes.Goods)}
						/>
					)}
				</div>
			</div>
			<button onClick={onLogout} className={css.logout} type="button">
				Вийти з кабінету
			</button>
		</div>
	)
}
