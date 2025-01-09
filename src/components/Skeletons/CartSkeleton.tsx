import React from "react";
import { ShoppingBag, ChevronLeft } from "lucide-react";

export const CartItemSkeleton = () => {
  return (
    <div className="flex items-center py-4 border-b border-gray-200 animate-pulse">
      {/* Product Image and Quantity Badge */}
      <div className="flex-shrink-0 mr-4 relative">
        <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-gray-200 rounded-full"></div>
      </div>

      {/* Product Details */}
      <div className="flex-grow">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-24"></div>
      </div>

      {/* Total Price */}
      <div className="flex-shrink-0 ml-4 text-right">
        <div className="h-6 bg-gray-200 rounded w-20 ml-auto"></div>
      </div>
    </div>
  );
};

const PackageSkeleton = () => {
  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm p-6 animate-pulse">
      {/* Package Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <div>
          <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Category and Items */}
      <div className="mb-6">
        <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
        {[1, 2].map((item) => (
          <CartItemSkeleton key={item} />
        ))}
      </div>
    </div>
  );
};

const CartSkeleton = () => {
  return (
    <div className="min-h-screen py-24 px-4 md:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          {/* Header Skeleton */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-gray-100 p-2 rounded-lg mr-3">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-lg mr-2"></div>
              <div className="h-5 bg-gray-200 rounded w-32"></div>
            </div>
          </div>

          {/* Packages */}
          {[1, 2].map((pkg) => (
            <PackageSkeleton key={pkg} />
          ))}

          {/* Totals */}
          <div className="mt-12 border-t pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div className="w-full md:w-auto mb-6 md:mb-0">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center min-w-[240px]">
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-px bg-gray-200 my-2"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-28"></div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <div className="h-14 bg-gray-200 rounded-md w-full md:w-[200px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;
