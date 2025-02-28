"use Client";

import React, { useState, useEffect } from "react";
import cleanAndParseJson from "../utils/CleanAndParseJson.tsx";

interface IngredientsResponse {
  result: string;
}

interface IngredientDetails {
  category: string;
  name: string;
  quantity: string;
}

interface IngredientList {
  ingredients: IngredientDetails[];
}

export default function IngredientsRender(
  ingredientResponse: IngredientsResponse
) {
  const [parsedJson, setParsedJson] = useState<IngredientList | null>(null);

  console.log("Rendering ingredient list");
  console.log(typeof ingredientResponse);
  console.log(ingredientResponse);

  useEffect(() => {
    if (ingredientResponse) {
      setParsedJson(cleanAndParseJson(ingredientResponse.result));
    }
  }, [ingredientResponse]);

  const ingredientList = parsedJson?.ingredients || [];
  ingredientList &&
    ingredientList.sort((a, b): any => {
      if (a.category < b.category) return -1;
      if (a.category > b.category) return 1;

      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
    });

  return (
    <div className="justify-center bg-white rounded-lg shadow-md p-4 w-full max-w-2xl">
      <h2 className="text-xl font-semibold mb-1">Fridge Contents </h2>
      <h3 className="text-s text-gray-400 mb-4">
        {ingredientList.length} Ingredients
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ingredient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ingredientList.map((item) => (
              <tr key={item.name}>
                <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
