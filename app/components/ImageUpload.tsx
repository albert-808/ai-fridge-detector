// ImageUpload.tsx
import React from "react";

interface ImageUploadProps {
  imagePreview: { forDisplay: string; base64: string } | null;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isCompressing: boolean;
}

export default function ImageUpload({
  imagePreview,
  onImageChange,
  onSubmit,
  isLoading,
  isCompressing,
}: ImageUploadProps) {
  return (
    <div className="bg-white backdrop-blur-sm p-8 text-center shadow-md rounded-md relative z-10 w-[600px] h-full">
      <div className="bg-[#ffd700] text-black p-2 mb-4 shadow-md rounded-md w-full">
        <h2 className="text-xl font-semibold">Picture Upload</h2>
      </div>

      <p className="pb-4">
        Upload a picture by drag and drop or click and browse. Click on the
        SUBMIT button to have our AI analyze your fridge.
      </p>

      {imagePreview && (
        <div className="flex justify-center mt-4">
          <img
            src={imagePreview.forDisplay}
            alt="Preview"
            className="h-full w-full rounded-lg"
          />
        </div>
      )}

      <div className="border-2 border-dashed border-yellow-300 p-4 mb-4 rounded-md cursor-pointer hover:border-gray-400 transition-colors duration-200">
        <input
          type="file"
          id="fileInput"
          multiple
          className="hidden"
          onChange={onImageChange}
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

      {imagePreview && (
        <button
          className="bg-[#008000] hover:bg-green-300 transition-colors duration-200 text-white font-bold rounded w-full cursor-pointer py-2 px-4"
          type="submit"
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
      )}
    </div>
  );
}
