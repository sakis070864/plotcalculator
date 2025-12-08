import { GoogleGenAI } from "@google/genai";
import { ProjectInputs, CalculationResults } from "../types";

// Helper to validate key
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey.length === 0 || apiKey === 'undefined') {
    throw new Error("Configuration Error: Google Gemini API Key is missing. Please add 'API_KEY' to your Vercel Environment Variables and Redeploy.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeInvestment = async (
  inputs: ProjectInputs,
  results: CalculationResults
): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `
      Act as a senior real estate development consultant specializing in the Greek market.
      Analyze the following residential development scenario:

      **Project Location:**
      - Area/City: ${inputs.location || "Greece (General)"}

      **Input Data:**
      - Plot Size: ${inputs.plotSize} m²
      - Plot Price: €${inputs.plotPrice.toLocaleString()}
      - Building Coefficient (Σ.Δ.): ${inputs.buildingCoefficient}
      - Max Buildable Area (Calculated): ${results.maxBuildableArea.toLocaleString()} m²
      - Construction Cost (excl. plot): €${inputs.constructionCostPerSqm}/m²
      - Target Sale Price: €${inputs.salePricePerSqm}/m²
      - Miscellaneous/Buffer Costs: ${inputs.miscCostsPercent}%

      **Calculated Results:**
      - Total Investment: €${results.constructionCostTotalInclPlot.toLocaleString()}
      - Effective Cost per m² (All-in): €${results.costPerSqmInclPlot.toLocaleString()}
      - Total Revenue: €${results.revenueTotal.toLocaleString()}
      - Net Profit: €${results.profitTotal.toLocaleString()}
      - Profit Margin (Net/Revenue): ${results.profitMargin.toFixed(2)}%
      - ROI (Net/Cost): ${results.roi.toFixed(2)}%

      **Task:**
      Provide a concise executive summary (max 200 words) in Markdown format.
      1. **Location Context**: Briefly mention if the costs/prices seem realistic for ${inputs.location || "the Greek market"}.
      2. **Financial Viability**: Is the margin healthy? (Standard is 15-25%).
      3. **Risk Analysis**: Highlight the biggest risk (e.g., land cost vs. buildable area).
      4. **Recommendation**: Proceed, Negotiate, or Walk Away.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return response.text || "No analysis generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Check for "Service Disabled" error (403)
    const errorMsg = error.message || JSON.stringify(error);
    if (errorMsg.includes("Generative Language API has not been used") || errorMsg.includes("SERVICE_DISABLED")) {
      throw new Error("ENABLE_API_REQUIRED");
    }

    throw new Error(error.message || "Failed to generate AI analysis.");
  }
};

export const estimatePlotPrice = async (
  location: string,
  plotSize: number
): Promise<number> => {
  try {
    const ai = getClient();
    const prompt = `
      You are a real estate valuation expert for the Greek market.
      
      Task: Estimate the current market price (Total Price in Euros) for a residential plot.
      
      Details:
      - Location: "${location}"
      - Plot Size: ${plotSize} square meters
      
      Instructions:
      1. Analyze the location value per square meter in Greece.
      2. Calculate the total plot price.
      3. Return ONLY the integer number (e.g. 150000). 
      4. Do NOT output any text, explanation, or currency symbols.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text?.trim();
    const cleanText = text?.replace(/[^0-9]/g, '');
    const price = parseInt(cleanText || '0', 10);
    
    return price;
  } catch (error: any) {
    console.error("Gemini Price Estimation Error:", error);
    
    // Check for "Service Disabled" error (403)
    const errorMsg = error.message || JSON.stringify(error);
    if (errorMsg.includes("Generative Language API has not been used") || errorMsg.includes("SERVICE_DISABLED")) {
      throw new Error("ENABLE_API_REQUIRED");
    }

    throw new Error(error.message || "Failed to estimate price.");
  }
};

export const generateDesignVisualization = async (
  imageBase64: string,
  prompt: string
): Promise<string> => {
  try {
    const ai = getClient();
    // Strip header if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          { 
            inlineData: { 
              mimeType: "image/jpeg", 
              data: base64Data 
            } 
          },
          { text: `Edit this image of a property/plot: ${prompt}. Keep it realistic.` }
        ]
      }
    });

    // Iterate parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated in response");
  } catch (error: any) {
    console.error("Gemini Image API Error:", error);

    // Check for "Service Disabled" error (403)
    const errorMsg = error.message || JSON.stringify(error);
    if (errorMsg.includes("Generative Language API has not been used") || errorMsg.includes("SERVICE_DISABLED")) {
      throw new Error("ENABLE_API_REQUIRED");
    }

    throw new Error(error.message || "Failed to generate design.");
  }
};