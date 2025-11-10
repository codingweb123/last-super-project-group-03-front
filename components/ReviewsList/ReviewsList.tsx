"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
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
const PER_PAGE = 6;

async function fetchPage<T>(
  page: number,
  perPage = PER_PAGE
): Promise<ApiResponse<T>> {
  const res = await fetch(`${ENDPOINT}?page=${page}&perPage=${perPage}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchAllFeedbacks(): Promise<Feedback[]> {
  const first = await fetchPage<ApiFeedback>(1);

  const totalPages = Math.max(1, Number(first.totalPages ?? 1));
  const chunks = [first.feedbacks];

  if (totalPages > 1) {
    const promises: Promise<ApiResponse<ApiFeedback>>[] = [];
    for (let p = 2; p <= totalPages; p++) {
      promises.push(fetchPage<ApiFeedback>(p));
    }
    const rest = await Promise.all(promises);
    for (const r of rest) chunks.push(r.feedbacks);
  }

  const all = chunks.flat();

  all.sort((a, b) => {
    const ta = Date.parse(a.updatedAt || a.createdAt || a.date || "") || 0;
    const tb = Date.parse(b.updatedAt || b.createdAt || b.date || "") || 0;
    return tb - ta;
  });

  return all;
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
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["feedbacks", "all"],
    queryFn: fetchAllFeedbacks,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isLoading)
      toast.loading("Завантаження відгуків...", { id: "feedbacks" });
    if (isSuccess)
      toast.success("Відгуки успішно завантажені ✅", { id: "feedbacks" });
    if (isError)
      toast.error("Помилка завантаження відгуків ❌", { id: "feedbacks" });
  }, [isLoading, isError, isSuccess]);

  const feedbacks = data ?? [];

  const [visibleCount, setVisibleCount] = useState(3);
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [step, setStep] = useState(1);

  const visibleReviews = feedbacks.slice(0, visibleCount);

  const slidesPerViewOf = (sw: SwiperInstance | null) => {
    if (!sw) return 1;
    const spv = sw.params.slidesPerView;
    return typeof spv === "number" ? spv : 1;
  };
  const syncStepFrom = (sw: SwiperInstance | null) =>
    setStep(slidesPerViewOf(sw));

  const canPrev = activeIndex > 0;
  const hasMoreWithinRendered = activeIndex + step < visibleCount;
  const canAddMore = visibleCount < feedbacks.length;

  useEffect(() => {
    setVisibleCount((v) => Math.max(step, v));
  }, [step]);

  useEffect(() => {
    if (!swiper) return;
    const target = Math.max(
      0,
      Math.min(visibleCount - 1, feedbacks.length - 1)
    );
    swiper.slideTo(target);
  }, [visibleCount, swiper, feedbacks.length]);

  const handleSlideChange = (sw: SwiperInstance) =>
    setActiveIndex(sw.activeIndex);
  const handlePrev = () => swiper?.slideTo(Math.max(0, activeIndex - step));
  const handleNext = () => {
    if (hasMoreWithinRendered && swiper) {
      swiper.slideTo(Math.min(visibleCount - 1, activeIndex + step));
      return;
    }
    if (canAddMore)
      setVisibleCount((v) => Math.min(v + step, feedbacks.length));
  };

  if (isLoading) return <p className={css.text}>Завантаження...</p>;
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
          className={`${css.btnNext} ${!(hasMoreWithinRendered || canAddMore) ? css.btnDisabled : ""}`}
          aria-label="Наступні"
          onClick={handleNext}
          disabled={!(hasMoreWithinRendered || canAddMore)}
        >
          <svg className={`${css.arrow} ${css.arrowRight}`} aria-hidden="true">
            <use href="/icons.svg#i-arrow" />
          </svg>
        </button>
      </div>
    </div>
  );
}
