"use client";

import React, { useState } from "react";
import IngredientsRender from "./components/IngredientsTable";
import CompressImage from "./utils/CompressImage";
import PageHeader from "./components/PageHeader";
import ImageUpload from "./components/ImageUpload";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";

type ImagePreview = {
  forDisplay: string;
  base64: string;
};

export default function Home() {
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
            console.error("Image compression error:", error);
            console.log(`Image compression error: ${error}`);
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
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imagePreview.base64,
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
    <div className="bg-[#20b2aa] bg-[url(/bg_pizza.png)] bg-center bg-no-repeat bg-blend-overlay font-sans flex justify-center items-center min-h-screen bg-cover">
      <div className="container">
        <PageHeader
          title="What's in your fridge?"
          subtitle="Snap a photo of your fridge and our AI will automatically identify and catalogue your food items to effortlessly track your groceries."
        />
        <div className="container mx-auto max-w-7xl flex justify-center">
          <div
            className={
              isGridVisible
                ? "grid grid-cols-1 gap-8 lg:grid-cols-2"
                : "grid-cols-1"
            }
          >
            <ImageUpload
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              isCompressing={isCompressing}
            />
            {isLoading && <LoadingSpinner />}
            {resultOutput && <IngredientsRender result={resultOutput} />}
            {errorMessage && <ErrorMessage message={errorMessage} />}
          </div>
        </div>
      </div>
    </div>
  );
}
