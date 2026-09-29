import React from 'react';
import { VizioIcon } from './VizioIcon';

interface VizioLogoProps {
  variant?: 'white' | 'dark' | 'orange';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  subtitle?: string;
  className?: string;
  iconOnly?: boolean;
}

export const VizioLogo: React.FC<VizioLogoProps> = ({
  variant = 'white',
  size = 'md',
  showSubtitle = false,
  subtitle = 'MIDIA',
  className = '',
  iconOnly = false,
}) => {
  const textColor =
    variant === 'white'
      ? '#FFFFFF'
      : variant === 'dark'
      ? '#111111'
      : '#FF5B00';

  const textDotColor = variant === 'white' ? '#FFFFFF' : '#FF5B00';

  // Sizing definitions
  const dimensions = {
    xs: { iconSize: 'xs' as const, textHeight: 'h-4', gap: 'gap-1.5' },
    sm: { iconSize: 'sm' as const, textHeight: 'h-5', gap: 'gap-2' },
    md: { iconSize: 'md' as const, textHeight: 'h-7', gap: 'gap-2.5' },
    lg: { iconSize: 'lg' as const, textHeight: 'h-9', gap: 'gap-3' },
    xl: { iconSize: 'xl' as const, textHeight: 'h-11', gap: 'gap-3.5' },
  }[size];

  if (iconOnly) {
    return <VizioIcon size={dimensions.iconSize} className={className} />;
  }

  return (
    <div className={`inline-flex items-center ${dimensions.gap} select-none ${className}`}>
      {/* Official Orange Icon (Double Chevron Shield) */}
      <VizioIcon size={dimensions.iconSize} color="#FF5B00" />

      {/* Official Typography "vizio" */}
      <div className="flex items-center gap-2">
        <svg
          viewBox="0 0 130 56"
          className={`${dimensions.textHeight} w-auto shrink-0`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="vizio"
          role="img"
        >
          <g fill={textColor}>
            {/* Letter v */}
            <path d="M 0,18 L 12.5,50 L 19.5,50 L 32,18 L 25.5,18 L 16,42 L 6.5,18 Z" />

            {/* Letter i (1) */}
            <rect x="39" y="18" width="6.5" height="32" rx="0.5" />
            <circle cx="42.25" cy="10" r="3.5" fill={textDotColor} />

            {/* Letter z */}
            <polygon points="52.5,18 78.5,18 78.5,24 60.5,44 78.5,44 78.5,50 52.5,50 52.5,44 70.5,24 52.5,24" />

            {/* Letter i (2) */}
            <rect x="85.5" y="18" width="6.5" height="32" rx="0.5" />
            <circle cx="88.75" cy="10" r="3.5" fill={textDotColor} />

            {/* Letter o */}
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M 113,18 C 120.7,18 127,25.2 127,34 C 127,42.8 120.7,50 113,50 C 105.3,50 99,42.8 99,34 C 99,25.2 105.3,18 113,18 Z M 113,24.4 C 108.9,24.4 105.5,28.7 105.5,34 C 105.5,39.3 108.9,43.6 113,43.6 C 117.1,43.6 120.5,39.3 120.5,34 C 120.5,28.7 117.1,24.4 113,24.4 Z"
            />
          </g>
        </svg>

        {showSubtitle && (
          <span className="text-[10px] font-black tracking-widest text-[#FF5B00] uppercase font-['Space_Grotesk',sans-serif]">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
