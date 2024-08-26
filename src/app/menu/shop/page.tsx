"use client";

import { useState } from "react";
import { MdFilterList } from "react-icons/md";
import { IoChevronDownOutline } from "react-icons/io5";
import ProductCard from "@/components/Products/ProductCard";

import { useProductFilters } from "@/hooks/useProductFilters";
import { FilterSidebar } from "@/components/Products/FilterSidebar";
import Loading from "@/components/Loading";

const Shop = () => {
  const {
    products,
    loading,
    filters,
    sortBy,
    handleFilterChange,
    handleSortChange,
  } = useProductFilters();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
 
  return (
    <div className="mt-16 container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mt-10">Our Menu</h1>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="md:hidden flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          <MdFilterList size={20} />
          <span>Filters</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          isFilterOpen={isFilterOpen}
        />

        <main className="w-full md:w-3/4">
          <div className="flex justify-end mb-4">
            <div className="relative inline-block w-64">
              <select
                className="appearance-none w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ease-in-out cursor-pointer"
                onChange={(e) => handleSortChange(e.target.value)}
                value={sortBy}
              >
                <option value="standard">Standard</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <IoChevronDownOutline className="h-5 w-5" />
              </div>
            </div>
          </div>

          {loading ? (
            <Loading />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-xl font-semibold text-gray-600">
                No products match your current selection.
              </h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your filters or browse our full menu.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
