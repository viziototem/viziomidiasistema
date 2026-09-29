import React from 'react';

interface VizioIconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: string;
}

/**
 * Official Vizio Midia Geometric Icon (Layered Chevron Shield "V")
 * Directly vectorized from official brand assets.
 */
export const VizioIcon: React.FC<VizioIconProps> = ({
  size = 'md',
  className = '',
  color = '#FF5B00',
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  }[size];

  return (
    <svg
      viewBox="0 0 100 110"
      className={`${sizeClasses} shrink-0 transition-transform duration-200 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Vizio Icon"
    >
      <g>
        {/* Upper Element: Stylized U-prong with downward chevron */}
        <path
          d="M 12,12 L 25,12 L 25,43 L 50,57.5 L 75,43 L 75,12 L 88,12 L 88,52.5 L 50,73.5 L 12,52.5 Z"
          fill={color}
        />

        {/* Subtle ribbon overlap shadow for authentic depth */}
        <polygon
          points="12,52.5 25,43 25,33 12,42"
          fill="#000000"
          fillOpacity="0.12"
        />
        <polygon
          points="88,52.5 75,43 75,33 88,42"
          fill="#000000"
          fillOpacity="0.12"
        />

        {/* Lower Element: Base chevron crest */}
        <path
          d="M 12,63 L 50,83.5 L 88,63 L 88,74 L 50,97 L 12,74 Z"
          fill={color}
        />
      </g>
    </svg>
  );
};
