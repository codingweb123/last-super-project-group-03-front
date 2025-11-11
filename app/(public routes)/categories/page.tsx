import CategoriesList from "@/components/CategoriesList/CategoriesList"
import css from "./CategoriesPage.module.css"

export default function CategoriesPage() {
	return (
		<section className={css.pageCategories}>
			<div className={css.container}>
		<h1 className={css.title}>Категорії</h1>
		<CategoriesList variant="list" showMoreButton/>
	</div>
		</section>
		)
}
