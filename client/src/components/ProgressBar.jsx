import React from 'react';

const ProgressBar = ({ percentage }) => {
  return (
    <div className="w-full bg-gray-200 rounded h-4 mb-2">
      <div
        className="bg-green-500 h-full rounded"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
