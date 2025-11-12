import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import PopularCategoriesClient from "./PopularCategories.client";
import css from "./PopularCategories.module.css";
import Link from "next/link";
import { getCategories } from "@/lib/api/clientApi";

export default async function PopularCategories() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["popularCategories", { page: 1 }],
    queryFn: () => getCategories({ page: 1 }),
    staleTime: 15 * 60 * 1000,
  });
  return (
    <section className={`section ${css.popularCategories}`}>
      <div>
        <div className={css.containerHeader}>
          <h2 className={css.sectionTitle}>Популярні категорії</h2>
          <Link href="/categories" className={css.buttonAllCat}>
            Всі категорії
          </Link>
        </div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <PopularCategoriesClient />
        </HydrationBoundary>
      </div>
    </section>
  );
}
