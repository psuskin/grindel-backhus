import React from "react";
import ProductCard from "./ProductCard";
import Loading from "../Loading";

interface MenuContent {
  name: string;
  ids: number[];
  count?: number;
}

interface Product {
  product_id: string;
  // Add other product properties as needed
}

interface ProductListProps {
  products: Product[];
  menuContents: MenuContent[];
  activeCategoryName?: string;
  currentCount: number;
  requiredCount: number;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  menuContents,
  activeCategoryName,
  currentCount,
  requiredCount
}) => {
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
    <>
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Selected: {currentCount} / {requiredCount} items
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {products.map((product: any) => (
          <ProductCard
            key={product.product_id}
            product={product}
            activeCategoryName={activeCategoryName || menuContents[0]?.name || ""}
          />
        ))}
      </div>
    </>
  );
};

export default ProductList;
