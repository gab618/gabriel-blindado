import React from 'react';

export interface SonicLogoProps {
  className?: string;
  size?: number;
}

/**
 * Logotipo minimalista em pixel art monocromático do Sonic (perfil clássico)
 * Utiliza currentColor para se adaptar automaticamente ao tema claro e escuro.
 */
export function SonicLogo({ className = 'w-5 h-5', size = 20 }: SonicLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2005/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-label="Sonic the Hedgehog"
      role="img"
    >
      <title>Sonic</title>
      {/* Orelha */}
      <rect x="12" y="2" width="2" height="1" />
      <rect x="11" y="3" width="4" height="1" />
      <rect x="10" y="4" width="2" height="2" />
      <rect x="14" y="4" width="2" height="2" />

      {/* Cabeça superior e espinho de cima */}
      <rect x="9" y="5" width="2" height="2" />
      <rect x="11" y="5" width="3" height="1" />
      <rect x="6" y="6" width="3" height="2" />
      <rect x="15" y="5" width="3" height="2" />
      <rect x="16" y="7" width="2" height="2" />

      {/* Espinho superior (ponta para a esquerda) */}
      <rect x="2" y="7" width="4" height="2" />
      <rect x="1" y="8" width="5" height="2" />
      <rect x="0" y="9" width="3" height="2" />

      {/* Testa e Olho */}
      <rect x="6" y="8" width="10" height="2" />
      <rect x="18" y="8" width="3" height="2" />
      <rect x="16" y="9" width="1" height="2" />
      <rect x="19" y="9" width="1" height="2" />

      {/* Espinho do meio (ponta para a esquerda) */}
      <rect x="4" y="10" width="12" height="2" />
      <rect x="2" y="11" width="3" height="2" />
      <rect x="1" y="12" width="3" height="2" />
      <rect x="0" y="13" width="3" height="2" />

      {/* Focinho, Nariz e Sorriso */}
      <rect x="16" y="11" width="5" height="2" />
      <rect x="21" y="12" width="2" height="1" />
      <rect x="16" y="13" width="5" height="2" />
      <rect x="15" y="14" width="5" height="2" />

      {/* Espinho inferior (ponta para a esquerda) */}
      <rect x="4" y="14" width="11" height="2" />
      <rect x="2" y="16" width="4" height="2" />
      <rect x="1" y="17" width="3" height="2" />
      <rect x="0" y="18" width="3" height="2" />

      {/* Queixo e Pescoço */}
      <rect x="14" y="16" width="4" height="2" />
      <rect x="5" y="16" width="9" height="2" />
      <rect x="4" y="18" width="10" height="2" />
      <rect x="6" y="20" width="6" height="2" />
    </svg>
  );
}
