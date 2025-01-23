"use client";

import React, { useState, useEffect } from "react";
import {
  useForm,
  Controller,
  useFormContext,
  FormProvider,
} from "react-hook-form";
import { motion } from "framer-motion";
import { Loader2, CreditCard, User, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => Promise<void>;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryFee?: number;
}

interface DeliveryResponse {
  success: boolean;
  isDeliveryAvailable: boolean;
  message: string;
  deliveryFee?: number;
  fullAddress?: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit }) => {
  const [isValidatingAddress, setIsValidatingAddress] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<{
    isValid: boolean;
    fee: number | null;
    message: string;
    status: "success" | "warning" | "error";
  } | null>(null);

  const methods = useForm<CheckoutFormData>();
  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const address = watch("address");
  const city = watch("city");
  const postalCode = watch("postalCode");

  // Validate delivery address when address fields change
  useEffect(() => {
    const validateDelivery = async () => {
      if (address && city && postalCode) {
        setIsValidatingAddress(true);
        try {
          const response = await fetch("/api/check-delivery", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ address, city, postalCode }),
          });

          const result: DeliveryResponse = await response.json();

          setDeliveryInfo({
            isValid: result.isDeliveryAvailable,
            fee: result.deliveryFee || null,
            message: result.message,
            status: result.isDeliveryAvailable
              ? result.deliveryFee === 0
                ? "success"
                : "warning"
              : "error",
          });
        } catch (error) {
          setDeliveryInfo({
            isValid: false,
            fee: null,
            message: "Fehler bei der Überprüfung der Lieferadresse.",
            status: "error",
          });
        } finally {
          setIsValidatingAddress(false);
        }
      }
    };

    const debounceTimer = setTimeout(validateDelivery, 1000);
    return () => clearTimeout(debounceTimer);
  }, [address, city, postalCode]);

  const handleFormSubmit = async (data: CheckoutFormData) => {
    if (!deliveryInfo?.isValid) {
      toast.error("Bitte geben Sie eine gültige Lieferadresse ein.");
      return;
    }

    const loadingToast = toast.loading(
      "Bitte warten Sie, während Ihre Bestellung bestätigt wird. Dies kann einen Moment dauern..."
    );
    try {
      await onSubmit({
        ...data,
        deliveryFee: deliveryInfo.fee || 0,
      });
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <Card className="border-green-100">
        <CardHeader className="bg-green-50/50">
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Bestellung abschließen
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            Bitte füllen Sie die folgenden Informationen aus
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-green-100">
                  <User className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    Persönliche Informationen
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    name="firstName"
                    label="Vorname"
                    control={methods.control}
                    rules={{ required: "Vorname ist erforderlich" }}
                  />
                  <FormField
                    name="lastName"
                    label="Nachname"
                    control={methods.control}
                    rules={{ required: "Nachname ist erforderlich" }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    name="email"
                    label="E-Mail"
                    control={methods.control}
                    rules={{
                      required: "E-Mail ist erforderlich",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Ungültige E-Mail-Adresse",
                      },
                    }}
                  />
                  <FormField
                    name="phone"
                    label="Telefonnummer"
                    control={methods.control}
                    rules={{ required: "Telefonnummer ist erforderlich" }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-green-100">
                  <MapPin className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    Lieferadresse
                  </h3>
                </div>
                <FormField
                  name="address"
                  label="Adresse"
                  control={methods.control}
                  rules={{ required: "Adresse ist erforderlich" }}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    name="city"
                    label="Stadt"
                    control={methods.control}
                    rules={{ required: "Stadt ist erforderlich" }}
                  />
                  <FormField
                    name="postalCode"
                    label="PLZ"
                    control={methods.control}
                    rules={{ required: "PLZ ist erforderlich" }}
                  />
                </div>

                {/* Delivery Information Display */}
                {isValidatingAddress && (
                  <div className="flex items-center justify-center text-gray-500 mt-4">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Überprüfe Lieferadresse...</span>
                  </div>
                )}

                {deliveryInfo && (
                  <div
                    className={`p-4 rounded-lg mt-4 ${
                      deliveryInfo.status === "success"
                        ? "bg-green-100 border-green-200 text-green-700"
                        : deliveryInfo.status === "warning"
                        ? "bg-green-100 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-700"
                    } border`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex-1">{deliveryInfo.message}</span>
                      {/* Only show fee for 5-20km range */}
                      {deliveryInfo.isValid && deliveryInfo.fee === 15 && (
                        <span className="font-bold ml-4 whitespace-nowrap text-green-700 text-xl">
                          15€
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    isValidatingAddress ||
                    !deliveryInfo?.isValid
                  }
                  className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 text-white transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      <span>Wird verarbeitet...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      <span>Bestellung aufgeben</span>
                    </>
                  )}
                </Button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  Ihre Daten werden sicher übertragen und verschlüsselt
                </p>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface FormFieldProps {
  name: keyof CheckoutFormData;
  label: string;
  control: any;
  rules: any;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  control,
  rules,
}) => {
  const {
    formState: { errors },
  } = useFormContext<CheckoutFormData>();

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-gray-700">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <div>
            <Input
              {...field}
              id={name}
              placeholder={label}
              className={`focus-visible:ring-green-500 transition-all duration-200 ${
                errors[name]
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "border-gray-200 hover:border-green-300"
              }`}
            />
            {errors[name] && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <span className="mr-1">•</span>
                {errors[name]?.message as string}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default CheckoutForm;
