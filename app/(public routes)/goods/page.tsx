"use client"

import { useState, useEffect } from "react"
import { CategoriesFilter } from "@/components/CategoriesFilter/CategoriesFilter"
import  GoodsList  from "@/components/GoodsList/GoodsList"
import MessageNoInfo from "@/components/MessageNoInfo/MessageNoInfo"
import css from "./GoodsPage.module.css"
import { nextServer } from "@/lib/api/api"

interface Good {
  id: string
  name: string
  price: number
  category: string
  image: string
  likes: number
  reviews: number
}
export interface CategoriesFilterProps {
  onSelectCategory: (category: string) => void
}

const GoodsPage = () => {
  const [goods, setGoods] = useState<Good[]>([])
  const [visibleGoodsCount, setVisibleGoodsCount] = useState(12)
  const [selectedCategory, setSelectedCategory] = useState<string>("Всі товари")
  const [allGoodsLoaded, setAllGoodsLoaded] = useState(false)
  const [loading, setLoading] = useState(false)

  // Встановлюємо стартову кількість товарів залежно від ширини екрану
  useEffect(() => {
    const setInitialCount = () => {
      const width = window.innerWidth
      if (width < 768) {
        setVisibleGoodsCount(8) // моб/планшет
      } else {
        setVisibleGoodsCount(12) // десктоп
      }
    }
    setInitialCount()
    window.addEventListener("resize", setInitialCount)
    return () => window.removeEventListener("resize", setInitialCount)
  }, [])

   useEffect(() => {
  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await nextServer.get<Good[]>("/goods", {
        params: { category: selectedCategory === "Всі товари" ? undefined : selectedCategory },
      })
      setGoods(res.data)
      setAllGoodsLoaded(res.data.length <= visibleGoodsCount)
    } catch (err) {
      console.error(err)
      setGoods([])
    } finally {
      setLoading(false)
    }
  }
  fetchData()
}, [selectedCategory, visibleGoodsCount])

  const handleShowMore = () => {
    const newCount = visibleGoodsCount + 3
    if (newCount >= goods.length) {
      setVisibleGoodsCount(goods.length)
      setAllGoodsLoaded(true)
    } else {
      setVisibleGoodsCount(newCount)
    }
  }

  return (
    <div className={css.container}>
      <h1 className={css.title}>{selectedCategory}</h1>
      <div className={css.content}>
        <div className={css.filter}>
          <CategoriesFilter onSelectCategory={(category: string) => setSelectedCategory(category)} />
        </div>
        <div className={css.goodsList}>
          {loading ? (
            <p>Завантаження...</p>
          ) : goods.length === 0 ? (
           <MessageNoInfo text="За вашим запитом не знайдено жодних товарів, спробуйте змінити фільтри, або скинути їх" buttonText="" onClick={() => {}} />
          ) : (
            <>
              <GoodsList goods={goods.slice(0, visibleGoodsCount)} />
              {!allGoodsLoaded && (
                <button className={css.showMoreBtn} type="button" onClick={handleShowMore}>
                  Показати більше
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default GoodsPage;