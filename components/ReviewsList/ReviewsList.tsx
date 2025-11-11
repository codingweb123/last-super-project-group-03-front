"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, A11y } from "swiper/modules";
import "swiper/css";
import css from "./ReviewsList.module.css";
import type { Swiper as SwiperInstance } from "swiper";

interface ApiFeedback {
  _id: string;
  author: string;
  date: string;
  description: string;
  rate: number;
  goodId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  page: number;
  perPage: number;
  totalFeedbacks: number;
  totalPages: number;
  feedbacks: T[];
}

type Feedback = ApiFeedback;

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://last-super-project-group-03-back.onrender.com";
const ENDPOINT = `${API_BASE}/api/feedbacks`;

const PER_PAGE = 3;

async function fetchPage<T>(
  page: number,
  perPage: number = PER_PAGE
): Promise<ApiResponse<T>> {
  const res = await fetch(`${ENDPOINT}?page=${page}&perPage=${perPage}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function StarRating({ value = 0, max = 5 }: { value?: number; max?: number }) {
  const safe = Math.max(0, Math.min(max, Number(value) || 0));
  const full = Math.floor(safe);
  const half = safe - full >= 0.5;

  return (
    <div className={css.stars} aria-label={`Рейтинг: ${safe} з ${max}`}>
      {Array.from({ length: max }).map((_, i) => {
        let icon = "i-star";
        if (i < full) icon = "i-star-filled";
        else if (i === full && half) icon = "i-star-half";
        return (
          <svg key={i} className={css.starIcon} aria-hidden="true">
            <use href={`/icons.svg#${icon}`} />
          </svg>
        );
      })}
    </div>
  );
}

function ReviewCard({ item }: { item: Feedback }) {
  return (
    <>
      <StarRating value={item.rate} />
      <p className={css.text}>{item.description}</p>
      <div className={css.meta}>
        <span className={css.author}>{item.author}</span>
        <a
          href={`/product/${item.goodId}`}
          className={css.good}
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.goodId}
        </a>
      </div>
    </>
  );
}

export default function ReviewsList() {
  const {
    data: firstPage,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["feedbacks", "page-1", PER_PAGE],
    queryFn: () => fetchPage<ApiFeedback>(1, PER_PAGE),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  useEffect(() => {
    if (isLoading)
      toast.loading("Завантаження відгуків...", { id: "feedbacks" });
    if (isSuccess)
      toast.success("Відгуки успішно завантажені ✅", { id: "feedbacks" });
    if (isError)
      toast.error("Помилка завантаження відгуків ❌", { id: "feedbacks" });
  }, [isLoading, isError, isSuccess]);

  const [pages, setPages] = useState<Feedback[][]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    if (!firstPage) return;
    setPages([[...firstPage.feedbacks]]);
    setPage(1);
    setTotalPages(firstPage.totalPages ?? 1);
  }, [firstPage]);

  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [step, setStep] = useState(1);

  const visibleReviews = pages.flat();

  const slidesPerViewOf = (sw: SwiperInstance | null) => {
    if (!sw) return 1;
    const spv = sw.params.slidesPerView;
    return typeof spv === "number" ? spv : 1;
  };
  const syncStepFrom = (sw: SwiperInstance | null) =>
    setStep(slidesPerViewOf(sw));

  const canPrev = activeIndex > 0;
  const hasMoreWithinLoaded = activeIndex + step < visibleReviews.length;
  const hasMorePages = page < totalPages;
  const disableNext = !(hasMoreWithinLoaded || hasMorePages) || isFetchingMore;

  const handleSlideChange = (sw: SwiperInstance) =>
    setActiveIndex(sw.activeIndex);

  const handlePrev = () => {
    if (!swiper) return;
    swiper.slideTo(Math.max(0, activeIndex - step));
  };

  const handleNext = async () => {
    if (!swiper) return;

    if (hasMoreWithinLoaded) {
      swiper.slideTo(Math.min(visibleReviews.length - 1, activeIndex + step));
      return;
    }

    if (hasMorePages && !isFetchingMore) {
      try {
        setIsFetchingMore(true);
        const next = page + 1;
        const resp = await fetchPage<ApiFeedback>(next, PER_PAGE);

        setPages((prev) => [...prev, resp.feedbacks]);
        setPage(next);
        setTotalPages(resp.totalPages ?? next);

        const oldCount = visibleReviews.length;
        setTimeout(() => swiper.slideTo(oldCount), 0);
      } catch {
        toast.error("Не вдалося завантажити ще відгуки");
      } finally {
        setIsFetchingMore(false);
      }
    }
  };

  if (isLoading || !firstPage)
    return <p className={css.text}>Завантаження...</p>;
  if (isError)
    return <p className={css.text}>Помилка: {(error as Error)?.message}</p>;

  return (
    <div>
      <Swiper
        modules={[Keyboard, A11y]}
        onSwiper={(sw) => {
          setSwiper(sw);
          syncStepFrom(sw);
        }}
        onBreakpoint={(sw) => syncStepFrom(sw)}
        onResize={(sw) => syncStepFrom(sw)}
        onSlideChange={handleSlideChange}
        keyboard={{ enabled: true, onlyInViewport: true }}
        a11y={{ enabled: true }}
        spaceBetween={32}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2, spaceBetween: 32 },
          1440: { slidesPerView: 3, spaceBetween: 32 },
        }}
        watchOverflow
        className={css.swiper}
        tag="ul"
      >
        {visibleReviews.map((item) => (
          <SwiperSlide key={item._id} className={css.item} tag="li">
            <ReviewCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={css.nav}>
        <button
          type="button"
          className={`${css.btnPrev} ${!canPrev ? css.btnDisabled : ""}`}
          aria-label="Попередні"
          onClick={handlePrev}
          disabled={!canPrev}
        >
          <svg className={css.arrow} aria-hidden="true">
            <use href="/icons.svg#i-arrow" />
          </svg>
        </button>

        <button
          type="button"
          className={`${css.btnNext} ${disableNext ? css.btnDisabled : ""}`}
          aria-label="Наступні"
          onClick={handleNext}
          disabled={disableNext}
        >
          <svg className={`${css.arrow} ${css.arrowRight}`} aria-hidden="true">
            <use href="/icons.svg#i-arrow" />
          </svg>
        </button>
      </div>
    </div>
  );
}
