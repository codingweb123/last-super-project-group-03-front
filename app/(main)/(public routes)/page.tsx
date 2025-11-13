import Hero from "@/components/Hero/Hero"
import LastReviews from "@/components/LastReviews/LastReviews"
import PopularCategories from "@/components/PopularCategories/PopularCategories"
import PopularGoods from "@/components/PopularGoods/PopularGoods"
import Style from "@/components/Style/Style"

export default function HomePage() {
	return (
		<>
			<Hero />
			<Style />
			<PopularCategories />
			<PopularGoods />
			<LastReviews />
		</>
	)
}
