import React from 'react';

export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-200 rounded-lg h-64 animate-pulse"
        />
      ))}
    </div>
  );
}
