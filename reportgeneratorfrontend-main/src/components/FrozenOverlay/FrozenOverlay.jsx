import React from 'react';

const FrozenOverlay = () => {
  return (
    <div className="fixed inset-0 z-50 bg-transparent">
      {/* Invisible overlay that blocks all interactions */}
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[0.5px]" />
      
      {/* Minimal status indicator */}
      {/* <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
        Account Frozen
      </div> */}
    </div>
  );
};

export default FrozenOverlay;
