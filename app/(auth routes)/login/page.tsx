"use client"

import AuthNavigation from "@/components/AuthNavigation/AuthNavigation"
import { Routes } from "@/config/config"
import { Formik, Form, FormikHelpers, Field, ErrorMessage } from "formik"
import { useState } from "react"
import { login, LoginRequest } from "@/lib/api/clientApi"
import { useMutation } from "@tanstack/react-query"
import { useAuthStore } from "@/lib/stores/authStore"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import * as Yup from "yup"
import css from "../AuthPages.module.css"

const initialValues: LoginRequest = {
	phone: "",
	password: "",
}

const validationSchema = Yup.object().shape({
	phone: Yup.string().length(19).required(),
	password: Yup.string().min(8).max(64).required(),
})

export default function LoginPage() {
	const setUser = useAuthStore(state => state.setUser)
	const router = useRouter()

	const { mutate } = useMutation({
		mutationFn: async (values: LoginRequest) => {
			const user = await login(values)
			if (user) {
				setUser(user)
			}
			return user
		},
		onSuccess: () => {
			toast.success("You successfully logged in!")
			router.push(Routes.Home)
		},
		onError: () => toast.error("Invalid credentials"),
	})

	const onSubmit = async (
		values: LoginRequest,
		helpers: FormikHelpers<LoginRequest>
	) => {
		values.phone = values.phone
			.replace(" (", "")
			.replace(") ", "")
			.replaceAll("-", "")
		mutate(values)
		helpers.resetForm()
	}

	const formatPhone = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const value = e.currentTarget.value
		const digits = value.replace(/\D/g, "")
		const match = digits.match(/(\d{0,2}0)(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/)

		let newValue = "+38 (0"

		if (!match) {
			e.currentTarget.value = newValue
			return
		}

		if (match[2]) newValue += `${match[2]}`
		if (match[3]) newValue += `) ${match[3]}`
		if (match[4]) newValue += `-${match[4]}`
		if (match[5]) newValue += `-${match[5]}`

		e.currentTarget.value = newValue
	}

	return (
		<section className={`section ${css.auth}`}>
			<div className="container">
				<Formik
					initialValues={initialValues}
					onSubmit={onSubmit}
					validationSchema={validationSchema}>
					<Form className={css.form}>
						<AuthNavigation route={Routes.Login} />
						<h1>Вхід</h1>
						<label htmlFor="phone">
							Номер телефону*
							<Field
								type="text"
								name="phone"
								id="phone"
								onInput={formatPhone}
								placeholder="+38 (0__) ___-__-__"
							/>
							<ErrorMessage
								name="phone"
								component="span"
								className={css.error}
							/>
						</label>
						<label htmlFor="password">
							Пароль*
							<Field
								type="text"
								name="password"
								id="password"
								placeholder="********"
							/>
							<ErrorMessage
								name="password"
								component="span"
								className={css.error}
							/>
						</label>
						<button type="submit">Увійти</button>
					</Form>
				</Formik>
			</div>
		</section>
	)
}
