
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";


const dotenv = require("dotenv");
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;


export async function POST(event) {
    console.log(API_KEY?"Key is here": "Non Key found")
    
    if (event.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); 
        const { imageBase64, prompt } = await event.json();
        
        console.log("starting route")
        const result = await model.generateContent([
            {
            inlineData: {
                data: imageBase64,
                mimeType: 'image/jpeg',
              },
            },
            prompt,
          ]);
        console.log("Request completed")
        const response = result.response
        const text = await response.text()

        console.log("Response completed")
        return NextResponse.json({ output: text });
        
    } catch (error) {
        console.error("Route error:", error);
    }};