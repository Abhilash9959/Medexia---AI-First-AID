// Add this import
import InternalInjuryFAQ from './components/InternalInjuryFAQ';

// Then in your component, add a tab for internal injuries
// For example, update your tab navigation:

<div className="flex mb-4 border-b">
  <button 
    className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
    onClick={() => setActiveTab('analysis')}
  >
    Injury Analysis
  </button>
  <button 
    className={`tab-button ${activeTab === 'internal' ? 'active' : ''}`}
    onClick={() => setActiveTab('internal')}
  >
    Internal Injuries
  </button>
  <button 
    className={`tab-button ${activeTab === 'howItWorks' ? 'active' : ''}`}
    onClick={() => setActiveTab('howItWorks')}
  >
    How It Works
  </button>
</div>

// And add a new section for the internal injuries tab:

{activeTab === 'internal' && (
  <div className="upload-container">
    <h2 className="text-xl font-semibold mb-4">Internal Injuries Information</h2>
    <InternalInjuryInfo />
    <SymptomChecker />
    <InternalInjuryFAQ />
    
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md mt-6">
      <div className="flex">
        <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
        <div>
          <h4 className="text-red-800 font-medium">Important Disclaimer</h4>
          <p className="text-red-700 mt-1">
            This app cannot diagnose internal injuries. The information provided is for educational purposes only.
            Always seek professional medical help if you suspect an internal injury.
          </p>
        </div>
      </div>
    </div>
  </div>
)}