import { useState } from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Camera, Info } from "lucide-react";
import ARFirstAidVisualization from "@/components/ar/ARFirstAidVisualization";
import { VitalSignsMonitor } from "@/components/vital-signs/VitalSignsMonitor";
import Link from "next/link";
import { EnhancedFirstAidInstructions } from "@/components/EnhancedFirstAidInstructions";

// Define Step interface to match the expected format
interface Step {
  id: number;
  content: string;
  important?: boolean;
  hasVideo?: boolean;
}

// Sample first aid steps for different injuries
const SAMPLE_INJURIES = {
  burn: {
    type: "burn",
    severity: "medium" as "low" | "medium" | "high",
    location: "arm",
    title: "Second-Degree Burn on Arm",
    steps: [
      { id: 1, content: "Remove any clothing or jewelry near the burned area." },
      { id: 2, content: "Run cool (not cold) water over the burn for 10 to 15 minutes." },
      { id: 3, content: "Apply a clean, dry bandage loosely over the burn." },
      { id: 4, content: "Do not apply ointments, butter, or other home remedies.", important: true },
      { id: 5, content: "Take an over-the-counter pain reliever if needed." },
      { id: 6, content: "Monitor for signs of infection (increased pain, redness, swelling).", important: true }
    ] as Step[]
  },
  cut: {
    type: "cut",
    severity: "high" as "low" | "medium" | "high",
    location: "hand",
    title: "Deep Cut on Hand",
    steps: [
      { id: 1, content: "Apply direct pressure to the wound with a clean cloth or bandage.", important: true },
      { id: 2, content: "Keep the pressure on for 15 minutes without checking the wound." },
      { id: 3, content: "Elevate the injured area above the level of the heart if possible." },
      { id: 4, content: "Clean the wound gently with soap and water when bleeding slows." },
      { id: 5, content: "Apply antibiotic ointment and cover with a sterile bandage." },
      { id: 6, content: "Seek immediate medical attention if bleeding continues or the cut is deep.", important: true }
    ] as Step[]
  },
  fracture: {
    type: "fracture",
    severity: "high" as "low" | "medium" | "high",
    location: "leg",
    title: "Suspected Leg Fracture",
    steps: [
      { id: 1, content: "Keep the injured area immobile - do not attempt to move or straighten it.", important: true },
      { id: 2, content: "Apply ice wrapped in a cloth to reduce swelling and pain." },
      { id: 3, content: "Immobilize the injury using a splint if available." },
      { id: 4, content: "Provide support above and below the site of injury." },
      { id: 5, content: "Do not put weight on an injured leg.", important: true },
      { id: 6, content: "Seek immediate medical attention for proper treatment and evaluation.", important: true }
    ] as Step[]
  },
  sprain: {
    type: "sprain",
    severity: "medium" as "low" | "medium" | "high",
    location: "ankle",
    title: "Ankle Sprain",
    steps: [
      { id: 1, content: "Follow the R.I.C.E. method - Rest, Ice, Compression, Elevation." },
      { id: 2, content: "Rest the injured ankle by avoiding weight-bearing activities." },
      { id: 3, content: "Apply ice for 15-20 minutes every 2-3 hours for the first 48 hours." },
      { id: 4, content: "Use a compression bandage to reduce swelling." },
      { id: 5, content: "Elevate the ankle above heart level when possible." },
      { id: 6, content: "Take anti-inflammatory medication if needed for pain and swelling." }
    ] as Step[]
  }
};

export default function ARDemoPage() {
  const [selectedInjury, setSelectedInjury] = useState("burn");
  const [showAR, setShowAR] = useState(false);
  const [showVitals, setShowVitals] = useState(false);
  
  const injury = SAMPLE_INJURIES[selectedInjury as keyof typeof SAMPLE_INJURIES];
  
  const handleCriticalVitalSigns = (hasCritical: boolean) => {
    // This would be used to alert the user or modify the AR guidance
    console.log("Critical vital signs detected:", hasCritical);
  };

  if (showAR) {
    return (
      <>
        <Head>
          <title>AR First Aid Guidance | Medexia Saver</title>
        </Head>
        <ARFirstAidVisualization
          injuryType={injury.type}
          severity={injury.severity}
          bodyLocation={injury.location}
          firstAidSteps={injury.steps}
          onClose={() => setShowAR(false)}
        />
      </>
    );
  }
  
  return (
    <>
      <Head>
        <title>AR First Aid Demonstration | Medexia Saver</title>
        <meta name="description" content="Experience augmented reality first aid guidance with wearable health monitoring integration" />
      </Head>
      
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">AR First Aid Demonstration</h1>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Augmented Reality First Aid with Wearable Integration</CardTitle>
            <CardDescription>
              Experience how AR technology combined with real-time vital signs monitoring can enhance first aid guidance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
              <Info className="h-4 w-4" />
              <p>
                This demo shows how AR can provide visual guidance for first aid procedures, while wearable devices 
                monitor vital signs to enhance the assessment and guidance.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Select Injury Scenario:</h3>
                <Select value={selectedInjury} onValueChange={setSelectedInjury}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an injury type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="burn">Second-Degree Burn</SelectItem>
                    <SelectItem value="cut">Deep Cut</SelectItem>
                    <SelectItem value="fracture">Suspected Fracture</SelectItem>
                    <SelectItem value="sprain">Ankle Sprain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end gap-3">
                <Button 
                  className="flex items-center gap-2" 
                  onClick={() => setShowAR(true)}
                >
                  <Camera className="h-4 w-4" />
                  Start AR Guidance
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowVitals(!showVitals)}
                >
                  {showVitals ? "Hide Vital Signs" : "Show Vital Signs"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{injury.title}</CardTitle>
                <CardDescription>Enhanced first aid instructions with AR mode available</CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedFirstAidInstructions
                  injuryType={injury.type}
                  severity={injury.severity}
                  location={injury.location}
                  steps={injury.steps}
                />
              </CardContent>
            </Card>
          </div>
          
          {showVitals && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Vital Signs Monitor</CardTitle>
                  <CardDescription>Connect to wearable device</CardDescription>
                </CardHeader>
                <CardContent>
                  <VitalSignsMonitor 
                    onCriticalSignsDetected={handleCriticalVitalSigns}
                    injuryType={injury.type}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 