import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";

interface ProductItemProps {
  product: {
    product_id: number;
    name: string;
    thumb?: string;
    image?: string;
    price?: string | number;
    quantity: number;
    leadTime?: string;
  };
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  isLoading?: boolean;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  onIncrement,
  onDecrement,
  onRemove,
  isLoading = false,
}) => {
  if (!product || typeof product !== "object") {
    console.error("Invalid product data:", product);
    return null;
  }

  const formatPrice = (price: string | number | undefined): string => {
    try {
      if (typeof price === "number") {
        return price.toFixed(2);
      }
      if (typeof price === "string") {
        const numericPrice = parseFloat(price.replace(/[^0-9.-]+/g, ""));
        return isNaN(numericPrice) ? "0.00" : numericPrice.toFixed(2);
      }
      return "0.00";
    } catch (error) {
      console.error("Error formatting price:", error);
      return "0.00";
    }
  };

  const totalPrice = formatPrice(
    typeof product.price === "number"
      ? product.price * product.quantity
      : parseFloat((product.price || "0").replace(/[^0-9.-]+/g, "")) *
          product.quantity
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center py-4 border-b border-gray-200 ${
        isLoading ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="flex-shrink-0 mr-4 relative">
        <Image
          src={product?.thumb || "/images/placeholder.png"}
          alt={product?.name || ""}
          width={80}
          height={80}
          className="rounded-md object-cover h-20 w-20"
        />
        <div className="absolute -top-2 -right-3 bg-green-500 text-white rounded-full px-2 py-1 text-sm font-bold min-w-[28px] h-7 flex items-center justify-center">
          {product?.quantity}×
        </div>
      </div>
      <div className="flex-grow">
        <h3 className="font-medium text-gray-800">{product?.name}</h3>
        {product?.leadTime && (
          <p className="text-sm text-gray-500">
            Lead time: {product?.leadTime}
          </p>
        )}
        <div className="mt-3 flex items-center">
          <div className="text-gray-600 text-lg">
            {formatPrice(product?.price)} €
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 ml-4 text-right">
        <div className="font-semibold text-gray-800">{totalPrice} €</div>
      </div>
    </motion.div>
  );
};

export default ProductItem;
