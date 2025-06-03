import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzeInjuryImage, getTreatmentRecommendations } from "@/services/geminiService";
import { Loader2, Camera, Upload, AlertTriangle, Clock, Info } from "lucide-react";
import { InjuryBanner } from "@/components/ui/InjuryBanner";
import MedicalReferences from './MedicalReferences';
import InternalInjuryInfo from './InternalInjuryInfo';
import SymptomChecker from './SymptomChecker';

export default function InjuryAnalyzer() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [additionalContext, setAdditionalContext] = useState("");
  const [injuryType, setInjuryType] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [treatmentRecommendations, setTreatmentRecommendations] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGettingTreatment, setIsGettingTreatment] = useState(false);
  const [injuryData, setInjuryData] = useState(null);
  const [severity, setSeverity] = useState("Moderate");
  const [activeTab, setActiveTab] = useState("analysis");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;

    try {
      setIsAnalyzing(true);
      setInjuryData(null);
      setInjuryType("");
      setSeverity("Moderate");
      setAnalysisResult("");
      setTreatmentRecommendations("");
      
      const result = await analyzeInjuryImage(selectedImage, additionalContext);
      
      // Extract the specific injury name from the full injury type
      let displayInjuryType = result.injuryType;
      
      // Improved parsing of injury type from the response
      if (displayInjuryType.includes('-')) {
        // If the format is "Type - Location - Severity", extract just the type
        displayInjuryType = displayInjuryType.split('-')[0].trim();
      }
      
      // Make sure we're not just displaying "INJURY" as the type
      if (displayInjuryType.toLowerCase() === "injury" || !displayInjuryType) {
        // Try to extract a more specific injury type from the analysis
        const analysisText = result.fullAnalysis.toLowerCase();
        
        // Check for common injury types in the analysis text
        const injuryTypes = [
          "burn", "laceration", "cut", "fracture", "sprain", "strain", 
          "bruise", "contusion", "abrasion", "puncture", "bite", "sting",
          "concussion", "dislocation", "bleeding", "wound", "trauma"
        ];
        
        // Find the first injury type mentioned in the analysis
        for (const type of injuryTypes) {
          if (analysisText.includes(type)) {
            // Capitalize the first letter of each word
            displayInjuryType = type.split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            break;
          }
        }
      }
      
      // If we still don't have a specific type, use a default
      if (displayInjuryType.toLowerCase() === "injury" || !displayInjuryType) {
        displayInjuryType = "Unspecified Injury";
      }
      
      setInjuryType(displayInjuryType);
      setSeverity(result.severity || "Moderate");
      setInjuryData(result);
      setAnalysisResult(result.fullAnalysis);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setAnalysisResult("Error analyzing image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGetTreatment = async () => {
    if (!analysisResult) return;

    try {
      setIsGettingTreatment(true);
      const recommendations = await getTreatmentRecommendations(analysisResult, injuryType);
      setTreatmentRecommendations(recommendations);
    } catch (error) {
      console.error("Error getting treatment recommendations:", error);
      setTreatmentRecommendations("Error getting treatment recommendations. Please try again.");
    } finally {
      setIsGettingTreatment(false);
    }
  };

  return (
    <div className="app-container">
      <div className="emergency-header bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Emergency First Aid Assistant</h1>
              <p className="mt-1 text-white/90">Get immediate AI-powered first aid guidance for injuries</p>
            </div>
            <div className="ai-badge bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/30 shadow-sm">
              <Info size={16} className="text-white/90" />
              <span className="font-medium">AI-Powered</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="flex mb-4 border-b">
          <button 
            className={`tab-button px-4 py-2 font-medium transition-all ${activeTab === 'analysis' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-purple-500'}`}
            onClick={() => setActiveTab('analysis')}
          >
            Injury Analysis
          </button>
          <button 
            className={`tab-button px-4 py-2 font-medium transition-all ${activeTab === 'howItWorks' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-purple-500'}`}
            onClick={() => setActiveTab('howItWorks')}
          >
            How It Works
          </button>
        </div>

        {activeTab === 'analysis' && (
          <div className="upload-container bg-gradient-to-b from-white to-purple-50 p-6 rounded-xl shadow-sm border border-purple-100">
            <h2 className="text-xl font-semibold mb-4 text-purple-800">Upload an Injury Photo</h2>
            
            {!imagePreview ? (
              <div className="upload-area bg-white p-8 rounded-lg border-2 border-dashed border-purple-300 hover:border-purple-500 transition-all">
                <div className="flex flex-col items-center">
                  <Upload className="h-16 w-16 text-purple-400 mb-4" />
                  <p className="text-gray-700 mb-2 font-medium">Drag and drop an injury photo, or browse</p>
                  <p className="text-gray-500 text-sm mb-6">PNG, JPG, JPEG up to 5MB</p>
                  
                  <div className="flex gap-4">
                    <label className="camera-button cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2.5 px-4 rounded-full flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
                      <Camera className="h-4 w-4" />
                      <span>Take Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    
                    <label className="camera-button cursor-pointer bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white py-2.5 px-4 rounded-full flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
                      <Upload className="h-4 w-4" />
                      <span>Upload Image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Injury preview" 
                    className="max-h-80 mx-auto rounded-lg shadow-md border-4 border-white"
                  />
                  <button 
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all"
                    onClick={() => {
                      setImagePreview(null);
                      setSelectedImage(null);
                      setAnalysisResult("");
                      setInjuryType("");
                      setTreatmentRecommendations("");
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex flex-col space-y-2 bg-white p-4 rounded-lg shadow-sm">
                  <label htmlFor="additional-context" className="text-sm font-medium text-purple-800">
                    Additional Context (optional)
                  </label>
                  <Textarea
                    id="additional-context"
                    placeholder="Provide any additional information about the injury (how it happened, pain level, etc.)"
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    rows={3}
                    className="resize-none border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
                
                <Button 
                  onClick={handleAnalyzeImage} 
                  disabled={!selectedImage || isAnalyzing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all font-medium"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Injury...
                    </>
                  ) : "Analyze Injury"}
                </Button>
              </div>
            )}
            
            {analysisResult && (
              <>
                <div className={`injury-card mt-8 ${severity.toLowerCase() === "severe" ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-orange-400 to-orange-500"}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold uppercase">{injuryType}</h2>
                      <p>Seek medical attention as soon as possible.</p>
                    </div>
                    <div className="text-right">
                      <span className="severity-badge">{severity}</span>
                      <p className="text-sm mt-1">
                        {severity.toLowerCase() === "severe" 
                          ? "Immediate medical attention required" 
                          : "Medical attention needed within hours"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="analysis-container mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-semibold text-purple-800">Detailed Analysis</h3>
                    <span className="ml-auto text-sm text-gray-500 flex items-center bg-purple-50 px-3 py-1 rounded-full">
                      <Clock className="h-4 w-4 mr-1 text-purple-500" />
                      Estimated treatment time: 10-15 minutes
                    </span>
                  </div>
                  
                  <div className="border rounded-md p-5 bg-gray-50 whitespace-pre-line shadow-inner">
                    {analysisResult}
                  </div>
                  
                  <div className="warning-box mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      <p className="text-red-700 text-sm">
                        <strong>WARNING:</strong> While not immediately life-threatening, this injury can lead to complications if not properly treated. Seek medical attention promptly. If the person has difficulty breathing, call emergency services immediately.
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGetTreatment} 
                    disabled={isGettingTreatment}
                    variant="outline"
                    className="w-full mt-4 border-purple-400 text-purple-600 hover:bg-purple-50 font-medium py-2.5 transition-all"
                  >
                    {isGettingTreatment ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Getting Recommendations...
                      </>
                    ) : "Get Treatment Recommendations"}
                  </Button>
                </div>
                
                {treatmentRecommendations && (
                  <div className="analysis-container">
                    <h3 className="text-lg font-semibold mb-4">Treatment Recommendations</h3>
                    <div className="border rounded-md p-4 bg-gray-50 whitespace-pre-line">
                      {treatmentRecommendations}
                    </div>
                  </div>
                )}
                
                {/* Add the new components here */}
                <InternalInjuryInfo />
                <SymptomChecker />
                
                {/* Continue with the rest of your component */}
                <MedicalReferences />
              </>
            )}
          </div>
        )}
        
        {activeTab === 'howItWorks' && (
          <div className="upload-container bg-gradient-to-b from-white to-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
            <h2 className="text-xl font-semibold mb-6 text-blue-800">How It Works</h2>
            <div className="space-y-8">
              <div className="flex items-start space-x-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="bg-blue-100 text-blue-600 rounded-full p-3 shadow-sm">
                  <Camera className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-blue-800">1. Upload an Injury Photo</h3>
                  <p className="text-gray-600">Take a clear photo of the injury or upload an existing image.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="bg-purple-100 text-purple-600 rounded-full p-3 shadow-sm">
                  <Info className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-purple-800">2. AI Analysis</h3>
                  <p className="text-gray-600">Our advanced AI system analyzes the image to identify the type and severity of injury.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="bg-green-100 text-green-600 rounded-full p-3 shadow-sm">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-green-800">3. Get First Aid Instructions</h3>
                  <p className="text-gray-600">Receive detailed first aid guidance specific to the identified injury.</p>
                </div>
              </div>
              
              <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-md mt-8 shadow-sm">
                <p className="text-amber-800 text-sm">
                  <strong>Important:</strong> This tool provides preliminary guidance only and should not replace professional medical care. Always seek medical attention for serious injuries.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}