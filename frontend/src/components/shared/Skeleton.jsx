// src/components/shared/Skeleton.jsx
import React from 'react';

export function SkeletonBlock({ width, height, className = "", style = {} }) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width: width || '100%',
        height: height || '100%',
        borderRadius: '8px',
        ...style
      }}
    />
  );
}

export function SkeletonCircle({ size, className = "", style = {} }) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        ...style
      }}
    />
  );
}

export function SkeletonText({ width, height = '16px', className = "", style = {} }) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width: width || '100%',
        height: height,
        borderRadius: '4px',
        ...style
      }}
    />
  );
}
