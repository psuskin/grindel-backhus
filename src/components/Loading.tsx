import React from "react";
import { Utensils } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] md:h-[70vh]">
      <div className="relative w-32 h-32">
        <div className="w-full h-full rounded-full border-4 border-gray-200 absolute overflow-hidden">
          <div className="absolute inset-0 bg-green-600 animate-wave" />
        </div>
        <div className="w-full h-full absolute flex items-center justify-center">
          <Utensils className="w-16 h-16 text-white" strokeWidth={2} />
        </div>
      </div>
      <p className="mt-4 text-emerald-500 text-sm font-medium">Loading...</p>
      <div className="mt-2 flex space-x-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-green-500 rounded-full animate-ping"
            style={{ animationDelay: `${i * 0.3}s`, animationDuration: "1.5s" }}
          />
        ))}
      </div>
    </div>
  );
}
