'use client';

import React from 'react';

interface InfoSectionProps {
  title: string;
  items: string[];
}

export function InfoSection({ title, items }: InfoSectionProps) {
  return (
    <div className="bg-dark-blue rounded-2xl p-6 mb-8">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <ul className="space-y-2 text-sm text-gray-300">
        {items.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
