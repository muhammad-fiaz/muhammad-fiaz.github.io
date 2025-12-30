"use client";

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { siteConfig } from '@/site.config';

interface AmpAdUnitProps {
  slot: string;
  height?: number;
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const AmpAdUnit: React.FC<AmpAdUnitProps> = ({
  slot,
  height = 250,
  className = "",
}) => {
  if (!siteConfig.adsense.enabled) return null;

  // For non-AMP pages, amp-ad works but we should ensure it has enough space
  // We use dangerouslySetInnerHTML to ensure the AMP tag is rendered exactly as needed
  const ampAdHtml = `
    <amp-ad width="100vw" height="${height}"
      type="adsense"
      data-ad-client="${siteConfig.adsense.clientId}"
      data-ad-slot="${slot}"
      data-auto-format="mcrspv"
      data-full-width="">
      <div overflow></div>
    </amp-ad>
  `;

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className={`w-full max-w-full flex flex-col justify-center items-center bg-secondary/50 rounded-xl py-8 relative overflow-hidden ${className}`}
    >
      {/* Placeholder text using global CSS hiding logic if possible, 
          but for AMP we'll use a simpler approach since data-ad-status might not be present */}
      <span 
        className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 text-sm font-medium pointer-events-none ad-placeholder-text"
      >
        Advertisement
      </span>
      
      <div 
        className="w-full relative z-10"
        dangerouslySetInnerHTML={{ __html: ampAdHtml.trim() }} 
      />
      
      <style>{`
        /* Use CSS to hide the placeholder when the amp-ad child has content or becomes visible */
        /* Note: amp-ad adds its own classes like .amp-active or changes state */
        amp-ad.amp-active ~ .ad-placeholder-text,
        amp-ad[data-loading-state="complete"] ~ .ad-placeholder-text {
          display: none !important;
          opacity: 0 !important;
        }
      `}</style>
    </motion.div>
  );
};
