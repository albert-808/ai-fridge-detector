### Fridge Ingredient Detector with AI

The AI Fridge Detector web application makes use of AI powered analysis to scan the contents of your fridge to provide an automated way to track your refrigerator's contents.

Click [here](https://ai-fridge-detector.vercel.app/) for link to app

## Prerequisites

* Node.js (latest LTS recommended) and npm
* A Google Cloud Platform (GCP) account with the necessary API enabled.
* A Vercel account.

## Local Setup

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd <your-repository-name>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Google API credentials:**

    * Go to the Google Cloud Console and follow instructions to obtain your API key.
    * Create a `.env.local` file in the root of your project and add your API key with `GEMINI_API_KEY=your_api_key`.

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open your browser and navigate to `http://localhost:3000`.

## Making Changes to Code

* The `main` branch is configured for production deployments on Vercel.
* All production-ready code should be merged into the `main` branch.
* Fork the branch and open a pull request with your changes.

## Chosen Tech Stack

*  **Frontend:** Next.js v15 (framework) and React
*  **Backend:** Vercel (for serverless deployment)
*  **UI Layer:** Tailwind CSS for styling
*  **AI Component:** Gemini 2.0-flash-lite 

## Chosen AI Approach
* Choice of AI for the project is The Google Gemini Model (2.0 flash lite) its multimodal capabilities in recognising images and text. In addition this model has a free tier that provides good cost efficiency and low latency.

## Challenges
**AI Limitation**
- The accuracy and consistency of the image analysis lead to some items being misintereted or missed. Solution was to awknowledge that current AI models aren't perfect.
- Difficulty with reliably extracting structured data from the AI's output. The solution was to add steps for post process after extrations and add additional error handling.

**Deployment with Vercel**
- The runtime on their free (hobby) tier starts with a soft cap of 10s which is too short for more complex image analysis. The solution was to set runtime to the max threshold of 60s allowed for the given tier.Other deployment solutions (eg. cloud options, paywall) may be needed in the future for scalability.

**Base64 payload**
- Converting images to base64 can lead to large payloads which can affect performance. The solution was to compress the image to reduce size for data transfer.
