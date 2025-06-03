import React from 'react';
import { AlertTriangle, Info, Activity, Clock } from 'lucide-react';

const InternalInjuryInfo = () => {
  return (
    <div className="analysis-container mt-6 animate-slide-up">
      <div className="flex items-center mb-4">
        <Info className="h-5 w-5 text-blue-500 mr-2" />
        <h3 className="text-lg font-semibold">About Internal Injuries</h3>
      </div>
      
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="font-medium text-blue-800 mb-2">Limitations of Visual Diagnosis</h4>
        <p className="text-blue-700 mb-4">
          Internal injuries, including internal bleeding, cannot be reliably detected through external 
          photographs. These conditions require medical imaging such as ultrasounds, CT scans, or MRIs 
          for proper diagnosis.
        </p>
        
        <div className="warning-box bg-amber-50 border-l-4 border-amber-500">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
            <p className="text-amber-700 text-sm">
              <strong>Important:</strong> If you suspect internal bleeding or other internal injuries, 
              seek immediate medical attention. Do not rely on this app for diagnosing internal conditions.
            </p>
          </div>
        </div>
        
        <h4 className="font-medium text-blue-800 mt-4 mb-2">Warning Signs of Internal Bleeding</h4>
        <ul className="space-y-2 text-blue-700">
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
            <span>Abdominal pain and swelling</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
            <span>Dizziness or fainting</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
            <span>Severe weakness or fatigue</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
            <span>Pale, clammy skin</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
            <span>Rapid heart rate</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
            <span>Shortness of breath</span>
          </li>
        </ul>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-red-600">
            <Activity className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Emergency: Call 911/112</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">Immediate medical attention required</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternalInjuryInfo;