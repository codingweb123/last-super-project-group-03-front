"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, A11y } from "swiper/modules";
import "swiper/css";
import css from "./ReviewsList.module.css";
import type { Swiper as SwiperInstance } from "swiper";

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

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://last-super-project-group-03-back.onrender.com";
const ENDPOINT = `${API_BASE}/api/feedbacks`;
const PER_PAGE = 6;

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

  const parseTime = (f: Feedback) =>
    Date.parse(f.updatedAt || f.createdAt || f.date || "") || 0;
  all.sort((a, b) => parseTime(b) - parseTime(a));

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
          {item.goodName}
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

  const getSlidesPerView = (sw: SwiperInstance | null) => {
    if (!sw) return 1;
    const spv = sw.params.slidesPerView;
    return typeof spv === "number" ? spv : 1;
  };

  const syncStepFromSwiper = (sw: SwiperInstance | null) => {
    const s = getSlidesPerView(sw);
    setStep(s);
  };

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

  const handleSlideChange = (sw: SwiperInstance) => {
    setActiveIndex(sw.activeIndex);
  };

  const handlePrev = () => {
    if (!swiper) return;
    swiper.slideTo(Math.max(0, activeIndex - step));
  };

  const handleNext = () => {
    if (hasMoreWithinRendered && swiper) {
      swiper.slideTo(Math.min(visibleCount - 1, activeIndex + step));
      return;
    }
    if (canAddMore) {
      setVisibleCount((v) => Math.min(v + step, feedbacks.length));
    }
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
          syncStepFromSwiper(sw);
        }}
        onBreakpoint={(sw) => syncStepFromSwiper(sw)}
        onResize={(sw) => syncStepFromSwiper(sw)}
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
