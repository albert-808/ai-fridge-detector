"use Client";

export default function CleanAndParseJson(jsonString: string) {
  if (typeof jsonString !== "string") {
    return { error: "Input must be a string." };
  }

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
    if (e instanceof SyntaxError) {
      console.error("JSON parsing error:", e.message, "String:", trimmedString);
      return {
        error: `Invalid JSON: ${e.message}`,
        originalString: trimmedString,
      };
    } else {
      console.error(
        "Unexpected error parsing JSON:",
        e,
        "String:",
        trimmedString
      );
      return {
        error: "Unexpected error parsing JSON.",
        originalString: trimmedString,
      };
    }
  }
}
