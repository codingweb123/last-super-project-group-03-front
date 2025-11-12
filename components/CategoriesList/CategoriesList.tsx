"use client";

import { getCategories } from "@/lib/api/clientApi";
import { useState } from "react";
import CategoryCard from "../CategoryCard/CategoryCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Category } from "@/types/shop";

export default function CategoriesList() {
  const [page, setPage] = useState(1);
  //const [categories, setCategories] = useState([]);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["categories", page],
    queryFn: () => getCategories({ page }),
    placeholderData: keepPreviousData,
  });

  const handleLoadMore = () => {
    setPage((p) => p + 1);
  };
  if (isLoading) return <p>Завантаження...</p>;
  if (isError) return <p>Під час завантаження сталася помилка...</p>;

  const categories: Category[] = data?.categories ?? [];

  //useEffect(() => {
  // const fetchCategories = async () => {
  //  const res = await getCategories({ page });
  //  setCategories(res.categories);
  //  };
  //  fetchCategories();
  //}, [page]);

  return (
    <>
      <ul>
        {categories.map((cat) => (
          <li key={cat._id}>
            <CategoryCard category={cat} />
          </li>
        ))}
      </ul>
      <button onClick={handleLoadMore} disabled={isFetching}>
        {isFetching ? "Завантаження..." : " Завантажити більше"}
      </button>
    </>
  );
}
