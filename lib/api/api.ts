import axios from "axios"
import type { CategoriesResponse} from "@/types/shop"

export const getBaseURL = () => {
	return process.env.NODE_ENV === "development"
		? "http://localhost:3000"
		: process.env.NEXT_PUBLIC_API_URL
}

export const nextServer = axios.create({
	baseURL: getBaseURL() + '/api',
	withCredentials: true,
})

export async function fetchCategories(page = 1,perPage = 6):Promise<CategoriesResponse> {
	try {
		const { data } = await axios.get<CategoriesResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
			{params:{page,perPage}}
		)
		return data 
	} catch (error) {
		console.error('Сталася помилка при завантаженні категорій:', error)

		return {
			categories: [],
			page: 1, perPage,
			totalCategories: 0,
			totalPages: 0
		}
	}
}