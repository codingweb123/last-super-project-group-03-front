import CategoriesList from "../CategoriesList/CategoriesList"
import css from "./PopularCategories.module.css"
import Link from "next/link"

export default function PopularCategories() {
	return (
		<section className={`section ${css.popularCategories}`}>
			<div>
				<div className={ css.containerHeader }>
					<h2 className={css.sectionTitle}>Популярні категорії</h2>
				<Link href='/categories' className={css.link}>
					<button className={css.buttonAllCat}>Всі категорії </button>
				</Link>
				</div>
				<CategoriesList variant="slider" />
				</div>
		</section>
	)
}
