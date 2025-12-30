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

  const ampAdHtml = `<amp-ad width="100vw" height="${height}"
    type="adsense"
    data-ad-client="${siteConfig.adsense.clientId}"
    data-ad-slot="${slot}"
    data-auto-format="mcrspv"
    data-full-width="">
    <div overflow></div>
  </amp-ad>`;

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className={`w-full max-w-full flex flex-col justify-center items-center bg-secondary/50 rounded-xl py-8 relative overflow-hidden ${className}`}
    >
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute text-muted-foreground/50 text-sm font-medium"
      >
        Advertisement
      </motion.span>
      <div dangerouslySetInnerHTML={{ __html: ampAdHtml }} />
    </motion.div>
  );
};
