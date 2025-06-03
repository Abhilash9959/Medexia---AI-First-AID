import React from 'react';

const InjuryBanner = ({ injuryType, severity }) => {
  return (
    <div className="bg-orange-300 p-4 rounded-md">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold uppercase">{injuryType}</h2>
          <p>Seek medical attention as soon as possible.</p>
        </div>
        <div className="text-right">
          <span className="inline-block bg-white text-orange-500 px-3 py-1 rounded-full">{severity}</span>
          <p className="text-sm mt-1">Medical attention needed within hours</p>
        </div>
      </div>
    </div>
  );
};

export default InjuryBanner;