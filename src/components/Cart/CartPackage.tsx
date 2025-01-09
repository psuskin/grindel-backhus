import React from "react";
import { motion } from "framer-motion";
import { Trash2, Loader2, X } from "lucide-react";
import { getPackageMenuId, getMenuContents } from "@/utils/menuUtils";
import { CartProduct, PackageOrder } from "@/types/packageOrders";
import CartItem from "./CartItem";

interface CartPackageProps {
  pkg: PackageOrder;
  cartData: any;
  onIncrement: (item: CartProduct) => void;
  onDecrement: (item: CartProduct) => void;
  onRemove: (item: CartProduct) => void;
  loadingStates: { [key: string]: boolean };
  isDeleting: boolean;
  handleDeletePackage: () => void;
}

export const CartPackage: React.FC<CartPackageProps> = ({
  pkg,
  cartData,
  onIncrement,
  onDecrement,
  onRemove,
  loadingStates,
  isDeleting,
  handleDeletePackage,
}) => {
  const getGroupedProducts = () => {
    const groupedProducts: { [key: string]: CartProduct[] } = {};

    if (pkg.products && typeof pkg.products === "object") {
      // Get menu contents from cart data or fallback
      const menuId = getPackageMenuId(pkg.package);
      const menuContents =
        cartData?.cart?.menu?.contents ||
        (menuId ? getMenuContents(menuId) : []);

      Object.entries(pkg.products).forEach(([categoryId, products]) => {
        if (!Array.isArray(products)) return;

        // Find category name from menu contents or fallback
        let categoryName = "Andere";

        if (menuContents?.length > 0) {
          // Try to find category in cart menu contents
          const category = menuContents.find((content: { ids: number[] }) =>
            content?.ids?.includes(parseInt(categoryId))
          );

          if (category?.name) {
            categoryName = category.name;
          } else {
            // Try fallback menu contents
            const fallbackContents = menuId ? getMenuContents(menuId) : [];
            const fallbackCategory = fallbackContents.find((content) =>
              content.ids?.includes(parseInt(categoryId))
            );
            if (fallbackCategory?.name) {
              categoryName = fallbackCategory.name;
            }
          }
        }

        // Initialize category array if needed
        if (!groupedProducts[categoryName]) {
          groupedProducts[categoryName] = [];
        }

        // Add products to category
        products.forEach((product) => {
          if (product) {
            groupedProducts[categoryName].push(product);
          }
        });
      });
    }

    return groupedProducts;
  };

  const groupedProducts = getGroupedProducts();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8 bg-white rounded-lg shadow-sm p-6"
    >
      {/* Package Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-medium text-gray-800">
            {pkg.package}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({pkg.guests} Guests)
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-lg font-medium text-green-600">
            {pkg.price}€
          </span>
          <button
            onClick={handleDeletePackage}
            disabled={isDeleting}
            className="p-1 hover:bg-red-50 rounded-full transition-colors group"
          >
            {isDeleting ? (
              <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <X className="w-5 h-5 text-red-400 group-hover:text-red-500" />
            )}
          </button>
        </div>
      </div>

      {/* Products by Category */}
      {Object.entries(groupedProducts).map(([categoryName, products]) => (
        <div key={categoryName} className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            {categoryName}
          </h3>
          {products.map((item: CartProduct) => (
            <CartItem
              key={item.cart_id}
              item={item}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              onRemove={onRemove}
              isLoading={loadingStates[item.cart_id]}
            />
          ))}
        </div>
      ))}
    </motion.div>
  );
};
export default CartPackage;
