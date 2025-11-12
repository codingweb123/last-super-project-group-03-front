"use client";
import css from "./CategoriesList.module.css";
import { Category } from "@/types/shop";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation } from "swiper/modules";

type Props = {
  categories: Category[];
  isSwiper?: boolean;
  swiperClass?: string;
  btnLeft?: string;
  btnRight?: string;
};

export default function CategoriesList({
  categories,
  isSwiper = false,
  swiperClass,
  btnLeft,
  btnRight,
}: Props) {
  return !isSwiper ? (
    <ul className={css.list}>
      {categories.map((category) => (
        <li key={category._id}>
          <Image
            src={category.image}
            sizes="(max-width: 768px) 335px, (max-width: 1439px) 336px, (min-width: 1440px) 416px"
            width={335}
            height={223}
            alt={category.name}
          />
          <h3>{category.name}</h3>
        </li>
      ))}
    </ul>
  ) : (
    <Swiper
      modules={[Navigation, Keyboard]}
      spaceBetween={32}
      slidesPerView={1}
      className={swiperClass ?? css.swiper}
      keyboard
      navigation={{
        prevEl: `.${btnLeft}`,
        nextEl: `.${btnRight}`,
      }}
      breakpoints={{
        320: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1440: {
          slidesPerView: 3,
        },
      }}
    >
      {categories.map((category) => (
        <SwiperSlide key={category._id}>
          <Image
            src={category.image}
            sizes="(max-width: 768px) 335px, (max-width: 1439px) 336px, (min-width: 1440px) 416px"
            width={335}
            height={223}
            alt={category.name}
          />
          <h3 className={css.title}>{category.name}</h3>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
