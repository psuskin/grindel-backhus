// /menu/shop/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import ProductList from "@/components/Products/ProductList";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { getCartAsync, getProductsByCategoryAsync } from "@/redux/thunk";
import { resetProducts } from "@/redux/actions";
import Loading from "@/components/Loading";
import { toast } from "sonner";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MenuContent {
  name: string;
  ids: number[];
  count: number;
  currentCount?: number;
}

const Shop = () => {
  const [menuContents, setMenuContents] = useState<MenuContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const searchParams = useSearchParams();
  const menuId = searchParams.get("menu");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const cartItems = useAppSelector((state: RootState) => state.cart.products);
  const cartContents = useAppSelector(
    (state: RootState) => state.cart.cart?.menu?.contents
  );

  useEffect(() => {
    const fetchMenuContent = async () => {
      if (menuId) {
        try {
          const response = await axios.post("/api/get-menu-content", {
            menu: menuId,
          });
          if (response.data.contents) {
            setMenuContents(response.data.contents);
            dispatch(
              getProductsByCategoryAsync(
                response.data.contents[0].ids[0].toString()
              )
            );
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
    dispatch(getCartAsync());

    return () => {
      dispatch(resetProducts());
    };
  }, [menuId, dispatch]);

  const handleNext = () => {
    const currentCategory = cartContents?.[activeStep];

    if (currentCategory?.name === "Salate") {
      const requiredCount = currentCategory.count || 2;
      const currentCount = currentCategory.currentCount || 0;

      if (currentCount < requiredCount) {
        toast.error(
          `Please select at least ${requiredCount} Salate items. You have selected ${currentCount}.`
        );
        return;
      }
    }

    if (activeStep < (cartContents?.length || 0) - 1) {
      setActiveStep((prevStep) => prevStep + 1);
      dispatch(
        getProductsByCategoryAsync(
          cartContents[activeStep + 1].ids[0].toString()
        )
      );
    } else {
      router.push("/cart");
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      const newStep = activeStep - 1;
      setActiveStep(newStep);
      const previousCategory = cartContents?.[newStep] || menuContents[newStep];
      dispatch(getProductsByCategoryAsync(previousCategory.ids[0].toString()));
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center mt-20">{error}</div>;

  const currentCategory = cartContents?.[activeStep] || menuContents[activeStep];

  return (
    <div className="min-h-screen bg-gray-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-sm rounded-xl overflow-hidden"
        >
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">{currentCategory?.name}</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Step {activeStep + 1} of {cartContents?.length || menuContents.length}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrevious}
                    className={`p-2 rounded-full ${
                      activeStep === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
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
                style={{ width: `${((activeStep + 1) / (cartContents?.length || menuContents.length)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="p-6">
            <ProductList
              menuContents={[currentCategory]}
              activeCategory={currentCategory?.ids[0].toString()}
            />
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center">
            <button
              onClick={handlePrevious}
              className={`px-6 py-2 ${
                activeStep === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } rounded-lg transition-colors`}
              disabled={activeStep === 0}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {activeStep === (cartContents?.length || menuContents.length) - 1 ? "Go to Cart" : "Next"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Shop;
