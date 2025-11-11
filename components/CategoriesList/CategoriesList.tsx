'use client'
import css from "./CategoriesList.module.css"
import { useEffect, useRef, useState } from 'react'
import Image from "next/image"
import { Category,CategoriesListProps} from "@/types/shop"
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper/types'
import { Keyboard } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { fetchCategories } from "@/lib/api/api"
import Link from "next/link"




export default function CategoriesList({
  variant = 'list',
  showMoreButton = false,
  initialCount = 6,
  loadMoreStep = 6,
}: CategoriesListProps) {


  const [categories, setCategories] = useState<Category[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [visibleCount, setVisibleCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)
  const swiperRef = useRef<SwiperType | null>(null)



	useEffect(() => {
    const init = async () => {
        setLoading(true)
      try {
        const res = await fetchCategories(1, Math.max(initialCount, loadMoreStep))
        setCategories(res.categories || [])
        setTotal(res.totalCategories ?? (res.categories?.length ?? 0))
        setPage(1)
        setVisibleCount(initialCount)
      } finally {
        setLoading(false)
      }
    }
    init()
	},[]);

	const loadMore = async () => {
    if (loading) return
    if (categories.length >= total) return

    setLoading(true)
    try {
      const nextPage = page + 1
      const res = await fetchCategories(nextPage, loadMoreStep)
      setCategories(prev => [...prev, ...(res.categories || [])])
      setTotal(res.totalCategories ?? total)
      setPage(nextPage)
    } finally {
      setLoading(false)
    }
  }

  if (loading && categories.length === 0) return <p>Завантаження…</p>

  if (variant === 'slider') {
  const handleNext = async () => {

    if (isEnd && categories.length < total) {
      await loadMore()
      requestAnimationFrame(() => {
        swiperRef.current?.update()
        swiperRef.current?.slideNext()
      })
    } else {
      swiperRef.current?.slideNext()
    }
  }

  const handlePrev = () => swiperRef.current?.slidePrev()

  const canGoPrev = !isBeginning
  const canGoNext = !(isEnd && categories.length >= total)

  if (!categories.length) return <p>Немає категорій</p>

  return (
    <div className={css.containerSwipper}>
      <button
        className={`${ css.button} ${css.prevButton}`}
        type="button"
        onClick={handlePrev}
        disabled={!canGoPrev}
        aria-label="Попередні"
      >
        <svg className={css.icons} width={24} height={24} aria-hidden="true">
          <use href="/icons.svg#i-arrow"/>
       </svg>
      </button>

      <Swiper
       onSwiper={(sw) => {
          swiperRef.current = sw
          setIsBeginning(sw.isBeginning)
          setIsEnd(sw.isEnd)
        }}
        onSlideChange={(sw) => {
          setIsBeginning(sw.isBeginning)
          setIsEnd(sw.isEnd)
        }}
        onReachEnd={async () => {
          if (categories.length < total) {
            await loadMore()
            requestAnimationFrame(() => swiperRef.current?.update())
          }
        }}
        modules={[Keyboard]}
        keyboard={{ enabled: true }}
        slidesPerView={1}
        spaceBetween={32}
        breakpoints={{
    768:  { slidesPerView: 2, spaceBetween: 24 },
    1440: { slidesPerView: 3, spaceBetween: 32 },
  }}
      >
        {categories.map((cat) => (
          <SwiperSlide key={cat._id}>
             <Link href={'/goods'}>
            <div>
              <div>
                <Image className={css.image} src={cat.image} alt={cat.name} width={416} height={277} />
              </div>
             <p className={css.title}>{cat.name}</p>
              </div>
              </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        className={`${ css.button } ${css.nextButton}`}
        type="button"
        onClick={handleNext}
        disabled={!canGoNext}
        aria-label="Наступні"
      >
       <svg className={css.icons}  width={24} height={24} aria-hidden="true">
          <use href="/icons.svg#i-arrow" transform="rotate(180 12 12)"/>
       </svg>
      </button>
    </div>
  )
}

    const handleShowMore = async () => {
    const nextVisible = visibleCount + loadMoreStep
  
    if (nextVisible > categories.length && categories.length < total) {
      await loadMore()
    }

    setVisibleCount(v => Math.min(nextVisible, total))
  }

  if (!categories.length) return <p>Немає категорій</p>

  return (
    <div className={css.container}>
      <ul className={css.list}>
        {categories.slice(0, visibleCount).map(cat => (
          <Link href={'/goods'} key={cat._id}>
          <li>
            <div>
              <Image src={cat.image} alt={cat.name} width={416} height={277} className={css.image}  />
            </div>
            <p className={css.title}>{cat.name}</p>
            </li> 
          </Link>  
        ))}
      </ul>

      {showMoreButton && visibleCount < total && (
        <button onClick={handleShowMore} disabled={loading} className={css.showMoreBtn}>
          {loading ? 'Завантаження…' : 'Показати більше'}
        </button>
      )}
    </div>
  )
}