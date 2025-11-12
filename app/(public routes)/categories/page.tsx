"use client";
import CategoriesList from "@/components/CategoriesList/CategoriesList";

import css from "./CategoriesPage.module.css";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api/clientApi";
import { useMediaQuery } from "react-responsive";
import { Category } from "@/types/shop";
import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(2);
  const [isNewPortion, setIsNewPortion] = useState<boolean>(true);

  const perPage = useMediaQuery({
    query: "(min-width: 1440px)",
  })
    ? 6
    : 4;

  const { data } = useQuery({
    queryKey: ["categories", { page }],
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
    <section className={css.pageCategories}>
      <div className={css.container}>
        <h1 className={css.title}>Категорії</h1>
        {categories && (
          <CategoriesList categories={categories} swiperClass={css.list} />
        )}
        {page < totalPages && (
          <button type="button" className={css.button} onClick={loadMore}>
            Показати більше
          </button>
        )}
      </div>
    </section>
  );
}
