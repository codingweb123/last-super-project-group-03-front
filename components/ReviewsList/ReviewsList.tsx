"use client";

import css from "./ReviewsList.module.css";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, A11y } from "swiper/modules";
import "swiper/css";
import type { Swiper as SwiperInstance } from "swiper";

/* -------------------- TYPES -------------------- */
type ApiFeedback = {
  _id: string;
  author: string;
  date: string;
  description: string;
  rate: number;
  goodId: string | { _id: string; name?: string };
  createdAt?: string;
  updatedAt?: string;
};
type ApiResponse = {
  page: number;
  perPage: number;
  totalFeedbacks: number;
  totalPages: number;
  feedbacks: ApiFeedback[];
};
type Feedback = {
  _id: string;
  author: string;
  date: string;
  description: string;
  rate: number;
  goodId: string;
  goodName: string;
  createdAt?: string;
  updatedAt?: string;
};

/* -------------------- CONFIG -------------------- */
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://last-super-project-group-03-back.onrender.com";
const ENDPOINT = `${API_BASE}/api/feedbacks`;
const PER_PAGE = 6;
const PAGE_CHUNK = 3;

/* -------------------- HELPERS -------------------- */
function normalizeFeedback(item: ApiFeedback): Feedback {
  if (typeof item.goodId === "string") {
    return {
      _id: item._id,
      author: item.author,
      date: item.date,
      description: item.description,
      rate: Number(item.rate) || 0,
      goodId: item.goodId,
      goodName: item.goodId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
  const g = item.goodId || ({} as any);
  const gid = String(g._id ?? "");
  const gname = String(g.name ?? (gid || "товар"));
  return {
    _id: item._id,
    author: item.author,
    date: item.date,
    description: item.description,
    rate: Number(item.rate) || 0,
    goodId: gid,
    goodName: gname,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

// updatedAt → createdAt → date (DESC)
function toTime(x: Pick<Feedback, "updatedAt" | "createdAt" | "date">): number {
  const tryParse = (v?: string) => (v ? Date.parse(v) : NaN);
  const t = tryParse(x.updatedAt) ?? tryParse(x.createdAt) ?? tryParse(x.date);
  return Number.isFinite(t) ? (t as number) : 0;
}

async function fetchAllFeedbacks(): Promise<Feedback[]> {
  const firstRes = await fetch(`${ENDPOINT}?page=1&perPage=${PER_PAGE}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!firstRes.ok) throw new Error(`HTTP ${firstRes.status}`);
  const firstData: ApiResponse = await firstRes.json();

  const totalPages = Math.max(1, Number(firstData.totalPages ?? 1));
  const all: Feedback[] = (firstData.feedbacks ?? []).map(normalizeFeedback);

  for (let p = 2; p <= totalPages; p++) {
    const res = await fetch(`${ENDPOINT}?page=${p}&perPage=${PER_PAGE}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: ApiResponse = await res.json();
    all.push(...(data.feedbacks ?? []).map(normalizeFeedback));
  }

  all.sort((a, b) => toTime(b) - toTime(a));
  return all;
}

/* -------------------- SUBCOMPONENTS -------------------- */
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
          {item.goodName}
        </a>
      </div>
    </>
  );
}

/* -------------------- MAIN -------------------- */
export default function ReviewsList() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["feedbacks", "all", PER_PAGE],
    queryFn: fetchAllFeedbacks,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const feedbacks = data ?? [];

  // стартова кількість: 1/2/3
  const getInitialVisible = () => {
    if (typeof window === "undefined") return 1;
    const w = window.innerWidth;
    if (w >= 1440) return 3;
    if (w >= 768) return 2;
    return 1;
  };
  const [minBase] = useState<number>(getInitialVisible); // фіксуємо початкове значення
  const [visibleCount, setVisibleCount] = useState<number>(minBase);
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);

  const canGoPrev = visibleCount > minBase;
  const canGoNext = visibleCount < feedbacks.length;

  const handleNext = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_CHUNK, feedbacks.length));
  };
  const handlePrev = () => {
    setVisibleCount((prev) => Math.max(minBase, prev - PAGE_CHUNK));
  };

  // Після зміни visibleCount — прокрутити слайдер до останньої видимої картки
  useEffect(() => {
    if (!swiper) return;
    const target = Math.max(
      0,
      Math.min(visibleCount - 1, feedbacks.length - 1)
    );
    swiper.slideTo(target);
  }, [visibleCount, swiper, feedbacks.length]);

  return (
    <div>
      {isLoading && (
        <p className={css.text} style={{ opacity: 0.6 }}>
          Завантаження відгуків…
        </p>
      )}

      {isError && (
        <p className={css.text} style={{ color: "var(--color-error,#d33)" }}>
          Помилка: {(error as Error)?.message}
        </p>
      )}

      {!isLoading && !isError && feedbacks.length > 0 && (
        <>
          <Swiper
            modules={[Keyboard, A11y]}
            onSwiper={setSwiper}
            slidesPerView={1}
            spaceBetween={16}
            keyboard={{ enabled: true, onlyInViewport: true }}
            a11y={{ enabled: true }}
            watchOverflow={true}
            breakpoints={{
              768: { slidesPerView: 2, spaceBetween: 32 },
              1440: { slidesPerView: 3, spaceBetween: 32 },
            }}
            tag="ul"
            className={css.list}
          >
            {feedbacks.slice(0, visibleCount).map((f) => (
              <SwiperSlide key={f._id} tag="li" className={css.item}>
                <ReviewCard item={f} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={css.nav}>
            <button
              type="button"
              className={css.btnPrev}
              aria-label="Показати попередні"
              onClick={handlePrev}
              disabled={!canGoPrev}
            >
              <svg className={css.arrow} aria-hidden="true">
                <use href="/icons.svg#i-arrow" />
              </svg>
            </button>

            <button
              type="button"
              className={css.btnNext}
              aria-label="Показати наступні"
              onClick={handleNext}
              disabled={!canGoNext}
            >
              <svg
                className={`${css.arrow} ${css.arrowRight}`}
                aria-hidden="true"
              >
                <use href="/icons.svg#i-arrow" />
              </svg>
            </button>
          </div>
        </>
      )}

      {!isLoading && !isError && feedbacks.length === 0 && (
        <p className={css.text} style={{ opacity: 0.8 }}>
          Наразі відгуків немає.
        </p>
      )}
    </div>
  );
}
