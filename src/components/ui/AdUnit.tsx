import React, { useEffect } from 'react';
import { siteConfig } from '@/site.config';

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

export const AdUnit: React.FC<AdUnitProps> = ({
  slot,
  format = 'auto',
  layoutKey,
  layout,
  className,
  style = { display: 'block' },
  fullWidthResponsive,
}) => {
  useEffect(() => {
    const pushAd = () => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          window.adsbygoogle.push({});
        }
      } catch (err) {
        console.warn('AdSense push error:', err);
      }
    };

    // Only push if we have a valid width to avoid "No slot size" errors
    const checkAndPush = () => {
      const container = document.getElementById(`ad-${slot}`);
      if (container && container.clientWidth > 0) {
        pushAd();
        return true;
      }
      return false;
    };

    if (!checkAndPush()) {
      // If width is 0, wait for a bit or layout shift
      const timer = setTimeout(checkAndPush, 500);
      return () => clearTimeout(timer);
    }
  }, [slot]);

  if (!siteConfig.adsense.enabled) return null;

  return (
    <div id={`ad-${slot}`} className={`w-full flex justify-center ${className || ""}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={siteConfig.adsense.clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout-key={layoutKey}
        data-ad-layout={layout}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
};
