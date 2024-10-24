import React from "react";
import ProductCard from "./ProductCard";
import { useGetProductsByCategoryQuery } from "@/services/api";
import Loading from "../Loading";

interface MenuContent {
  name: string;
  ids: number[];
}

const ProductList = ({
  menuContents,
  activeCategory,
}: {
  menuContents: MenuContent[];
  activeCategory: string | null;
}) => {
  const { data, isLoading, error } = useGetProductsByCategoryQuery(activeCategory || '');

  const activeCategoryName = React.useMemo(() => {
    if (!menuContents || !Array.isArray(menuContents) || menuContents.length === 0) {
      return "";
    }
    const content = menuContents.find((content) => 
      content.ids && content.ids[0] && content.ids[0].toString() === activeCategory
    );
    return content?.name || "";
  }, [menuContents, activeCategory]);

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading products</div>;

  const products = data?.products || [];

  if (products.length === 0) {
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
      {products.map((product: any) => (
        <ProductCard
          key={product.product_id}
          product={product}
          activeCategoryName={activeCategoryName}
        />
      ))}
    </div>
  );
};

export default ProductList;
