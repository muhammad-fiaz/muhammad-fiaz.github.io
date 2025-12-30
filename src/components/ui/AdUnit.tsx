import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { siteConfig } from '@/site.config';
import { cn } from '@/lib/utils';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'autorelaxed' | 'vertical' | 'rectangle' | 'horizontal';
  layoutKey?: string;
  layout?: string;
  className?: string;
  style?: React.CSSProperties;
  fullWidthResponsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
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

export const AdUnit: React.FC<AdUnitProps> = ({
  slot,
  format = 'auto',
  layoutKey,
  layout,
  className,
  style = { display: 'block' },
  fullWidthResponsive,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const pushAd = () => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          window.adsbygoogle.push({});
          setTimeout(() => setIsLoaded(true), 1000);
        }
      } catch (err) {
        // Silently handle errors - expected on localhost
        setHasError(true);
        console.warn('AdSense push error (expected on localhost):', err);
      }
    };

    const checkAndPush = () => {
      const container = document.getElementById(`ad-${slot}`);
      if (container && container.clientWidth > 0) {
        pushAd();
        return true;
      }
      return false;
    };

    // Delay ad push to ensure container is rendered with proper width
    const timer = setTimeout(() => {
      if (!checkAndPush()) {
        // Retry after a longer delay if first attempt fails
        setTimeout(checkAndPush, 1000);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [slot]);

  if (!siteConfig.adsense.enabled) return null;

  return (
    <motion.div 
      id={`ad-${slot}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className={cn(
        "w-full max-w-full flex justify-center items-center relative overflow-hidden",
        "bg-secondary/50 rounded-xl",
        "transition-colors duration-200",
        className
      )}
    >
      {/* Placeholder text shown until ad loads */}
      <div 
        className={cn(
          "absolute inset-0 flex items-center justify-center py-8 transition-opacity duration-300 pointer-events-none",
          "ad-placeholder-text"
        )}
      >
        <span className="text-muted-foreground/50 text-sm font-medium">
          {hasError ? "Ad unavailable" : "Advertisement"}
        </span>
      </div>
      <ins
        className="adsbygoogle w-full relative z-10"
        style={{ ...style, maxWidth: '100%' }}
        data-ad-client={siteConfig.adsense.clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout-key={layoutKey}
        data-ad-layout={layout}
        data-full-width-responsive={fullWidthResponsive}
      />
      <style>{`
        .adsbygoogle[data-ad-status="filled"] ~ .ad-placeholder-text,
        .adsbygoogle:not(:empty) ~ .ad-placeholder-text {
          display: none;
          opacity: 0;
        }
      `}</style>
    </motion.div>
  );
};
