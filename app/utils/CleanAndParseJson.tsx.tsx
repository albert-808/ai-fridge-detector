"use Client";
import { useState } from "react";

export default function CleanAndParseJson(jsonString: string) {
  let trimmedString = jsonString.trim();

  // Returned JSON from gemini API has fomat ````json {json_data}````
  if (trimmedString.startsWith("```json")) {
    let startIndex = 7;
    while (
      startIndex < trimmedString.length &&
      /\s/.test(trimmedString[startIndex])
    ) {
      startIndex++;
    }
    trimmedString = trimmedString.slice(startIndex);
  }

  if (trimmedString.endsWith("```")) {
    let endIndex = trimmedString.length - 3;
    while (endIndex > 0 && /\s/.test(trimmedString[endIndex - 1])) {
      endIndex--;
    }
    trimmedString = trimmedString.slice(0, endIndex);
  }

  try {
    return JSON.parse(trimmedString);
  } catch (e) {
    console.log("Invalid JSON after cleaning.");
  }
}
