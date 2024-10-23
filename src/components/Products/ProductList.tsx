import React, { useMemo } from "react";
import ProductCard from "./ProductCard";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { RootState } from "@/redux/store";
import Loading from "../Loading";

const ProductList = ({
  menuContents,
  activeCategory,
}: {
  menuContents: any[];
  activeCategory: string | null;
}) => {
  const products = useAppSelector((state: RootState) => state.products);
  const cartItems = useAppSelector((state: RootState) => state.cart.products);
  const loading = useAppSelector((state: RootState) => state.loading);

  const activeCategoryName =
    menuContents.find((content) => content.ids[0].toString() === activeCategory)
      ?.name || "";

  const mergedProducts = useMemo(() => {
    console.log("ProductList: Merging products", products, cartItems);
    return products.map(product => {
      const cartItem = cartItems?.find((item: { product_id: number; }) => item.product_id === product.product_id);
      return {
        ...product,
        quantity: cartItem ? Number(cartItem.quantity) : 0,
        cart_id: cartItem ? cartItem.cart_id : undefined
      };
    });
  }, [products, cartItems]);

  console.log("ProductList: Rendered with mergedProducts", mergedProducts);

  if (loading) {
    return (
      <div className="col-span-full flex justify-center items-center py-12">
        <Loading />
      </div>
    );
  }

  if (!mergedProducts || mergedProducts.length === 0) {
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
      {mergedProducts.map((product: any, index: number) => (
        <ProductCard
          key={`${product.product_id}-${index}`}
          product={product}
          activeCategoryName={activeCategoryName}
        />
      ))}
    </div>
  );
};

export default ProductList;
