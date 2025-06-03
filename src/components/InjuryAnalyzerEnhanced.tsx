import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { analyzeInjuryImage, getTreatmentRecommendations } from "@/services/geminiService";
import { 
  Loader2, 
  Camera, 
  Upload, 
  AlertTriangle, 
  Clock, 
  Info, 
  Heart, 
  Smartphone, 
  Vibrate,
  Activity, 
  Gauge,
  Droplets,
  AlertCircle
} from "lucide-react";
import { FirstAidInstructions } from '@/components/FirstAidInstructions';
import { VitalsMonitorPanel } from '@/components/wearable/VitalsMonitorPanel';
import { useVitalSignsWithInjury } from '@/hooks/use-vital-signs-with-injury';
import { VitalSigns } from '@/services/vitalSignsService';

export default function InjuryAnalyzerEnhanced() {
  // Image and analysis state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [additionalContext, setAdditionalContext] = useState("");
  const [injuryType, setInjuryType] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [treatmentRecommendations, setTreatmentRecommendations] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGettingTreatment, setIsGettingTreatment] = useState(false);
  const [injuryData, setInjuryData] = useState<any>(null);
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [activeTab, setActiveTab] = useState("analysis");

  // Treatment steps state
  const [treatmentSteps, setTreatmentSteps] = useState<any[]>([]);

  // Vital signs monitoring state
  const [showVitalsMonitor, setShowVitalsMonitor] = useState(false);
  const [criticalVitals, setCriticalVitals] = useState(false);
  const [vitalWarnings, setVitalWarnings] = useState<string[]>([]);
  
  // Use the vital signs hook with injury context
  const {
    vitalSigns,
    isConnected: isDeviceConnected,
    hasCriticalSigns,
    injurySpecificWarnings,
    vitalSignsAnalysis,
    simulateAbnormalVitals
  } = useVitalSignsWithInjury({
    injuryType,
    severity,
    onCriticalDetection: (warnings) => {
      setCriticalVitals(true);
      setVitalWarnings(warnings);
    }
  });

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset analysis results when image changes
  useEffect(() => {
    if (selectedImage) {
      setAnalysisResult("");
      setTreatmentRecommendations("");
      setInjuryData(null);
      setInjuryType("");
      setSeverity('medium');
      setTreatmentSteps([]);
    }
  }, [selectedImage]);

  // Analyze the image for injury
  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;

    try {
      setIsAnalyzing(true);
      setInjuryData(null);
      setInjuryType("");
      setSeverity('medium');
      setAnalysisResult("");
      setTreatmentRecommendations("");
      
      const result = await analyzeInjuryImage(selectedImage, additionalContext);
      
      // Parse severity from the response
      let injurySeverity: 'low' | 'medium' | 'high' = 'medium';
      if (result.severity) {
        const sevText = result.severity.toLowerCase();
        if (sevText.includes('mild') || sevText.includes('minor') || sevText.includes('low')) {
          injurySeverity = 'low';
        } else if (sevText.includes('severe') || sevText.includes('high') || sevText.includes('critical')) {
          injurySeverity = 'high';
        }
      }
      
      // Extract display injury type
      let displayInjuryType = result.injuryType || 'Unspecified Injury';
      
      // Try to parse injury type more accurately
      if (displayInjuryType.toLowerCase() === "injury" || displayInjuryType.includes('-')) {
        const analysisText = result.fullAnalysis.toLowerCase();
        
        // Check for common injury types
        const injuryTypes = [
          "burn", "laceration", "cut", "fracture", "sprain", "strain", 
          "bruise", "contusion", "abrasion", "puncture", "bite", "sting",
          "concussion", "dislocation", "bleeding", "wound", "trauma"
        ];
        
        for (const type of injuryTypes) {
          if (analysisText.includes(type)) {
            displayInjuryType = type.charAt(0).toUpperCase() + type.slice(1);
            break;
          }
        }
      }
      
      setInjuryType(displayInjuryType);
      setSeverity(injurySeverity);
      setInjuryData(result);
      setAnalysisResult(result.fullAnalysis);
      
      // Auto-fetch treatment recommendations
      if (result.fullAnalysis) {
        try {
          const recommendations = await getTreatmentRecommendations(result.fullAnalysis, displayInjuryType);
          setTreatmentRecommendations(recommendations);
          
          // Parse treatment steps
          parseTreatmentSteps(recommendations);
        } catch (error) {
          console.error("Error getting treatment recommendations:", error);
        }
      }
      
      // Show vitals monitor for medium to severe injuries
      if (injurySeverity !== 'low') {
        setShowVitalsMonitor(true);
      }
      
    } catch (error) {
      console.error("Error analyzing image:", error);
      setAnalysisResult("Error analyzing image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Parse treatment recommendations into steps
  const parseTreatmentSteps = (recommendations: string) => {
    const steps = [];
    let stepId = 1;
    
    // Look for numbered steps
    const stepRegex = /(\d+\.\s*)(.*?)(?=\d+\.\s*|$)/gs;
    let match;
    let foundSteps = false;
    
    while ((match = stepRegex.exec(recommendations)) !== null) {
      foundSteps = true;
      const stepContent = match[2].trim();
      if (stepContent) {
        steps.push({
          id: stepId++,
          content: stepContent,
          important: /urgent|immediate|critical|emergency/i.test(stepContent)
        });
      }
    }
    
    // If no numbered steps found, try to extract paragraphs
    if (!foundSteps) {
      const paragraphs = recommendations.split(/\n\s*\n/);
      for (const paragraph of paragraphs) {
        const trimmed = paragraph.trim();
        if (trimmed && trimmed.length > 20) {
          steps.push({
            id: stepId++,
            content: trimmed,
            important: /urgent|immediate|critical|emergency/i.test(trimmed)
          });
        }
      }
    }
    
    setTreatmentSteps(steps);
  };

  // Extract warning from treatment recommendations
  const extractWarning = () => {
    if (!treatmentRecommendations) return null;
    
    const warningRegex = /(warning|caution|alert|important|attention)[\s:]+([^.!?]+[.!?])/i;
    const match = treatmentRecommendations.match(warningRegex);
    
    if (match && match[2]) {
      return match[2].trim();
    }
    
    // Check if there's any critical/severe mentions
    if (/seek\s+immediate\s+medical|emergency|hospital|dial\s+911|call\s+ambulance/i.test(treatmentRecommendations)) {
      return "Seek immediate medical attention for this injury.";
    }
    
    return null;
  };

  return (
    <div className="app-container">
      <div className="emergency-header bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Emergency First Aid Assistant</h1>
              <p className="mt-1 text-white/90">AI-powered first aid with vital signs monitoring</p>
            </div>
            <div className="flex gap-2">
              <div className="ai-badge bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/30 shadow-sm">
                <Info size={16} className="text-white/90" />
                <span className="font-medium">AI-Powered</span>
              </div>
              {isDeviceConnected && (
                <div className="ai-badge bg-green-500/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-green-400 shadow-sm">
                  <Heart size={16} className="text-white" />
                  <span className="font-medium">Vitals Connected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <Tabs defaultValue="analysis" value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analysis">Injury Analysis</TabsTrigger>
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analysis" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
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
                            setTreatmentSteps([]);
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
                </div>
                
                {injuryData && treatmentSteps.length > 0 && (
                  <div className="mt-6">
                    <FirstAidInstructions
                      injuryType={injuryType}
                      severity={severity}
                      location={injuryData.location || "unspecified"}
                      steps={treatmentSteps}
                      warning={extractWarning()}
                      note={criticalVitals ? "Vital signs monitoring has detected critical readings related to this injury." : undefined}
                    />
                  </div>
                )}
              </div>
              
              <div className="md:col-span-1">
                {(showVitalsMonitor || activeTab === 'vitals') && (
                  <VitalsMonitorPanel 
                    injuryType={injuryType}
                    severity={severity}
                    onCriticalSignsDetected={(critical, warnings) => {
                      setCriticalVitals(critical);
                      setVitalWarnings(warnings);
                    }}
                  />
                )}
                
                {!showVitalsMonitor && activeTab === 'analysis' && (
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                      <CardTitle className="flex items-center text-lg">
                        <Smartphone className="h-5 w-5 mr-2" />
                        Wearable Integration
                      </CardTitle>
                      <CardDescription className="text-white/90">
                        Enhanced analysis with vital signs
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <Vibrate className="h-12 w-12 text-blue-500 mb-3" />
                        <h3 className="text-lg font-medium mb-2">Connect a Wearable Device</h3>
                        <p className="text-gray-600 mb-4">
                          Add real-time vital signs monitoring to get enhanced injury assessment
                        </p>
                        <Button 
                          onClick={() => setActiveTab('vitals')}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Connect Device
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Demo Panel for Testing */}
                {injuryType && (
                  <Card className="mt-6">
                    <CardHeader className="bg-gray-800 text-white">
                      <CardTitle className="text-sm">Vital Signs Demo</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <p className="text-xs text-gray-500">Simulate different vital signs scenarios</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full text-red-600" 
                            onClick={() => simulateAbnormalVitals('shock')}
                          >
                            Simulate Shock
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full text-amber-600" 
                            onClick={() => simulateAbnormalVitals('respiratory')}
                          >
                            Simulate Respiratory
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full text-purple-600" 
                            onClick={() => simulateAbnormalVitals('cardiac')}
                          >
                            Simulate Cardiac
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full text-green-600" 
                            onClick={() => simulateAbnormalVitals('normal')}
                          >
                            Normal Vitals
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="vitals" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <CardTitle>Wearable Device Integration</CardTitle>
                    <CardDescription className="text-white/80">
                      Monitor vital signs to enhance injury assessment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="text-lg font-medium text-blue-800 flex items-center mb-2">
                          <Gauge className="h-5 w-5 mr-2 text-blue-600" />
                          How Vital Signs Monitoring Works
                        </h3>
                        <p className="text-blue-700 mb-3">
                          Connect a wearable device to monitor key vital signs that help detect hidden complications from injuries:
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <Heart className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                            <div>
                              <span className="font-medium text-blue-800">Heart Rate</span>
                              <p className="text-sm text-blue-600">Elevated heart rate may indicate shock, significant pain, or developing cardiovascular stress</p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <Activity className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                            <div>
                              <span className="font-medium text-blue-800">Blood Pressure</span>
                              <p className="text-sm text-blue-600">Sudden drops may indicate internal bleeding or onset of shock; elevations may increase bleeding</p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <Droplets className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                            <div>
                              <span className="font-medium text-blue-800">Oxygen Saturation</span>
                              <p className="text-sm text-blue-600">Low SpO2 readings can detect respiratory distress before visible symptoms appear</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      
                      <Alert className="bg-amber-50 border-amber-200">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertTitle className="text-amber-800">Enhanced Emergency Detection</AlertTitle>
                        <AlertDescription className="text-amber-700">
                          By combining visual injury analysis with vital signs data, we can detect serious conditions like internal bleeding, shock, or cardiac stress that might not be visible externally.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-1">
                <VitalsMonitorPanel 
                  injuryType={injuryType}
                  severity={severity}
                  onCriticalSignsDetected={(critical, warnings) => {
                    setCriticalVitals(critical);
                    setVitalWarnings(warnings);
                  }}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 