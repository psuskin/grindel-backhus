"use client";

import CheckoutForm, {
  CheckoutFormData,
} from "@/components/Checkout/CheckoutForm";
import { toast } from "sonner";
import { useGetCartQuery } from "@/services/api";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cartData } = useGetCartQuery();

  const handleSubmit = async (data: CheckoutFormData) => {
    try {
      if (!cartData) {
        toast.error("Ihr Warenkorb ist leer");
        return;
      }

      console.log("Submitting order with data:", {
        customerInfo: data,
        cartData: cartData,
        deliveryFee: data.deliveryFee,
      });

      const response = await fetch("/api/submit-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerInfo: data,
          cartData,
          deliveryFee: data.deliveryFee,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit order");
      }

      if (result.success) {
        toast.success("Bestellung erfolgreich aufgegeben!");
        router.push(`/order-confirmation?orderNumber=${result.orderNumber}`);
      } else {
        throw new Error(result.message || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Fehler beim Aufgeben der Bestellung"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <CheckoutForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
