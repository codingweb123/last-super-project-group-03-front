import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import css from "./GoodInfo.module.css";

export interface GoodInfoProps {
  good: {
    id: string;
    name: string;
    image: string;
    category: string;
    price: number;
    likes: number;
    reviews: number;
  };
}

export const GoodInfo: React.FC<GoodInfoProps> = ({ good }) => {
  return (
    <div className={css.card}>
      <div className={css.imageWrapper}>
        <img
          src={good.image}
          alt={good.name}
          loading="lazy"
          className={css.image}
        />
      </div>

      <div className={css.info}>
        <span className={css.category}>{good.category}</span>

        <h3 className={css.name}>{good.name}</h3>

        <p className={css.price}>{good.price} ₴</p>

        <div className={css.rating}>
          <div className={css.likes}>
            <Star size={16} className={css.starIcon} />
            <span>{good.likes}</span>
          </div>
          <span className={css.reviews}>{good.reviews} відгуків</span>
        </div>

        <Link to={`/goods/${good.id}`} className={css.detailsBtn}>
          Детальніше
        </Link>
      </div>
    </div>
  );
};