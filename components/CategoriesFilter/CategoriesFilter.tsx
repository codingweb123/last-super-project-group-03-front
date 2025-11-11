"use client";
import css from "./CategoriesFilter.module.css";
import React, { useState } from "react";


interface CategoriesFilterProps {
  shownCount: number;
  totalCount: number;
   onCategoryChange: (newCategory: string | null) => void;
}

const categories = [
  { label: "Усі", value: "all" },
  { label: "Футболки та сорочки", value: "shirts" },
  { label: "Штани та джинси", value: "pants" },
  { label: "Верхній одяг", value: "outerwear" },
  { label: "Топи та майки", value: "tops" },
  { label: "Сукні та спідниці", value: "dresses" },
  { label: "Домашній та спортивний одяг", value: "homewear" },
  { label: "Худі та кофти", value: "hoodies" },
];

const sizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

const colors = [
  "білий",
  "чорний",
  "сірий",
  "синій",
  "зелений",
  "червоний",
  "пастельні відтінки",
];

const genders = ["Всі", "Жіночий", "Чоловічий", "Унісекс"];

export const CategoriesFilter: React.FC<CategoriesFilterProps> = ({
  shownCount,
  totalCount,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState("Всі");

  const handleClearAll = () => {
    setSelectedCategory("all");
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedGender("Всі");
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender);
  };

  const handleClearSize = () => setSelectedSizes([]);
  const handleClearColors = () => setSelectedColors([]);
  const handleClearGender = () => setSelectedGender("Всі");

  return (
    <section className={css.filter}>
      <div className={css.filters}>
        <h2 className={css.title}>Фільтри</h2>
        <button type="button" onClick={handleClearAll} className={css.clearAll}>
          Очистити всі
        </button>
      </div>

      <p className={css.info}>
        Показано <strong>{shownCount}</strong> з <strong>{totalCount}</strong>
      </p>

      {/* Категорії */}
      <div className={css.category}>
        <h3 className={css.sectionTitle}>Категорії</h3>
        <ul className={css.list}>
          {categories.map((category) => (
            <li key={category.value}>
              <button
                type="button"
                onClick={() => handleCategoryChange(category.value)}
                className={`${css.button} ${
                  selectedCategory === category.value ? css.active : ""
                }`}
              >
                {category.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Розмір */}
      <div className={css.section}>
        <div className={css.sectionHeader}>
          <h3 className={css.sectionTitle}>Розмір</h3>
          <button
            type="button"
            onClick={handleClearSize}
            className={css.clearBtn}
          >
            Очистити
          </button>
        </div>
        <ul className={css.inlineList}>
          {sizes.map((size) => (
            <li key={size}>
              <label className={css.label}>
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(size)}
                  onChange={() => handleSizeToggle(size)}
                />
                {size}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Колір */}
      <div className={css.section}>
        <div className={css.sectionHeader}>
          <h3 className={css.sectionTitle}>Колір</h3>
          <button
            type="button"
            onClick={handleClearColors}
            className={css.clearBtn}
          >
            Очистити
          </button>
        </div>
        <ul className={css.list}>
          {colors.map((color) => (
            <li key={color}>
              <label className={css.label}>
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color)}
                  onChange={() => handleColorToggle(color)}
                />
                {color}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Стать */}
      <div className={css.section}>
        <div className={css.sectionHeader}>
          <h3 className={css.sectionTitle}>Стать</h3>
          <button
            type="button"
            onClick={handleClearGender}
            className={css.clearBtn}
          >
            Очистити
          </button>
        </div>
        <ul className={css.list}>
          {genders.map((gender) => (
            <li key={gender}>
              <label className={css.label}>
                <input
                  type="radio"
                  name="gender"
                  checked={selectedGender === gender}
                  onChange={() => handleGenderChange(gender)}
                />
                {gender}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

