import React from "react";
import ProductCard from "./ProductCard";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { RootState } from "@/redux/store";
import Loading from "../Loading";
import Link from "next/link";

const ProductList = ({
  menuContents,
  activeCategory,
}: {
  menuContents: any[];
  activeCategory: string | null;
}) => {
  const products = useAppSelector((state: RootState) => state.products);
  const loading = useAppSelector((state: RootState) => state.loading);

  const activeCategoryName =
    menuContents.find((content) => content.ids[0].toString() === activeCategory)
      ?.name || "";

  if (loading) {
    return (
      <div className="col-span-full flex justify-center items-center py-12">
        <Loading />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="col-span-full flex justify-center items-center py-12">
        <p className="text-xl text-gray-600">
          No products available in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product: any, index: number) => (
        <Link
          key={product.product_id}
          href={`/menu/shop/${product.product_id}?menuName=${encodeURIComponent(
            activeCategoryName
          )}`}
        >
          <ProductCard
            key={`${product.product_id}-${index}`}
            product={product}
          />
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
