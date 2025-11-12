"use client";

import css from "./PopularCategories.module.css";
import { useState, useEffect } from "react";
import { getCategories } from "@/lib/api/clientApi";
import { Category } from "@/types/shop";
import CategoriesList from "../CategoriesList/CategoriesList";
import { useQuery } from "@tanstack/react-query";

export default function PopularCategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(2);
  const [isNewPortion, setIsNewPortion] = useState<boolean>(true);

  const { data } = useQuery({
    queryKey: ["popularCategories", { page }],
    queryFn: () => getCategories({ page }),
    staleTime: 15 * 60 * 1000,
    refetchOnMount: false,
    enabled: isNewPortion,
  });

  useEffect(() => {
    const setNewCategories = () => {
      if (data && isNewPortion) {
        setTotalPages(data.totalPages);
        setIsNewPortion(false);
        if (page === 1) {
          setCategories(data.categories);
        } else {
          setCategories((prev) => [...prev, ...data.categories]);
        }
      }
    };
    setNewCategories();
  }, [data, page, isNewPortion]);

  const loadMore = () => {
    if (page >= totalPages) {
      return;
    }
    setPage(page + 1);
    setIsNewPortion(true);
  };

  return (
    categories && (
      <>
        <CategoriesList
          isSwiper={true}
          categories={categories}
          btnLeft={css.btnLeft}
          btnRight={css.btnRight}
        />
        <ul>
          <li className={css.listBtn}>
            <button
              type="button"
              className={`${css.button} ${css.btnLeft}`}
              aria-label="Navigate previous slide"
            >
              <svg className={css.icons} width={24} height={24}>
                <use href="/icons.svg#i-arrow"></use>
              </svg>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`${css.button} ${css.btnRight}`}
              onClick={loadMore}
              aria-label="Navigate next slide"
            >
              <svg className={css.icons} width={24} height={24}>
                <use href="/icons.svg#i-arrow"></use>
              </svg>
            </button>
          </li>
        </ul>
      </>
    )
  );
}
