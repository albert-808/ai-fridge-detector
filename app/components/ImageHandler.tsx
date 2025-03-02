"use client";
import React, { useState, useRef } from "react";
import IngredientsRender from "./IngredientsRender";
import CompressImage from "../utils/CompressImage";

type ImagePreview = {
  forDisplay: string;
  base64: string;
};

export default function ImageHandler() {
  const [imagePreview, setImagePreview] = useState<ImagePreview | null>(null);
  const [resultOutput, setResultOutput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isGridVisible, setIsGridVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files ? event.target.files[0] : null;

    if (imageFile) {
      setIsCompressing(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target && e.target.result) {
          try {
            const commpressedBase64Image = await CompressImage(imageFile);
            setImagePreview({
              forDisplay: e.target.result as string,
              base64: commpressedBase64Image as string,
            });
          } catch (error) {
            setErrorMessage(`Image compression error: ${error}`);
            console.error("Image compression error:", error);
          } finally {
            setIsCompressing(false);
          }
        }
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const handleSubmit = async () => {
    setIsGridVisible(true);
    if (!imagePreview) {
      setErrorMessage("No image found. Please upload an image.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/scanFridgeImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imagePreview.base64,
          prompt:
            "Analyze the following refrigerator image and provide the results in JSON format. Generate two lists: ingredients and exceptions. ingredients should be an array of objects, each with category, name, and quantity keys. Use numbers and units for quantities when possible (e.g., 1 pitcher, 1 bunch, 1 container). exceptions should be an array of strings.",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error with analyzing image:", error);
        setIsLoading(false);
        return;
      }
      const result = await response.json();
      setResultOutput(result.output);
    } catch (error) {
      console.error("Error sending requset:", error);
      setErrorMessage(`Error with sending request: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#20b2aa] bg-[url(/bg_pizza.png)] bg-center bg-no-repeat bg-blend-overlay font-sans flex justify-center items-center min-h-screen md:bg-contain sm:bg-cover">
      <div className="container">
        <div className="text-center">
          <h1 className="text-6xl text-white font-extrabold leading-tight max-lg:leading-snug max-md:leading-normal max-[370px]:leading-relaxed">
            What's in your fridge?
          </h1>
          <p className="text-lg font-bold text-white mx-auto max-w-2xl sm:text-xl pb-4 leading-relaxed">
            {" "}
            Snap a photo of your fridge and our AI will automatically identify
            and catalogue your food items to effortlessly track your groceries.{" "}
          </p>
        </div>
        <div className="container mx-auto max-w-7xl flex justify-center">
          <div
            className={
              isGridVisible
                ? "grid grid-cols-1 gap-8 lg:grid-cols-2"
                : "grid-cols-1"
            }
          >
            <div className="bg-white backdrop-blur-sm p-8 text-center shadow-md rounded-md relative z-10 w-[600px] h-full">
              <div className="bg-[#ffd700] text-black p-2 mb-4 shadow-md rounded-md w-full">
                <h2 className="text-xl font-semibold">Picture Upload</h2>
              </div>

              <p className="pb-4">
                Upload a picture by drag and drop or click and browse. Click on
                the SUBMIT button to have our AI analyze your fridge.
              </p>

              {/* Preview uploaded image */}
              {imagePreview && (
                <div className="flex justify-center mt-4">
                  <img
                    src={imagePreview.forDisplay}
                    alt="Preview"
                    className="h-full w-full rounded-lg"
                  />
                </div>
              )}

              <div
                id="uploadArea"
                className="border-2 border-dashed border-yellow-300 p-4 mb-4 rounded-md cursor-pointer hover:border-gray-400 transition-colors duration-200"
              >
                <input
                  type="file"
                  id="fileInput"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="fileInput"
                  className="bg-[#00bfff] hover:bg-blue-600 transition-colors duration-200 text-white rounded-md cursor-pointer px-4 py-2"
                >
                  {isCompressing
                    ? "Preparing Picture..."
                    : imagePreview
                    ? "Choose another file.."
                    : "Choose file.."}
                </label>
              </div>

              {/* Submit image for analyzing */}
              {imagePreview && (
                <button
                  className="bg-[#008000] hover:bg-green-300 transition-colors duration-200 text-white font-bold rounded w-full cursor-pointer py-2 px-4"
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Submit"}
                </button>
              )}
            </div>
            {isLoading && (
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
            )}
            {resultOutput && (
              <div className="h-full">
                <IngredientsRender result={resultOutput} />
              </div>
            )}
            {errorMessage && (
              <div className="text-xl font-bold text-red-20">
                ERROR: {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
