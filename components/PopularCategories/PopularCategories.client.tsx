"use client";

import "swiper/css";
import "swiper/css/navigation";
//import "./styles.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useState, useEffect } from "react";
import CategoryCard from "../CategoryCard/CategoryCard";
import { getCategories } from "@/lib/api/clientApi";
import { CategoriesResponse, Category } from "@/types/shop";

export default function PopularCategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res: CategoriesResponse = await getCategories({ page: 1 });
      setCategories(res.categories);
    };
    fetchCategories();
  }, []);

  if (!categories.length) {
    return null;
  }

  return (
    <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
      {categories.map((cat) => (
        <SwiperSlide key={cat._id}>
          <CategoryCard category={cat} />
        </SwiperSlide>
      ))}
      <ul></ul>
    </Swiper>
  );
}
