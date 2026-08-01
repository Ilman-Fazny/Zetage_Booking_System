// src/components/shared/TicketSkeleton.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { popVariants } from "../../lib/motionVariants";
import { SkeletonBlock, SkeletonText } from "./Skeleton";

export default function TicketSkeleton() {
  return (
    <motion.div
      className="tp-card"
      variants={popVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ marginBottom: 24, overflow: 'hidden' }}
    >
      {/* Gold confirmed banner placeholder */}
      <div className="tp-banner" style={{ display: 'flex', justifyContent: 'center' }}>
        <SkeletonText width="120px" height="14px" style={{ opacity: 0.2 }} />
      </div>

      {/* Event header placeholder */}
      <div className="tp-ticket-head" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <SkeletonText width="180px" height="14px" style={{ opacity: 0.2 }} />
        <SkeletonBlock width="100px" height="40px" style={{ opacity: 0.3 }} />
        <SkeletonText width="200px" height="20px" style={{ opacity: 0.4 }} />
        <SkeletonText width="160px" height="14px" style={{ opacity: 0.2 }} />
      </div>

      {/* Perforation placeholder */}
      <div style={{ height: '32px', margin: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <div style={{ width: '16px', height: '32px', background: 'var(--bg)', borderRadius: '0 16px 16px 0', position: 'absolute', left: '-20px' }} />
        <div style={{ width: '100%', borderTop: '2px dashed rgba(255,255,255,0.05)' }} />
        <div style={{ width: '16px', height: '32px', background: 'var(--bg)', borderRadius: '16px 0 0 16px', position: 'absolute', right: '-20px' }} />
      </div>

      {/* QR code zone placeholder */}
      <div className="tp-qr-zone" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <SkeletonBlock width="180px" height="180px" style={{ opacity: 0.1, borderRadius: '12px' }} />
        <SkeletonText width="140px" height="12px" style={{ opacity: 0.1 }} />
      </div>

      <div style={{ height: '32px', margin: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <div style={{ width: '16px', height: '32px', background: 'var(--bg)', borderRadius: '0 16px 16px 0', position: 'absolute', left: '-20px' }} />
        <div style={{ width: '100%', borderTop: '2px dashed rgba(255,255,255,0.05)' }} />
        <div style={{ width: '16px', height: '32px', background: 'var(--bg)', borderRadius: '16px 0 0 16px', position: 'absolute', right: '-20px' }} />
      </div>

      {/* Booking Details placeholder */}
      <div className="tp-details-grid" style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <SkeletonText width="60px" height="10px" style={{ opacity: 0.1, marginBottom: '6px' }} />
          <SkeletonText width="100px" height="16px" style={{ opacity: 0.3 }} />
        </div>
        <div>
          <SkeletonText width="60px" height="10px" style={{ opacity: 0.1, marginBottom: '6px' }} />
          <SkeletonText width="100px" height="16px" style={{ opacity: 0.3 }} />
        </div>
        <div>
          <SkeletonText width="60px" height="10px" style={{ opacity: 0.1, marginBottom: '6px' }} />
          <SkeletonText width="100px" height="16px" style={{ opacity: 0.3 }} />
        </div>
        <div>
          <SkeletonText width="60px" height="10px" style={{ opacity: 0.1, marginBottom: '6px' }} />
          <SkeletonText width="100px" height="16px" style={{ opacity: 0.3 }} />
        </div>
      </div>
    </motion.div>
  );
}
