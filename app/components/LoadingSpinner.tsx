// LoadingSpinner.tsx
import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center shadow-2xl">
      <div className="p-8 rounded-lg font-bold text-center">
        <img
          src="/pizza_loader.gif"
          alt="Loading..."
          width={150}
          height={150}
          className="rounded-full"
        />
        <p>Loading...</p>
      </div>
    </div>
  );
}
