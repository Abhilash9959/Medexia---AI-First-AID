import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
// You'll need to add your API key to your environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Function to convert file to base64 data URL
async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
  
  return {
    inlineData: { 
      data: await base64EncodedDataPromise,
      mimeType: file.type
    },
  };
}

// Function to analyze injuries from images
export async function analyzeInjuryImage(imageFile, additionalContext = "") {
  try {
    // For multimodal model (handles images)
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    const imagePart = await fileToGenerativePart(imageFile);
    
    const prompt = `
      You are an emergency medical expert specializing in trauma and injury assessment.
      
      Analyze this image and identify the SPECIFIC TYPE OF INJURY with high precision.
      
      First, determine the exact injury type from this list (but don't limit yourself to only these):
      - Head trauma (concussion, skull fracture, etc.)
      - Facial injury (eye trauma, broken nose, jaw fracture, etc.)
      - Laceration (cut wound with irregular edges)
      - Incision (clean-cut wound with straight edges)
      - Abrasion/Road rash (scraping of skin surface)
      - Contusion/Bruise (bleeding under the skin)
      - Hematoma (collection of blood outside blood vessels)
      - Burn (thermal, chemical, electrical, radiation)
      - Fracture (broken bone)
      - Dislocation (joint displacement)
      - Sprain (ligament injury)
      - Strain (muscle or tendon injury)
      - Puncture wound (deep, narrow wound)
      - Crush injury (compression damage)
      - Amputation (loss of body part)
      - Avulsion (tissue torn away)
      - Bleeding (external or internal blood loss)
      - Bite (animal or human)
      - Sting (insect, marine animal, etc.)
      - Shock (inadequate blood flow)
      - Swelling (edema)
      - Inflammation (redness, heat, pain)
      
      Then provide a detailed analysis covering:
      
      1. PRIMARY INJURY ASSESSMENT:
         - EXACT INJURY TYPE (be very specific, not just "injury")
         - Precise anatomical location
         - Visible signs and symptoms
         - Suspected underlying damage
      
      2. SEVERITY CLASSIFICATION:
         - Rate severity (mild, moderate, severe, life-threatening)
         - Key indicators of severity visible in the image
         - Potential immediate complications
      
      3. EMERGENCY RESPONSE NEEDED:
         - Is this a medical emergency? (Yes/No)
         - Timeframe for seeking medical attention (immediate, within hours, within 24 hours, etc.)
         - Warning signs that would indicate worsening condition
      
      4. FIRST AID INSTRUCTIONS:
         - Step-by-step immediate care instructions
         - Do's and Don'ts for this specific injury
         - Pain management recommendations
      
      Additional patient context: ${additionalContext}
      
      IMPORTANT: Your analysis MUST begin with a single line containing ONLY the specific injury type and location in this exact format:
      "INJURY_TYPE: [Specific injury name] - [Body location] - [Severity]"
      
      Example formats:
      "INJURY_TYPE: Laceration - Left forearm - Moderate"
      "INJURY_TYPE: Concussion - Head - Severe"
      "INJURY_TYPE: Burn - Right hand - 2nd degree"
      
      The [Specific injury name] MUST be one of the specific injury types listed above, not just "Injury".
      This line must be concise (maximum 60 characters) and contain only the injury type, location, and severity.
      If you cannot determine a specific injury type with reasonable confidence, use "INJURY_TYPE: Unidentifiable injury".
    `;
    
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const fullText = response.text();
    
    // Extract the specific injury type from the response with improved regex
    const injuryTypeMatch = fullText.match(/INJURY_TYPE:\s*(.+?)(?:\n|$)/i);
    let specificInjuryType = injuryTypeMatch ? injuryTypeMatch[1].trim() : "Unspecified injury";
    
    // Extract components from the injury type string
    let injuryName = specificInjuryType;
    let bodyLocation = "";
    let severity = "Moderate"; // Default severity
    
    // Parse the injury type string to extract components
    const parts = specificInjuryType.split('-').map(part => part.trim());
    if (parts.length >= 2) {
      injuryName = parts[0];
      bodyLocation = parts[1];
      
      if (parts.length >= 3) {
        severity = parts[2];
      }
    }
    
    // If we still have a generic "injury" type, try to extract from the full text
    if (injuryName.toLowerCase() === "injury" || injuryName.toLowerCase() === "unspecified injury") {
      // Look for specific injury mentions in the first few lines
      const firstFewLines = fullText.split('\n').slice(0, 10).join(' ').toLowerCase();
      const injuryTypes = [
        "burn", "laceration", "cut", "fracture", "sprain", "strain", 
        "bruise", "contusion", "abrasion", "puncture", "bite", "sting",
        "concussion", "dislocation", "bleeding", "wound", "trauma"
      ];
      
      for (const type of injuryTypes) {
        if (firstFewLines.includes(type)) {
          injuryName = type.charAt(0).toUpperCase() + type.slice(1);
          break;
        }
      }
    }
    
    // Normalize severity
    if (severity.toLowerCase().includes("mild")) {
      severity = "Mild";
    } else if (severity.toLowerCase().includes("moderate")) {
      severity = "Moderate";
    } else if (severity.toLowerCase().includes("severe") || 
               severity.toLowerCase().includes("life-threatening")) {
      severity = "Severe";
    }
    
    // Return both the specific injury type and the full analysis
    return {
      injuryType: injuryName,
      bodyLocation: bodyLocation,
      severity: severity,
      fullAnalysis: fullText
    };
  } catch (error) {
    console.error("Error analyzing injury image:", error);
    throw new Error("Failed to analyze the image. Please try again.");
  }
}

// Function to get treatment recommendations based on injury analysis
export async function getTreatmentRecommendations(injuryDescription, injuryType) {
  try {
    // For text-only queries
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      You are an emergency medical professional providing first aid guidance.
      
      The patient has the following specific injury: ${injuryType}
      
      Full injury assessment: ${injuryDescription}
      
      Provide detailed first aid and treatment recommendations for this SPECIFIC injury type:
      
      1. IMMEDIATE ACTIONS:
         - Critical first steps (in order of priority)
         - Required first aid supplies
         - Positioning of the injured person
      
      2. MEDICAL ATTENTION GUIDANCE:
         - Clear indicators for when emergency services (911/999/112) must be called immediately
         - Conditions that require urgent care (within hours)
         - Situations where home treatment may be sufficient
      
      3. TREATMENT PROTOCOL:
         - Step-by-step treatment instructions specific to this injury
         - Appropriate medication considerations (OTC options only)
         - Bandaging/immobilization techniques if applicable
      
      4. RECOVERY INFORMATION:
         - Expected recovery timeline
         - Warning signs of complications
         - Follow-up care recommendations
      
      Format your response in clear, simple language that could be followed in an emergency situation.
      Include any critical warnings or contraindications specific to this injury type.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting treatment recommendations:", error);
    throw new Error("Failed to generate treatment recommendations. Please try again.");
  }
}

// RAG-enhanced injury knowledge base query
export async function queryInjuryKnowledgeBase(query, injuryType = "", relevantContext = "") {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      You are a medical assistant specializing in injury assessment and treatment.
      
      User query: ${query}
      
      Specific injury type: ${injuryType}
      
      Relevant medical context: ${relevantContext}
      
      Provide an accurate, evidence-based response drawing from established medical knowledge about this specific injury type.
      Include references to medical guidelines where appropriate.
      If the query requires diagnosis that cannot be provided remotely, clearly state the limitations
      and recommend seeking professional medical care.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error querying injury knowledge base:", error);
    throw new Error("Failed to retrieve information. Please try again.");
  }
}