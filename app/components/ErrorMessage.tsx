import React from "react";
interface ErrorMessageProps {
  message?: string; // Message is optional
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-white flex justify-center text-2xl">
      <div className="flex flex-col items-center text-m">
        <h1 className="text-red-600 font-semibold mb-2">
          Oops! Something went wrong.
        </h1>
        <p className="text-red-500">{message && `Details: ${message}`}</p>
      </div>
    </div>
  );
}
