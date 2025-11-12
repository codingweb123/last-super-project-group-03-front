export type Cloth = {
  name: string;
  price: number;
  rating: number;
  reviews: number;
};
export type Category = {
  _id: string;
  image: string;
  name: string;
};

export type CategoriesResponse = {
  categories: Category[];
  page?: number;
  perPage: number;
  totalCategories: number;
  totalPages: number;
};
