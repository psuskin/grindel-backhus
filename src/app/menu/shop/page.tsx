// /menu/shop/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import ProductList from "@/components/Products/ProductList";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { getProductsByCategoryAsync } from "@/redux/thunk";
import { resetProducts, setActiveCategoryName } from "@/redux/actions";
import Loading from "@/components/Loading";

interface MenuContent {
  name: string;
  ids: number[];
  count: number;
}

const Shop = () => {
  const [menuContents, setMenuContents] = useState<MenuContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const menuId = searchParams.get("menu");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchMenuContent = async () => {
      if (menuId) {
        try {
          const response = await axios.post("/api/get-menu-content", {
            menu: menuId,
          });
          if (response.data.contents) {
            setMenuContents(response.data.contents);
            if (
              response.data.contents.length > 0 &&
              response.data.contents[0].ids.length > 0
            ) {
              const firstCategoryId =
                response.data.contents[0].ids[0].toString();
              setActiveCategory(firstCategoryId);
              dispatch(getProductsByCategoryAsync(firstCategoryId));
            }
          } else {
            setError("No menu contents found");
          }
        } catch (error) {
          console.error("Failed to fetch menu content:", error);
          setError("Failed to fetch menu content");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMenuContent();

    return () => {
      dispatch(resetProducts());
    };
  }, [menuId, dispatch]);

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    setActiveCategory(categoryId);
    dispatch(setActiveCategoryName(categoryName));
    dispatch(getProductsByCategoryAsync(categoryId));
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center mt-20">{error}</div>;

  return (
    <div className="mt-20 container mx-auto px-4 min-h-screen pb-20">
      <div className="overflow-x-auto whitespace-nowrap pb-4 mb-8">
        <div className="inline-flex space-x-4 mt-10">
          {menuContents.map((content, index) => (
            <button
              key={index}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-colors ${
                activeCategory === content.ids[0].toString()
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() =>
                handleCategoryClick(content.ids[0].toString(), content.name)
              }
            >
              {content.name}
            </button>
          ))}
        </div>
      </div>
      <ProductList
        menuContents={menuContents}
        activeCategory={activeCategory}
      />
    </div>
  );
};

export default Shop;
