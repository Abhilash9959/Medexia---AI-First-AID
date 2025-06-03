import React, { useState } from 'react';
import { Check, AlertCircle, ChevronRight, Activity } from 'lucide-react';

const SymptomChecker = () => {
  const [showChecker, setShowChecker] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [showResult, setShowResult] = useState(false);
  
  const symptoms = [
    { id: 1, text: "Abdominal pain or swelling", critical: true },
    { id: 2, text: "Dizziness or lightheadedness", critical: true },
    { id: 3, text: "Fainting or loss of consciousness", critical: true },
    { id: 4, text: "Severe weakness or fatigue", critical: true },
    { id: 5, text: "Pale, clammy skin", critical: true },
    { id: 6, text: "Rapid heart rate", critical: true },
    { id: 7, text: "Shortness of breath", critical: true },
    { id: 8, text: "Visible bruising on abdomen", critical: false },
    { id: 9, text: "Nausea or vomiting", critical: false },
    { id: 10, text: "Black, tarry stool", critical: true },
    { id: 11, text: "Coughing up blood", critical: true },
    { id: 12, text: "Severe headache", critical: false },
    { id: 13, text: "Confusion or disorientation", critical: true },
  ];
  
  const toggleSymptom = (id) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter(symptomId => symptomId !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };
  
  const checkSymptoms = () => {
    setShowResult(true);
  };
  
  const resetChecker = () => {
    setSelectedSymptoms([]);
    setShowResult(false);
  };
  
  const hasCriticalSymptoms = () => {
    return symptoms
      .filter(symptom => selectedSymptoms.includes(symptom.id))
      .some(symptom => symptom.critical);
  };
  
  const getSelectedCriticalSymptoms = () => {
    return symptoms
      .filter(symptom => selectedSymptoms.includes(symptom.id) && symptom.critical);
  };
  
  return (
    <div className="analysis-container mt-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Internal Injury Symptom Checker</h3>
        <button 
          onClick={() => setShowChecker(!showChecker)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          {showChecker ? 'Hide' : 'Show'} <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${showChecker ? 'rotate-90' : ''}`} />
        </button>
      </div>
      
      {showChecker && (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          {!showResult ? (
            <>
              <p className="text-gray-700 mb-4">
                Select any symptoms you're experiencing to check for potential signs of internal bleeding:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {symptoms.map(symptom => (
                  <div 
                    key={symptom.id}
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`p-3 rounded-md cursor-pointer flex items-center ${
                      selectedSymptoms.includes(symptom.id) 
                        ? 'bg-blue-100 border border-blue-300' 
                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                      selectedSymptoms.includes(symptom.id) ? 'bg-blue-500' : 'bg-gray-200'
                    }`}>
                      {selectedSymptoms.includes(symptom.id) && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-sm">{symptom.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={resetChecker}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Reset
                </button>
                <button
                  onClick={checkSymptoms}
                  disabled={selectedSymptoms.length === 0}
                  className={`px-4 py-2 text-sm text-white rounded-md ${
                    selectedSymptoms.length > 0 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Check Symptoms
                </button>
              </div>
            </>
          ) : (
            <div className="animate-fade-in">
              {selectedSymptoms.length > 0 ? (
                <>
                  {hasCriticalSymptoms() ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md mb-4">
                      <div className="flex">
                        <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                        <div>
                          <h4 className="text-red-800 font-medium">Warning: Potential Internal Bleeding</h4>
                          <p className="text-red-700 mt-1">
                            The symptoms you've selected may indicate internal bleeding or other serious conditions. 
                            Seek immediate medical attention.
                          </p>
                          <div className="mt-3 flex items-center text-red-600">
                            <Activity className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Emergency: Call 911/112</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-md mb-4">
                      <div className="flex">
                        <AlertCircle className="h-6 w-6 text-yellow-500 mr-3" />
                        <div>
                          <h4 className="text-yellow-800 font-medium">Caution: Monitor Symptoms</h4>
                          <p className="text-yellow-700 mt-1">
                            While your symptoms don't immediately suggest internal bleeding, they should be monitored. 
                            If symptoms worsen or persist, consult a healthcare professional.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <h4 className="font-medium text-gray-800 mb-2">Selected Symptoms:</h4>
                  <ul className="space-y-1 mb-4">
                    {symptoms
                      .filter(symptom => selectedSymptoms.includes(symptom.id))
                      .map(symptom => (
                        <li key={symptom.id} className="flex items-start">
                          <span className={`inline-block w-2 h-2 rounded-full mt-1.5 mr-2 ${symptom.critical ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                          <span className="text-gray-700">{symptom.text}</span>
                        </li>
                      ))
                    }
                  </ul>
                  
                  {hasCriticalSymptoms() && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-800 mb-2">Critical Symptoms Detected:</h4>
                      <ul className="space-y-1">
                        {getSelectedCriticalSymptoms().map(symptom => (
                          <li key={symptom.id} className="flex items-start">
                            <span className="inline-block w-2 h-2 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                            <span className="text-red-700">{symptom.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-700">No symptoms selected.</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={resetChecker}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Check Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;