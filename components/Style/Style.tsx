import css from "./Style.module.css";
import Image from "next/image";

const Style = () => {
  return (
    <section className={`section ${css.style}`}>
      <div className="container">
        <h2 className={css.style_title}>
          Обери свій унікальний стиль сьогодні
        </h2>
        <ul className={css.style_list}>
          <li className={css.style_list_item}>
            <Image
              src="/images/strings.png"
              alt="string"
              width={56}
              height={56}
            />
            <h3 className={css.style_subtitle}>Якість та натуральність</h3>
            <p className={css.style_list_text}>
              тільки приємні до тіла тканини, які зберігають форму навіть після
              десятків прань.
            </p>
          </li>
          <li className={css.style_list_item}>
            <Image
              src="/images/paint.png"
              alt="palette"
              width={56}
              height={56}
            />
            <h3 className={css.style_subtitle}>Універсальний дизайн</h3>
            <p className={css.style_list_text}>
              базові кольори та лаконічний стиль, що легко комбінуються між
              собою.
            </p>
          </li>
          <li className={css.style_list_item}>
            <Image src="/images/shirt.png" alt="shirt" width={56} height={56} />
            <h3 className={css.style_subtitle}>Комфорт на кожен день</h3>
            <p className={css.style_list_text}>
              одяг, який не обмежує рухів і підходить для будь-якої ситуації.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Style;
