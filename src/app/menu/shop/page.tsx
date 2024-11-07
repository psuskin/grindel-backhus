/* eslint-disable react-hooks/exhaustive-deps */
// /menu/shop/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductList from "@/components/Products/ProductList";
import Loading from "@/components/Loading";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetCartQuery, useGetMenuContentQuery } from "@/services/api";
import ExtraProductsModal from "@/components/Modals/ExtraProductsModal";

interface MenuContent {
  name: string;
  ids: number[];
  count: number;
  currentCount?: number;
}

const Shop = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const searchParams = useSearchParams();
  const menuId = searchParams.get("menu");
  const router = useRouter();
  const [showExtraProductsModal, setShowExtraProductsModal] = useState(false);

  const {
    data: cartData,
    isLoading: isCartLoading,
    refetch: refetchCart,
  } = useGetCartQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: menuContentData, isLoading: isMenuContentLoading } =
    useGetMenuContentQuery(Number(menuId));

  const currentCategory = menuContentData?.contents[activeStep];
  const menuContents = menuContentData?.contents || [];

  const getCurrentCategoryCount = () => {
    if (!currentCategory || !cartData?.cart?.menu?.contents) return 0;

    const cartCategory = cartData.cart.menu.contents.find(
      (content: any) => content.name === currentCategory.name
    );

    if (cartCategory?.currentCount !== undefined) {
      return cartCategory.currentCount;
    }

    if (cartData.products && cartData.products.length > 0) {
      const productsResponse = allProducts;

      const validProductIds = productsResponse.map((p) =>
        p.product_id.toString()
      );

      const categoryProducts = cartData.products.filter(
        (product: { product_id: any }) =>
          validProductIds.includes(product.product_id)
      );

      const count = categoryProducts.reduce(
        (sum: number, product: any) => sum + Number(product.quantity),
        0
      );

      return count;
    }

    return 0;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentCategory?.ids) return;

      setIsLoadingProducts(true);
      setAllProducts([]);

      try {
        const productPromises = currentCategory.ids.map(
          (id: { toString: () => any }) =>
            fetch(`/api/get-products-by-category`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ categoryId: id.toString() }),
            }).then((res) => res.json())
        );

        const results = await Promise.all(productPromises);
        const combinedProducts = results.reduce((acc, result) => {
          if (result.products) {
            return [...acc, ...result.products];
          }
          return acc;
        }, []);

        setAllProducts(combinedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [currentCategory?.ids]);

  // for modal watcher
  useEffect(() => {
    if (currentCategory) {
      const currentCount = getCurrentCategoryCount();
      const requiredCount = currentCategory.count || 0;

      if (currentCount === requiredCount) {
        setShowExtraProductsModal(true);
      }
    }

    const handleShowModal = () => {
      setShowExtraProductsModal(true);
    };

    window.addEventListener("showExtraProductsModal", handleShowModal);

    return () => {
      window.removeEventListener("showExtraProductsModal", handleShowModal);
    };
  }, [cartData?.products, currentCategory]);

  const handleNext = () => {
    const currentCount = getCurrentCategoryCount();
    const requiredCount = currentCategory?.count || 0;

    if (currentCount < requiredCount) {
      toast.error(
        `Please select at least ${requiredCount} ${currentCategory.name} item${
          requiredCount > 1 ? "s" : ""
        }. You have selected ${currentCount}.`
      );
      return;
    }

    if (activeStep < menuContents.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      router.push("/cart");
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleModalNext = () => {
    setShowExtraProductsModal(false);
    if (activeStep < menuContents.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      router.push("/cart");
    }
  };

  if (isCartLoading || isMenuContentLoading || isLoadingProducts)
    return <Loading />;

  return (
    <div className="min-h-screen bg-gray-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-sm rounded-xl overflow-hidden"
        >
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentCategory?.name}
                </h1>
                <span className="text-sm text-gray-500">
                  {currentCategory?.count} selections included in package
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Step {activeStep + 1} of {menuContents.length}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrevious}
                    className={`p-2 rounded-full ${
                      activeStep === 0
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                    disabled={activeStep === 0}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((activeStep + 1) / menuContents.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="p-6">
            <ProductList
              products={allProducts}
              menuContents={[currentCategory]}
              activeCategoryName={currentCategory?.name}
              currentCount={getCurrentCategoryCount()}
              requiredCount={currentCategory?.count || 0}
            />
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center">
            <button
              onClick={handlePrevious}
              className={`px-6 py-2 ${
                activeStep === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } rounded-lg transition-colors`}
              disabled={activeStep === 0}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {activeStep === menuContents.length - 1 ? "Go to Cart" : "Next"}
            </button>
          </div>
        </motion.div>
      </div>
      <ExtraProductsModal
        isOpen={showExtraProductsModal}
        onClose={() => setShowExtraProductsModal(false)}
        onNext={handleModalNext}
      />
    </div>
  );
};

export default Shop;
