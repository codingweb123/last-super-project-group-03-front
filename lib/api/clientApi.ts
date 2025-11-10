import { nextServer } from "./api";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import { Categories } from "@/types/category";
import { FeedbackRequest } from "@/types/feedback";
import { Cloth } from "@/types/shop";
import { OrderUserData, User } from "@/types/user";

type GetGoods = Partial<{
	category: string
	sizes: string
	price: number
	color: string
	sex: string
	page: number
	perPage: number
}>

export async function getGoods({
	category,
	sizes,
	price,
	color,
	sex,
	page,
	perPage,
}: GetGoods) {
	const { data } = await nextServer.get<Cloth>(`/goods`, {
		params: {
			...(category && { category }),
			...(sizes && { sizes }),
			...(price && { price }),
			...(color && { color }),
			...(sex && { sex }),
			...(page && { page }),
			...(perPage && { perPage }),
		},
	})
	return data
}

export async function getSingleGood(id: string) {
	const { data } = await nextServer.get<Cloth>(`/goods/${id}`)
	return data
}

export async function getCategories() {
	const { data } = await nextServer.get<Categories>("/categories")
	return data
}

export async function login(userData: LoginRequest) {
	const { data } = await nextServer.post<User>("/auth/login", userData)
	return data
}

export async function register(userData: RegisterRequest) {
	const { data } = await nextServer.post<User>("/auth/register", userData)
	return data
}

export async function checkSession() {
	const { data } = await nextServer.get<{ success: boolean }>("/auth/session")
	return data.success
}

export async function getMe() {
	const { data } = await nextServer.get<User>("/users/me")
	return data
}

export async function editMe(userData: OrderUserData) {
	const { data } = await nextServer.patch<User>("/users/me", userData)
	return data
}

export async function createGoodReview(id: string, reviewData: FeedbackRequest) {
	const { data } = await nextServer.patch(`/goods/${id}/review`, reviewData)
	return data
}

export async function logout() {
	await nextServer.post("/auth/logout")
}
