"use client";

import css from "./ReviewsList.module.css";

type Feedback = {
  _id: string;
  author: string;
  date: string;
  description: string;
  rate: number;
  goodId: string;
};

const mockFeedbacks: Feedback[] = [
  {
    _id: "1",
    author: "Олена Коваль",
    date: "2025-10-20",
    description:
      "Футболки Clothica - це справжня знахідка для мене! Я в захваті від якості та дизайну.",
    rate: 5,
    goodId: "bazova-futbolka",
  },
  {
    _id: "2",
    author: "Ігор Петров",
    date: "2025-10-18",
    description:
      "Я завжди отримую компліменти, коли ношу їх футболки! Вони стильні і зручні.",
    rate: 4.5,
    goodId: "hudi-z-kapushonom",
  },
  {
    _id: "3",
    author: "Ігор Шевченко",
    date: "2025-10-12",
    description: "Дуже приємні та якісні матеріали.",
    rate: 3.5,
    goodId: "dzhynsovi-shorts",
  },
  {
    _id: "4",
    author: "Анна К.",
    date: "2025-10-09",
    description: "Класний фасон, беру ще.",
    rate: 2.5,
    goodId: "light-tee",
  },
  {
    _id: "5",
    author: "Макс І.",
    date: "2025-10-01",
    description: "Розмір відповідає сітці, доставка швидка.",
    rate: 4,
    goodId: "urban-hoodie",
  },
  {
    _id: "6",
    author: "Юлія",
    date: "2025-09-29",
    description: "На зріст 168 см підійшов M.",
    rate: 3,
    goodId: "soft-hoodie",
  },
];

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
        >
          {item.goodId}
        </a>
      </div>
    </>
  );
}

export default function ReviewsList() {
  const feedbacks = mockFeedbacks;

  return (
    <div>
      <ul className={css.list} role="list">
        {feedbacks.map((f) => (
          <li key={f._id} className={css.item}>
            <ReviewCard item={f} />
          </li>
        ))}
      </ul>

      <div className={css.nav}>
        <button type="button" className={css.btnPrev} aria-label="Попередні">
          <svg className={css.arrow} aria-hidden="true">
            <use href="/icons.svg#i-arrow" />
          </svg>
        </button>

        <button type="button" className={css.btnNext} aria-label="Наступні">
          <svg className={`${css.arrow} ${css.arrowRight}`} aria-hidden="true">
            <use href="/icons.svg#i-arrow" />
          </svg>
        </button>
      </div>
    </div>
  );
}
