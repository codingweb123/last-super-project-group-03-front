'use client';

import { useState } from 'react';
import Link from 'next/link';
import css from "./Footer.module.css"

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!email || !emailPattern.test(email)) {
      alert('Будь ласка, введіть коректний email');
      return;
    }
    
    console.log('Email submitted:', email);
    setEmail('');
    alert('Дякуємо за підписку!');
  };

  const navItems = [
    { href: '/', label: 'Головна' },
    { href: '/products', label: 'Товари' },
    { href: '/categories', label: 'Категорії' }
  ];

  return (
    <footer className={css.footer}>
      <div className={css.container}>
        <div className={css.content}>
          {}
          <div className={css.topSection}>
            {}
            <div className={css.brandSection}>
              <div className={css.logo}>Clothica</div>
              
              <nav className={css.navigation} aria-label="Основна навігація">
                <h4 className={css.navTitle}>Меню</h4>
                <ul className={css.navList}>
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className={css.navLink}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {}
            <div className={css.newsletter}>
              <h3 className={css.newsletterTitle}>Підписатися</h3>
              <p className={css.newsletterText}>
                Приєднуйтесь до нашої розсилки, щоб бути в курсі новин та акцій.
              </p>
              <form onSubmit={handleSubmit} className={css.newsletterForm} noValidate>
                <input
                  type="email"
                  placeholder="Введіть ваш email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={css.emailInput}
                  required
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  title="Будь ласка, введіть коректний email адрес"
                />
                <button type="submit" className={css.subscribeButton}>
                  Підписатися
                </button>
              </form>
            </div>
          </div>

          {}
          <div className={css.copyright}>
            © 2025 Clothica. Всі права захищені.
          </div>
        </div>
      </div>
    </footer>
  )
}