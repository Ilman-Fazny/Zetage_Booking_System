// src/components/shared/AdminSkeletons.jsx
import React from 'react';
import { SkeletonBlock, SkeletonText, SkeletonCircle } from './Skeleton';
import { motion } from 'framer-motion';

export function StatsSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="adm-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <SkeletonCircle size="32px" style={{ opacity: 0.5 }} />
              <SkeletonText width="80px" height="14px" style={{ opacity: 0.3 }} />
            </div>
            <SkeletonText width="120px" height="32px" style={{ opacity: 0.5 }} />
            <SkeletonText width="100px" height="12px" style={{ opacity: 0.2 }} />
          </div>
        ))}
      </div>

      {/* Occupancy Bar */}
      <div className="adm-panel" style={{ padding: '24px' }}>
        <SkeletonText width="140px" height="16px" style={{ marginBottom: '16px', opacity: 0.3 }} />
        <SkeletonBlock width="100%" height="8px" style={{ borderRadius: '4px', opacity: 0.4 }} />
      </div>

      {/* Breakdown grids */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="adm-panel" style={{ padding: '24px', minHeight: '180px' }}>
          <SkeletonText width="120px" height="16px" style={{ marginBottom: '24px', opacity: 0.3 }} />
          {[1, 2, 3].map(i => (
             <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
               <SkeletonText width="60px" height="14px" style={{ opacity: 0.2 }} />
               <SkeletonBlock width="140px" height="14px" style={{ opacity: 0.1 }} />
             </div>
          ))}
        </div>
        <div className="adm-panel" style={{ padding: '24px', minHeight: '180px' }}>
          <SkeletonText width="120px" height="16px" style={{ marginBottom: '24px', opacity: 0.3 }} />
          {[1, 2, 3].map(i => (
             <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
               <SkeletonText width="60px" height="14px" style={{ opacity: 0.2 }} />
               <SkeletonBlock width="140px" height="14px" style={{ opacity: 0.1 }} />
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 6 }) {
  return (
    <div style={{ width: '100%', overflowX: 'auto', padding: '16px' }}>
      {/* Toolbar pseudo-skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <SkeletonBlock width="200px" height="36px" style={{ opacity: 0.2, borderRadius: '8px' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <SkeletonBlock width="100px" height="36px" style={{ opacity: 0.1, borderRadius: '8px' }} />
          <SkeletonBlock width="80px" height="36px" style={{ opacity: 0.1, borderRadius: '8px' }} />
        </div>
      </div>

      <div style={{ minWidth: '800px' }}>
        {/* Header Row */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '12px' }}>
          {Array.from({ length: columns }).map((_, i) => (
            <SkeletonText key={i} width="60%" height="14px" style={{ opacity: 0.2 }} />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rIndex) => (
          <div key={rIndex} style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
            {Array.from({ length: columns }).map((_, cIndex) => (
              <SkeletonText key={cIndex} width={cIndex === 0 ? "80%" : "50%"} height="14px" style={{ opacity: 0.1 }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
