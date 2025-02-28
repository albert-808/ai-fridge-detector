"use client";
import React, { useState, useRef } from "react";
import IngredientsRender from "./IngredientsRender";

export default function ImageHandler() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [resultOutput, setResultOutput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Image is set as a base64 payload
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imagePreview) {
      setErrorMessage("No image found. Please upload an image.");
      return;
    }
    try {
      const response = await fetch("/api/scanFridgeImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imagePreview.split(",")[1],
          prompt:
            'Analyze the following refrigerator image and provide the results in JSON format. Generate two lists: \'ingredients\' and \'exceptions\'. \'ingredients\' should be an array of objects, each with \'category\', \'name\', and \'quantity\' keys. Use numbers for quantities when possible (e.g., \'1 pitcher, \'1 bunch\', \'1 container\'). \'exceptions\' should be an array of strings. Example: {"ingredients": [{"category": "produce", "name": "lettuce", "quantity": "0.5 head"}, {"category": "produce", "name": "apples", "quantity": "3"}], "exceptions": ["medicine", "cleaning supplies"]}',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error with analyzing image:", error);
      }

      const result = await response.json();
      setResultOutput(result.output);
    } catch (error) {
      console.error("Error sending requset:", error);
      setErrorMessage("Error with sending request.");
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-center text-6xl font-bold max-lg:text-5xl max-md:text-4xl max-[370px]:text-3xl">
          What's in your fridge
        </h1>
        <ol className="list-inside list-decimal text-center font-mono">
          <li>Take a picture of your fridge.</li>
          <li>Click Upload Image to preview.</li>
          <li>Click Submit to begin analyzing.</li>
        </ol>
      </div>
      {/* Form to upload an image */}
      <div className="w-[940px] max-lg:w-full flex flex-col items-center bg-white border border-dashed rounded-2xl p-8 mt-8 gap-4">
        <form className="flex flex-col gap-4 items-center">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file-upload"
              className="bg-gray-300 hover:bg-gray-200 text-gray-00 py-2 px-4 rounded cursor-pointer"
            >
              Upload Image
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          {/* Preview uploaded image */}
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-xs max-h-64 rounded-lg shadow-md"
              />
            </div>
          )}
        </form>
      </div>
      {/* Submit image for analyzing */}
      {imagePreview && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
          onClick={handleSubmit}
        >
          Submit
        </button>
      )}
      {errorMessage && (
        <div className="text-xl font-bold text-red-20">
          ERROR: {errorMessage}
        </div>
      )}
      {resultOutput && (
        <div className="mt-8">
          <IngredientsRender result={resultOutput} />
        </div>
      )}
    </div>
  );
}
