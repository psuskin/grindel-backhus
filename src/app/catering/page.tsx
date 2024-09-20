"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  getPackagesAsync,
  getProductsByCategoryAsync,
  getProductByIdAsync,
} from "@/redux/thunk";
import PackageSelector from "@/components/catering/PackageSelector";
import CategorySelector from "@/components/catering/CategorySelector";
import ProductSelector from "@/components/catering/ProductSelector";

const CateringPage = () => {
  const [step, setStep] = useState(1);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getPackagesAsync());
  }, [dispatch]);

  const handlePackageSelect = (packageId: number) => {
    dispatch(getProductsByCategoryAsync(packageId.toString()));
    setStep(2);
  };

  const handleCategorySelect = (categoryId: string) => {
    dispatch(getProductsByCategoryAsync(categoryId));
    setStep(3);
  };

  const handleProductSelect = (productId: string) => {
    dispatch(getProductByIdAsync(productId));
    // Here you might want to add the product to the order or show more details
    console.log(`Selected product: ${productId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Catering Order</h1>
      {step === 1 && <PackageSelector onSelect={handlePackageSelect} />}
      {step === 2 && <CategorySelector onSelect={handleCategorySelect} />}
      {step === 3 && <ProductSelector onSelect={handleProductSelect} />}
    </div>
  );
};

export default CateringPage;
