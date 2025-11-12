import { useEffect, useState } from 'react';
import { GoodInfo } from '../GoodInfo/GoodInfo';
import MessageNoInfo from '../MessageNoInfo/MessageNoInfo';
import css from './GoodsList.module.css';
import axios from 'axios';

type Good = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  rating: number;
  reviews: number;
};

interface GoodsListProps {
  filters: Record<string, string | number | boolean>;
  onResetFilters: () => void;
}

export const GoodsList: React.FC<GoodsListProps> = ({
  filters,
  onResetFilters,
}) => {
  const [goods, setGoods] = useState<Good[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // --- Завантаження товарів ---
  useEffect(() => {
    const fetchGoods = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/goods', {
          params: { ...filters, page, limit: 12 },
        });

        // Якщо це перша сторінка — замінюємо товари, інакше додаємо нові
        setGoods(prev => (page === 1 ? data.items : [...prev, ...data.items]));
        setTotalPages(data.totalPages);

        // Визначаємо, чи є ще товари
        setHasMore(page < totalPages);
      } catch (error) {
        console.error('Помилка при завантаженні товарів:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoods();
  }, [filters, page, totalPages]);

  // --- Якщо немає товарів ---
  if (!loading && goods.length === 0) {
    return (
      <div className={css.noInfoWrapper}>
        <MessageNoInfo
          text="За вашим запитом не знайдено жодних товарів. Спробуйте змінити фільтри або скинути їх."
          buttonText="Скинути фільтри"
          onClick={onResetFilters}
        />
      </div>
    );
  }

  // --- Основний рендер ---
  return (
    <div className={css.goodsContainer}>
      <ul className={css.list}>
        {goods.map(good => (
          <li key={good.id}>
            <GoodInfo
              good={{
                id: good.id,
                name: good.name,
                image: good.imageUrl,
                category: good.category,
                price: good.price,
                likes: good.rating,
                reviews: good.reviews,
              }}
            />
          </li>
        ))}
      </ul>

      {/* --- Кнопка "Показати більше" --- */ }
      {hasMore && !loading && (
        <button
          type="button"
          onClick={() => setPage(prev => prev + 1)}
          className={css.loadMoreBtn}
        >
          Показати більше
        </button>
      )}

      {loading && <p className={css.loadingText}>Завантаження...</p>}
    </div>
  );
};