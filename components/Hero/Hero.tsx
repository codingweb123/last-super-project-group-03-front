import css from "./Hero.module.css";
import Image from "next/image";

const Hero = () => {
  return (
    <section className={`section ${css.hero}`}>
      <div className="container">
        <ul className={css.hero_content}>
          <li>
            <h1 className={css.hero_title}>
              Знайди свій стиль з Clothica вже сьогодні!
            </h1>
            <p className={css.hero_text}>
              Clothica — це місце, де комфорт поєднується зі стилем. Ми
              створюємо базовий одяг, який легко комбінується та підходить для
              будь-якої нагоди. Обирай речі, що підкреслять твою
              індивідуальність і завжди будуть актуальними.
            </p>
            <a href="#PopularGoods" className={css.link_first}>
              До товарів
            </a>
            <a href="#PopularCategories" className={css.link_second}>
              Дослідити категорії
            </a>
          </li>
          <li>
            <Image
              src="/images/hero.png"
              alt="Hero image"
              width={335}
              height={335}
              sizes="(max-width: 768px) 335px, (max-width: 1439px) 336px, (min-width: 1440px) 640px"
              className={css.hero_image}
            />
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Hero;
