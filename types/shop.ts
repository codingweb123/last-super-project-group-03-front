export type Cloth = {
	name: string
	price: number
	rating: number
	reviews: number
}
export type Category = {
	_id:string
	name: string
	image: string
	href?:string
}
export type CategoriesListProps = {
	variant?:'list'|'slider'
	showMoreButton?: boolean
	initialCount:number
	items?: Category[]
	loadMoreStep?:number
}
export type CategoriesResponse = {
	categories: Category[]
	page: number
	perPage: number
	totalCategories: number
	totalPages:number
}