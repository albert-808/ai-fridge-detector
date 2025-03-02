import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="text-center">
      <h1 className="text-6xl text-white font-extrabold leading-tight max-lg:leading-snug max-md:leading-normal max-[370px]:leading-relaxed">
        {title}
      </h1>
      <p className="text-lg font-bold text-white mx-auto max-w-2xl sm:text-xl pb-4 leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}
