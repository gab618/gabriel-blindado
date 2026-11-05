import React from 'react';

export interface SonicLogoProps {
  className?: string;
  size?: number;
}

/**
 * Logotipo pixel art colorido do Sonic the Hedgehog.
 */
export function SonicLogo({ className = 'w-5 h-5', size = 20 }: SonicLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2005/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      shapeRendering="crispEdges"
      aria-label="Sonic the Hedgehog"
      role="img"
    >
      <title>Sonic</title>
      <path
        fill="#064678"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.997,6.997h4v4l-2,2 l-4-4L24.997,6.997z"
      />
      <path
        fill="#26659f"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.997,24.997h-2v2h-4 v2h-6v-2h2v-2h2v-4h2v-2h-8v-2h2v-2h2v-2h2v-2h2v-4h-2v-2h-2v-2h16v2h2v2h2v2h2v2h2v6l-3,4h-7L14.997,24.997z"
      />
      <path
        fill="#f9c292"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.997,22.997v2h-2v2 h-6v-2h-2v-2h-2v-2h2v-2l1-1h3v2h9L24.997,22.997z"
      />
      <path
        fill="#e6e5e5"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.997,18.997v-4h2v-4 h4v2h2v6h2l1-1l-1-1v-2h2v2h2v4l-2,1l-2-1h-8v-2H14.997z"
      />
      <path
        fill="#706d67"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.996,14.999v3.999 h2.001v-3.999H18.996z"
      />
      <path
        fill="#706d67"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.996,16.999v1.999 h2.001v-1.999H24.996z"
      />
      <path
        fill="#706d67"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.997,20.999v1.999 h3.999v-1.999H24.997z"
      />
      <path
        fill="#706d67"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.997,22.999v1.999 h3.999v-1.999H16.997z"
      />
      <path
        fill="#706d67"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.996,20.999v1.999 h2.001v-1.999H14.996z"
      />
      <path
        fill="#f9c292"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.997,8.997v-4h4v2h-2 v2H12.997z"
      />
    </svg>
  );
}
