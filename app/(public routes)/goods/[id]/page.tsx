// app/(public routes)/goods/[id]/page.tsx  (Server Component)


import Image from 'next/image';
import Header from '@/components/Header/Header';
// import Reviews from '@/components/Reviews/Reviews';
import Footer from '@/components/Footer/Footer';
import styles from './GoodPage.module.css';
import ProductOptions from './ProductOptions';


interface Good {
  id: string;
  name: string;
  description: string;
  fullDescription: string; // повний опис товару
  price: number;
  category: string;
  images: string[];
  rating: number;        // Рейтинг приходить з основним запитом
  reviewCount: number;   // Кількість відгуків приходить з основним запитом
}


// ОРІГІНАЛ  один товар

// async function getGoodData(id: string): Promise<Good> {
//   const res = await fetch(`${process.env.API_URL}/goods/${id}`);
  
//   if (!res.ok) {
//     throw new Error('Товар не знайдено');
//   }
  
//   return res.json();
// }

// interface GoodPageProps {
//   params: {
//     id: string;
//   };
// }


// ТЕСТ  ТЕСТ  ТЕСТ  ТЕСТ  ТЕСТ один товар
// http://localhost:3000/goods/1

async function getGoodData(id: string): Promise<Good> {
  return {
    id: id,
    name: "Базова футболка",
    description: "Універсальний елемент гардеробу на кожен день. Виконана з м'якої бавовни, приємна до тіла та добре тримає форму. Лаконічний дизайн дозволяє легко поєднувати футболку з джинсами, шортами чи під жакет. Ідеальний вибір для тих, хто цінує комфорт і мінімалізм.",
    fullDescription: "Базова футболка Clothica – якість та універсальність. Виготовлена зі 100% натуральної бавовни, вона приємна до тіла, добре пропускає повітря та підходить для щоденного носіння у будь-яку пору року. Лаконічний дизайн без зайвих деталей робить футболку універсальною основою гардеробу.",
    price: 750,
    category: "clothing",
    images: [
      "https://picsum.photos/600/400?random=1"
    ],
    rating: 4.5,
    reviewCount: 10
  };
}





// Функція для відображення зірочок рейтингу з SVG
function renderRatingStars(rating: number) {
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      // Повністю заповнена зірка
      stars.push(
        <span key={i} className={styles.starFull}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </span>
      );
    } else if (rating >= i - 0.5) {
      // Напівзаповнена зірка
      stars.push(
        <span key={i} className={styles.starHalf}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <defs>
              <linearGradient id="half-star" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="#000000"/>
                <stop offset="50%" stopColor="transparent"/>
              </linearGradient>
            </defs>
            <path 
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
              fill="url(#half-star)"
              stroke="#000000"
            />
          </svg>
        </span>
      );
    } else {
      // Порожня зірка (тільки контур)
      stars.push(
        <span key={i} className={styles.starEmpty}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </span>
      );
    }
  }
  
  return stars;
}

interface GoodPageProps {
  params: {
    id: string;
  };
}


export default async function GoodPage({ params }: GoodPageProps) {
  const { id } = params;
  const good = await getGoodData(id);

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        {/* Основний контейнер для товару */}
        <div className={styles.productLayout}>
          {/* Секція з фото товару (ЗЛІВА) */}
          <div className={styles.gallerySection}>
            <div className={styles.gallery}>
              <div className={styles.imageContainer}>
                <Image 
                  src={good.images[0]} 
                  alt={good.name}
                  width={640}
                  height={682}
                  className={styles.image}
                  priority={true}
                />
              </div>
            </div>
          </div>

          {/* Секція інформації про товар (ЗПРАВА) */}
          <div className={styles.productInfo}>
            {/* Шлях до товару */}
            <div className={styles.breadcrumb}>
              <span className={styles.breadcrumbItem}>Всі товари</span>
              <span className={styles.breadcrumbDivider}>{'>'}</span>
              <span className={styles.breadcrumbItem}>Категорія</span>
              <span className={styles.breadcrumbDivider}>{'>'}</span>
              <span className={styles.breadcrumbItemCurrent}><strong>{good.name}</strong></span>
            </div>
            
            {/* Назва товару  */}
            <h1 className={styles.title}>{good.name}</h1>
            
            {/* Ціна, рейтинг та відгуки в один рядок як на фото */}
            <div className={styles.priceRatingRow}>
              <span className={styles.price}>{good.price} грн</span>
              <span className={styles.verticalDivider}>|</span>
              <div className={styles.ratingSection}>
                {renderRatingStars(good.rating)}
                <span className={styles.ratingValue}>({good.rating.toFixed(1)})</span>
              </div>
              <span className={styles.dotDivider}>•</span>
              <span className={styles.reviewCount}>{good.reviewCount} відгуків</span>
            </div>
            
            {/* Короткий опис */}
            <p className={styles.description}>{good.description}</p>

            {/* Компонент вибору опцій - ВИКОРИСТАННЯ КОМПОНЕНТА */}
            <ProductOptions />

            {/* Рядок про безкоштовну доставку */}
            <div className={styles.deliveryInfo}>
              Безкоштовна доставка для замовлень від 1000 грн
            </div>

            {/* Розділ з повним описом товару */}
            <div className={styles.fullDescriptionSection}>
              <h2 className={styles.fullDescriptionTitle}>
                <span className={styles.underlinedTitle}>Опис</span>
              </h2>
              <p className={styles.fullDescriptionText}>{good.fullDescription}</p>
            </div>
          </div>
        </div>

        {/* <Reviews productId={id} /> */}
      </main>

      <Footer />
    </div>
  );
}