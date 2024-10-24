import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft } from "lucide-react";

interface ReviewStepProps {
  checkoutData: any;
  onBack: () => void;
  onConfirm: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  checkoutData,
  onBack,
  onConfirm,
}) => {
  const getPaymentMethodName = (code: string) => {
    switch (code) {
      case "cod.cod":
        return "Cash on Delivery";
      case "free_checkout.free_checkout":
        return "Free Check Out";
      default:
        return "Unknown Payment Method";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
        Review Your Order
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
          <p>{getPaymentMethodName(checkoutData.paymentMethod)}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
          <p>{`${checkoutData.shippingAddress.firstname} ${checkoutData.shippingAddress.lastname}`}</p>
          <p>{checkoutData.shippingAddress.address_1}</p>
          <p>{`${checkoutData.shippingAddress.city}, ${checkoutData.shippingAddress.zone_id} ${checkoutData.shippingAddress.country_id}`}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Billing Address</h3>
          <p>{`${checkoutData.paymentAddress.firstname} ${checkoutData.paymentAddress.lastname}`}</p>
          <p>{checkoutData.paymentAddress.address_1}</p>
          <p>{`${checkoutData.paymentAddress.city}, ${checkoutData.paymentAddress.zone_id} ${checkoutData.paymentAddress.country_id}`}</p>
        </div>
      </div>
      <div className="flex space-x-4 mt-8">
        <button
          onClick={onBack}
          className="w-1/2 bg-gray-200 text-gray-800 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="mr-2 w-5 h-5" /> Back
        </button>
        <button
          onClick={onConfirm}
          className="w-1/2 bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
        >
          Confirm Order
        </button>
      </div>
    </motion.div>
  );
};

export default ReviewStep;
