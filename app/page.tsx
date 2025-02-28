"use client";

import ImageHandler from "./components/ImageHandler";

export default function Home() {
  return (
    <div className="grid grid-rows-1 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <ImageHandler />
    </div>
  );
}
