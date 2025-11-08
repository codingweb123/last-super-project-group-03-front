"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import css from "./ReviewsList.module.css";

/* -------------------- TYPES -------------------- */
type ApiFeedback = {
  _id: string;
  author: string;
  date: string;
  description: string;
  rate: number;
  goodId:
    | string
    | { _id: string; name?: string; category?: unknown; feedbacks?: unknown };
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
  rate: number; // крок 0.5 підтримується
  goodId: string; // завжди рядок
  goodName: string; // що показуємо як назву товару/лінк
};

/* -------------------- CONFIG -------------------- */
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://last-super-project-group-03-back.onrender.com";
const ENDPOINT = `${API_BASE}/api/feedbacks`;

// ставимо безпечне значення, яке точно підтримує сервер
const PER_PAGE = 6;

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
  };
}

/* -------------------- UI PARTS -------------------- */
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

/* -------------------- FETCH ALL PAGES (SAFE) -------------------- */
async function fetchAllFeedbacks(): Promise<Feedback[]> {
  // 1) перша сторінка
  const first = await fetch(`${ENDPOINT}?page=1&perPage=${PER_PAGE}`, {
    cache: "no-store",
  });
  if (!first.ok) {
    const body = await safeBody(first);
    throw new Error(`HTTP ${first.status}${body ? ` — ${body}` : ""}`);
  }
  const firstData: ApiResponse = await first.json();

  const totalPages = Math.max(1, Number(firstData.totalPages ?? 1));
  const result: Feedback[] = (firstData.feedbacks ?? []).map(normalizeFeedback);

  // 2) якщо є ще сторінки — обережно дотягуємо (лише існуючі)
  for (let page = 2; page <= totalPages; page++) {
    const res = await fetch(`${ENDPOINT}?page=${page}&perPage=${PER_PAGE}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await safeBody(res);
      throw new Error(`HTTP ${res.status}${body ? ` — ${body}` : ""}`);
    }
    const data: ApiResponse = await res.json();
    result.push(...(data.feedbacks ?? []).map(normalizeFeedback));
  }

  return result;
}

async function safeBody(res: Response): Promise<string | null> {
  try {
    const text = await res.text();
    // інколи бекенд повертає JSON-помилку
    try {
      const j = JSON.parse(text);
      return typeof j.message === "string" ? j.message : text;
    } catch {
      return text;
    }
  } catch {
    return null;
  }
}

/* -------------------- MAIN -------------------- */
export default function ReviewsList() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["feedbacks", "all", PER_PAGE],
    queryFn: fetchAllFeedbacks,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const feedbacks = data ?? [];

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["feedbacks", "all", PER_PAGE] });
  };

  return (
    <div>
      {isLoading && (
        <p className={css.text} style={{ opacity: 0.6 }}>
          Завантаження відгуків…
        </p>
      )}

      {isError && (
        <p className={css.text} style={{ color: "var(--color-error,#d33)" }}>
          Помилка завантаження: {(error as Error)?.message}
        </p>
      )}

      {!isLoading && !isError && (
        <ul className={css.list} role="list">
          {feedbacks.map((f) => (
            <li key={f._id} className={css.item}>
              <ReviewCard item={f} />
            </li>
          ))}
        </ul>
      )}

      <div className={css.nav}>
        <button
          type="button"
          className={css.btnPrev}
          aria-label="Попередні"
          disabled
          title="Soon"
        >
          <svg className={css.arrow} aria-hidden="true">
            <use href="/icons.svg#i-arrow" />
          </svg>
        </button>

        <button
          type="button"
          className={css.btnNext}
          aria-label="Наступні"
          disabled
          title="Soon"
        >
          <svg className={`${css.arrow} ${css.arrowRight}`} aria-hidden="true">
            <use href="/icons.svg#i-arrow" />
          </svg>
        </button>

        <button
          type="button"
          className={css.btnNext}
          aria-label="Оновити відгуки"
          onClick={handleRefresh}
          disabled={isFetching}
          title="Оновити відгуки"
        >
          <svg className={css.arrow} aria-hidden="true">
            <use href="/icons.svg#i-refresh" />
          </svg>
        </button>
      </div>
    </div>
  );
}
