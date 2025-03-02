
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";


const dotenv = require("dotenv");
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;


export async function POST(event) {
    if (!API_KEY) {
        return NextResponse.json({ error: "Missing API KEY.", details: "Please set GEMINI_API_KEY."}, { status: 401 });
    }

    if (event.method !== "POST") {
        return NextResponse.json({ error: "Only POST requests are allowed" }, { status: 405 });
    }
    
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" }); 
        const { imageBase64 } = await event.json();

        const prompt = "Analyze the following refrigerator image and provide the results in JSON format. Generate two lists: ingredients and exceptions. ingredients should be an array of objects, each with category, name, and quantity keys. Use numbers and units for quantities when possible (e.g., 1 pitcher, 1 bunch, 1 container). exceptions should be an array of strings."
        
        console.error("Making request to api with given input")
        const result = await model.generateContent(
            [
                {
                    inlineData: {
                        data: imageBase64,
                        mimeType: 'image/jpeg',
                    },
                },
                prompt,
            ]);
        
         const response = result.response
         const text = await response.text()

        return NextResponse.json({ output: text });
        
    } catch (error) {
        console.error("API Error:", error);
        console.log("API Error:", error);
        
        if (error instanceof Error) {
            if (error.message.includes("API key not valid")) {
                errorMessage = "Invalid API key.";
                statusCode = 401;
            } else if (error.message.includes("Rate limit exceeded")) {
                errorMessage = "Rate limit exceeded.";
                statusCode = 429;
            }
        }

        return NextResponse.json({ error: errorMessage, details: details }, { status: statusCode });
    }
};