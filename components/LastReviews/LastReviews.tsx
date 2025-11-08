import ReviewsList from "../ReviewsList/ReviewsList";
import css from "./LastReviews.module.css";

export default function LastReviews() {
  return (
    <section className={`section ${css.lastReviews}`}>
      <div className="container">
        <h2 className={css.title}>Останні відгуки</h2>
        <ReviewsList />
      </div>
    </section>
  );
}
