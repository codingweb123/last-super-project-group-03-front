import { Category } from "../../types/shop";
import Image from "next/image";

export type Props = {
  category: Category;
};

export default function CategoryCard({ category }: Props) {
  return (
    <>
      <Image src={category.image} alt={category.name} />
      <p>{category.name}</p>
    </>
  );
}
