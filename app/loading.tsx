import React from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <LoadingSpinner
        size="sm"
        variant="dots"
        showText={true}
        text="loading"
        textSize="xs"
      />
    </div>
  );
}
