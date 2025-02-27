export default function ImageUploader() {
  const isImageUploaded = false;

  return (
    <div>
      <div>
        <h1 className="text-center text-6xl font-bold max-lg:text-5xl max-md:text-4xl max-[370px]:text-3xl">
          What's in your fridge
        </h1>
        <ol className="list-inside list-decimal text-center sm:text-left font-mono">
          <li>Take a picture of your fridge.</li>
          <li>Click Upload Image to preview.</li>
          <li>Click Submit to begin analyzing.</li>
        </ol>
      </div>

      {/* Form to upload image */}
      <div className="w-[940px] max-lg:w-full flex flex-col items-center bg-white border border-dashed border-seagull-blue rounded-2xl p-8 mt-8 gap-4">
        <form className="flex flex-col gap-4 items-center">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file-upload"
              className="bg-gray-300 hover:bg-gray-200 text-gray-00 py-2 px-4 rounded cursor-pointer"
            >
              Upload Image
            </label>
            <input type="file" accept="image/*" className="hidden" />
          </div>

          {/* Preview Image */}
          {isImageUploaded && <div> </div>}
        </form>
      </div>

      {/* Submit Button */}
      {isImageUploaded && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Submit
        </button>
      )}
    </div>
  );
}
