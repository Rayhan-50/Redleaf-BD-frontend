import React from 'react';

const Loading = () => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-red-100" />
        <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">Loading...</p>
    </div>
  </div>
);

export default Loading;