"use client";

import React from "react";
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
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit }) => {
  const methods = useForm<CheckoutFormData>();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleFormSubmit = async (data: CheckoutFormData) => {
    const loadingToast = toast.loading(
      "Bitte warten Sie, während Ihre Bestellung bestätigt wird. Dies kann einen Moment dauern..."
    );
    try {
      await onSubmit(data);
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
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
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
