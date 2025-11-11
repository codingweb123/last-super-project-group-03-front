import css from "./GoodsPage.module.css";
import { useState } from "react";
import { CategoriesFilter } from "@/components/CategoriesFilter/CategoriesFilter";
import { GoodsList } from "@/components/GoodsList/GoodsList";
import MessageNoInfo from "@/components/MessageNoInfo/MessageNoInfo";

export interface GoodItem {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
}

// Тимчасові товари для демонстрації
const initialGoods: GoodItem[] = [
  {
    id: "1",
    name: "Товар 1",
    image: "/img/1.jpg",
    category: "Категорія 1",
    price: 100,
    rating: 4,
    reviewsCount: 5,
  },
  {
    id: "2",
    name: "Товар 2",
    image: "/img/2.jpg",
    category: "Категорія 2",
    price: 200,
    rating: 5,
    reviewsCount: 3,
  },
  // ...додайте ще за потреби
];

export const GoodsPage = () => {
  const [goods, setGoods] = useState<GoodItem[]>(initialGoods);
  const [pageTitle, setPageTitle] = useState("Всі товари");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Зміна категорії
  const handleCategoryChange = (newCategory: string | null) => {
    setPage(1);
    setPageTitle(newCategory ? newCategory : "Всі товари");

    // Фільтруємо локально
    const filtered = newCategory
      ? initialGoods.filter((g) => g.category === newCategory)
      : initialGoods;

    setGoods(filtered);
  };

  // Пагінація локально
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const paginatedGoods = goods.slice(0, page * itemsPerPage);
  const hasMore = paginatedGoods.length < goods.length;

  return (
    <main className={css.goodsPage}>
      <h1 className={css.title}>{pageTitle}</h1>

      <section className={css.content}>
        <aside className={css.filter}>
          <CategoriesFilter
            onCategoryChange={handleCategoryChange}
            shownCount={paginatedGoods.length}
            totalCount={goods.length}
          />
        </aside>

        <div className={css.goodsBlock}>
          {paginatedGoods.length > 0 ? (
            <>
           <GoodsList goods={paginatedGoods} />

              {hasMore && (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className={css.loadMoreBtn}
                >
                  Показати більше
                </button>
              )}
            </>
          ) : (
            <MessageNoInfo
              text="За вашим запитом не знайдено жодних товарів, спробуйте змінити фільтри або скинути їх."
              buttonText="Скинути фільтри"
              onClick={() => handleCategoryChange(null)}
            />
          )}
        </div>
      </section>
    </main>
  );
};