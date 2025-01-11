"use client";

import { Suspense } from "react";

import OrderConfirmationContent from "./OrderConfirmationContent";
import OrderConfirmationLoading from "./loading";

export default function OrderConfirmation() {
  return (
    <Suspense fallback={<OrderConfirmationLoading />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
