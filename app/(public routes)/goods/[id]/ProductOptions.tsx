// app/(public routes)/goods/[id]/ProductOptions.tsx (Client Component)


// 'use client';

// import { useState } from 'react';
// import styles from './GoodPage.module.css';

// // Компонент для вибору кольору
// function ColorSelector({ selectedColor, onColorChange }: { 
//   selectedColor: string; 
//   onColorChange: (color: string) => void;
// }) {
//   const colors = ['Білий', 'Чорний', 'Зелений', 'Сірий'];

//   return (
//     <div className={styles.colorSelector}>
//       {colors.map((color) => (
//         <button
//           key={color}
//           className={`${styles.colorButton} ${selectedColor === color ? styles.colorButtonActive : ''}`}
//           onClick={() => onColorChange(color)}
//         >
//           {color}
//         </button>
//       ))}
//     </div>
//   );
// }

// // Компонент для вибору розміру
// function SizeSelector({ selectedSize, onSizeChange }: {
//   selectedSize: string;
//   onSizeChange: (size: string) => void;
// }) {
//   const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

//   return (
//     <div className={styles.sizeSelector}>
//       {sizes.map((size) => (
//         <button
//           key={size}
//           className={`${styles.sizeButton} ${selectedSize === size ? styles.sizeButtonActive : ''}`}
//           onClick={() => onSizeChange(size)}
//         >
//           {size}
//         </button>
//       ))}
//     </div>
//   );
// }

// export default function ProductOptions() {
//   const [selectedSize, setSelectedSize] = useState('L'); // За замовчуванням L
//   const [selectedColor, setSelectedColor] = useState('Білий'); // За замовчуванням Білий

//   return (
//     <>
//       {/* Вибір розміру */}
//       <div className={styles.optionSection}>
//         <h3 className={styles.optionTitle}>Розмір</h3>
//         <SizeSelector 
//           selectedSize={selectedSize} 
//           onSizeChange={setSelectedSize} 
//         />
//       </div>

//       {/* Вибір кольору */}
//       <div className={styles.optionSection}>
//         <h3 className={styles.optionTitle}>Колір</h3>
//         <ColorSelector 
//           selectedColor={selectedColor} 
//           onColorChange={setSelectedColor} 
//         />
//       </div>
//     </>
//   );
// }










// app/(public routes)/goods/[id]/ProductOptions.tsx (Client Component)

// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import styles from './GoodPage.module.css';

// // Типи для товару
// interface Product {
//   id: string;
//   size: string;
//   color: string;
//   quantity: number;
//   name?: string;
//   price?: number;
//   image?: string;
// }

// // Компонент для вибору кольору
// function ColorSelector({ selectedColor, onColorChange }: { 
//   selectedColor: string; 
//   onColorChange: (color: string) => void;
// }) {
//   const colors = ['Білий', 'Чорний', 'Зелений', 'Сірий'];

//   return (
//     <div className={styles.colorSelector}>
//       {colors.map((color) => (
//         <button
//           key={color}
//           className={`${styles.colorButton} ${selectedColor === color ? styles.colorButtonActive : ''}`}
//           onClick={() => onColorChange(color)}
//         >
//           {color}
//         </button>
//       ))}
//     </div>
//   );
// }

// // Компонент для вибору розміру
// function SizeSelector({ selectedSize, onSizeChange }: {
//   selectedSize: string;
//   onSizeChange: (size: string) => void;
// }) {
//   const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

//   return (
//     <div className={styles.sizeSelector}>
//       {sizes.map((size) => (
//         <button
//           key={size}
//           className={`${styles.sizeButton} ${selectedSize === size ? styles.sizeButtonActive : ''}`}
//           onClick={() => onSizeChange(size)}
//         >
//           {size}
//         </button>
//       ))}
//     </div>
//   );
// }

// // Хук для роботи з кошиком
// function useCart() {
//   const [cartCount, setCartCount] = useState<number>(0);

//   const addToCart = (product: Product, quantity: number = 1): void => {
//     // Логіка додавання до кошика
//     setCartCount(prev => prev + quantity);
//     console.log('Додано до кошика:', product, 'Кількість:', quantity);
//   };

//   return { cartCount, addToCart };
// }

// export default function ProductOptions() {
//   const [selectedSize, setSelectedSize] = useState<string>('L');
//   const [selectedColor, setSelectedColor] = useState<string>('Білий');
//   const [quantity] = useState<number>(1); // За замовчуванням 1
//   const router = useRouter();
  
//   const { cartCount, addToCart } = useCart();

//   const handleAddToCart = (): void => {
//     const product: Product = {
//       id: window.location.pathname.split('/').pop() || '',
//       size: selectedSize,
//       color: selectedColor,
//       quantity: quantity
//     };
    
//     addToCart(product, quantity);
//   };

//   const handleBuyNow = (): void => {
//     // Тільки перенаправлення на сторінку кошика
//     router.push('/cart');
//   };

//   return (
//     <>
//       {/* Вибір розміру */}
//       <div className={styles.optionSection}>
//         <h3 className={styles.optionTitle}>Розмір</h3>
//         <SizeSelector 
//           selectedSize={selectedSize} 
//           onSizeChange={setSelectedSize} 
//         />
//       </div>

//       {/* Вибір кольору */}
//       <div className={styles.optionSection}>
//         <h3 className={styles.optionTitle}>Колір</h3>
//         <ColorSelector 
//           selectedColor={selectedColor} 
//           onColorChange={setSelectedColor} 
//         />
//       </div>

//       {/* Лічильник загальної кількості товарів у кошику */}
//       <div className={styles.optionSection}>
//         <div style={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'space-between',
//           padding: '10px 0',
//           borderBottom: '1px solid #e0e0e0'
//         }}>
//           <span style={{ fontWeight: 500 }}>Товарів у кошику:</span>
//           <span style={{ 
//             fontSize: '1.2rem', 
//             fontWeight: 'bold', 
//             color: '#007bff' 
//           }}>
//             {cartCount}
//           </span>
//         </div>
//       </div>

//       {/* Кнопки дій */}
//       <div className={styles.optionSection}>
//         <button 
//           className={styles.addToCartButton}
//           onClick={handleAddToCart}
//           style={{ marginBottom: '10px' }}
//         >
//           Додати в кошик
//         </button>
        
//         <button 
//           className={styles.addToCartButton}
//           onClick={handleBuyNow}
//           style={{
//             backgroundColor: '#28a745',
//           }}
//           onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
//           onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
//         >
//           Купити зараз
//         </button>
//       </div>
//     </>
//   );
// }









// app/(public routes)/goods/[id]/ProductOptions.tsx (Client Component)

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './GoodPage.module.css';

// Типи для товару
interface Product {
  id: string;
  size: string;
  color: string;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
}

// Компонент для вибору кольору
function ColorSelector({ selectedColor, onColorChange }: { 
  selectedColor: string; 
  onColorChange: (color: string) => void;
}) {
  const colors = ['Білий', 'Чорний', 'Зелений', 'Сірий'];

  return (
    <div className={styles.colorSelector}>
      {colors.map((color) => (
        <button
          key={color}
          className={`${styles.colorButton} ${selectedColor === color ? styles.colorButtonActive : ''}`}
          onClick={() => onColorChange(color)}
        >
          {color}
        </button>
      ))}
    </div>
  );
}

// Компонент для вибору розміру (кастомний випадаючий список)
function SizeSelector({ selectedSize, onSizeChange }: {
  selectedSize: string;
  onSizeChange: (size: string) => void;
}) {
  const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className={styles.sizeSelectWrapper}>
      <select 
        value={selectedSize}
        onChange={(e) => onSizeChange(e.target.value)}
        className={styles.sizeSelect}
      >
        {sizes.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <div className={styles.selectArrow}>
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>
    </div>
  );
}

// Хук для роботи з кошиком
function useCart() {
  const [cartCount, setCartCount] = useState<number>(0);

  const addToCart = (product: Product, quantity: number = 1): void => {
    setCartCount(prev => prev + quantity);
    console.log('Додано до кошика:', product, 'Кількість:', quantity);
  };

  return { cartCount, addToCart };
}

export default function ProductOptions() {
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [selectedColor, setSelectedColor] = useState<string>('Білий');
  const [quantity] = useState<number>(1);
  const router = useRouter();
  
  const { cartCount, addToCart } = useCart();

  const handleAddToCart = (): void => {
    const product: Product = {
      id: window.location.pathname.split('/').pop() || '',
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    };
    
    addToCart(product, quantity);
  };

  const handleBuyNow = (): void => {
    router.push('/cart');
  };

  return (
    <>
      {/* Вибір розміру */}
      <div className={styles.optionSection}>
        <h3 className={styles.optionTitle}>Розмір</h3>
        <SizeSelector 
          selectedSize={selectedSize} 
          onSizeChange={setSelectedSize} 
        />
      </div>

      {/* Вибір кольору */}
      <div className={styles.optionSection}>
        <h3 className={styles.optionTitle}>Колір</h3>
        <ColorSelector 
          selectedColor={selectedColor} 
          onColorChange={setSelectedColor} 
        />
      </div>

      {/* Кнопки дій з лічильником */}
      <div className={styles.optionSection}>
        <div className={styles.cartActions}>
          {/* Кнопка Додати в кошик */}
          <button 
            className={styles.addToCartButton}
            onClick={handleAddToCart}
          >
            Додати в кошик
          </button>
          
          {/* Лічильник товарів у кошику - чорний текст, вирівнювання по лівому краю */}
          <div className={styles.cartCounter}>
            <span className={styles.cartCount}>{cartCount}</span>
          </div>
        </div>

        {/* Кнопка Купити зараз */}
        <button 
          className={styles.buyNowButton}
          onClick={handleBuyNow}
        >
          Купити зараз
        </button>
      </div>
    </>
  );
}