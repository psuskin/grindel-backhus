import React, { useMemo, useState } from "react";

import { useGetPaymentMethodsQuery, useSetPaymentMethodMutation, useGetCartQuery, useSetShippingMethodMutation } from "@/services/api";
import {
  calculateExtrasTotal,
  calculateTotals,
  formatExtrasTotal,
} from "@/components/Cart/CartPriceCalculation";

interface CheckoutSidebarProps {
  totalItems: number;
  totalPrice: string;
}

const CheckoutSidebar: React.FC<CheckoutSidebarProps> = ({
  totalItems
}) => {
  const { data: cartData, isLoading: isCartLoading, error: cartError } = useGetCartQuery();
  const extrasTotal = useMemo(() => calculateExtrasTotal(cartData), [cartData]);
  const formattedExtrasTotal = useMemo(
    () => formatExtrasTotal(extrasTotal),
    [extrasTotal]
  );
  const { subTotal, totalPrice } = useMemo(
    () => calculateTotals(cartData, extrasTotal),
    [cartData, extrasTotal]
  );
  return (
    <div className="hidden lg:block lg:w-1/2 xl:w-2/5 bg-green-600 p-12">
      <div className="h-full flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">Bestellungsübersicht</h2>
          <div className="bg-green-500 bg-opacity-50 rounded-xl p-6 mb-8">
            {/* <div className="flex justify-between text-lg text-white mb-4">
              <span>Gesamte Produkte:</span>
              <span>{totalItems}</span>
            </div> */}
            <div className="flex justify-between text-2xl font-bold text-white">
              <span>Gesamtpreis:</span>
              <span>{totalPrice}</span>
            </div>
          </div>
        </div>
        {/* <div className="text-white text-opacity-80">
          <p className="mb-2">Need help? Contact us:</p>
          <p className="font-semibold">support@example.com</p>
          <p className="font-semibold">+1 (555) 123-4567</p>
        </div> */}
      </div>
    </div>
  );
};

export default CheckoutSidebar;
