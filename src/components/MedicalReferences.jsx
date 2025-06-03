import React from 'react';
import { FileText, Percent } from 'lucide-react';

const MedicalReferences = () => {
  const references = [
    { id: 1, title: 'Lacerations & Cuts', relevance: 118 },
    { id: 2, title: 'Bleeding & Wound Care', relevance: 115 },
    { id: 3, title: 'Burns (1st, 2nd, 3rd Degree)', relevance: 114 },
    { id: 4, title: 'Fractures & Broken Bones', relevance: 113 },
    { id: 5, title: 'Sprains and Strains', relevance: 111 },
    { id: 6, title: 'Head Trauma & Concussions', relevance: 110 },
    { id: 7, title: 'Bruises & Contusions', relevance: 108 },
    { id: 8, title: 'Eye Injuries', relevance: 105 },
    { id: 9, title: 'Bites & Stings', relevance: 103 },
    { id: 10, title: 'Allergic Reactions', relevance: 100 },
  ];

  return (
    <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
      <div className="flex items-center mb-4">
        <FileText className="h-5 w-5 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Medical Reference Materials</h2>
      </div>
      
      <div className="text-left mb-4">
        <h3 className="text-md font-medium text-gray-700">Relevant Medical References</h3>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-2 px-4 py-3 bg-gray-50 border-b">
          <div className="font-medium text-gray-700">Document</div>
          <div className="font-medium text-gray-700">Relevance</div>
        </div>
        
        <div className="divide-y">
          {references.map((ref) => (
            <div key={ref.id} className="grid grid-cols-2 px-4 py-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-800">{ref.title}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2/3 bg-gray-200 rounded-full h-2.5 mr-2">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, ref.relevance - 20)}%` }}
                  ></div>
                </div>
                <span className="text-gray-600 text-sm">{ref.relevance}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 text-right">
        <span className="flex items-center justify-end">
          <Percent className="h-3 w-3 mr-1" />
          Relevance based on current injury analysis
        </span>
      </div>
    </div>
  );
};

export default MedicalReferences;