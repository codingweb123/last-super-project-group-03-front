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

export const GoodsList: React.FC<GoodsListProps> = ({ filters, onResetFilters }) => {
  const [goods, setGoods] = useState<Good[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/goods', {
          params: { ...filters, page },
        });
        setGoods(data.items);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Помилка при завантаженні товарів:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGoods();
  }, [filters, page]);

  if (loading) return <p>Завантаження...</p>;

  if (goods.length === 0) {
  return (
    <div className={css.noInfoWrapper}>
      <MessageNoInfo
        text="За вашим запитом не знайдено жодних товарів, спробуйте змінити фільтри, або скинути їх"
        buttonText="Скинути фільтри"
        onClick={onResetFilters}
      />
    </div>
  );
}

  return (
    <>
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

      <div className={css.pagination}>
        <button
          disabled={page === 1}
          onClick={() => setPage(prev => prev - 1)}
        >
          Попередня
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(prev => prev + 1)}
        >
          Наступна
        </button>
      </div>
    </>
  );
};