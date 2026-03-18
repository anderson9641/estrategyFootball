import { useDroppable } from '@dnd-kit/core';
import React from 'react';

interface CampoProps {
  children: React.ReactNode;
}

export const Campo: React.FC<CampoProps> = ({ children }) => {
  const { setNodeRef } = useDroppable({
    id: 'campo-futebol',
  });

  return (
    <div
      ref={setNodeRef}
      className="relative w-full max-w-[500px] h-[700px] bg-green-800 rounded-lg border-4 border-white mx-auto overflow-hidden shadow-2xl"
    >
      {/* SVG de fundo para as marcações do campo */}
      <svg
        viewBox="0 0 100 140"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        {/* Linha de Meio de Campo */}
        <line x1="0" y1="70" x2="100" y2="70" stroke="white" strokeWidth="0.5" />
        <circle cx="50" cy="70" r="15" fill="none" stroke="white" strokeWidth="0.5" />
        <circle cx="50" cy="70" r="1" fill="white" />

        {/* Grande Área Superior */}
        <rect x="20" y="0" width="60" height="20" fill="none" stroke="white" strokeWidth="0.5" />
        <rect x="35" y="0" width="30" height="8" fill="none" stroke="white" strokeWidth="0.5" />
        {/* Arco da Grande Área Superior */}
        <path d="M 35 20 Q 50 30 65 20" fill="none" stroke="white" strokeWidth="0.5" />

        {/* Grande Área Inferior */}
        <rect x="20" y="120" width="60" height="20" fill="none" stroke="white" strokeWidth="0.5" />
        <rect x="35" y="132" width="30" height="8" fill="none" stroke="white" strokeWidth="0.5" />
        {/* Arco da Grande Área Inferior */}
        <path d="M 35 120 Q 50 110 65 120" fill="none" stroke="white" strokeWidth="0.5" />

        {/* Escanteios */}
        <circle cx="0" cy="0" r="3" fill="none" stroke="white" strokeWidth="0.5" />
        <circle cx="100" cy="0" r="3" fill="none" stroke="white" strokeWidth="0.5" />
        <circle cx="0" cy="140" r="3" fill="none" stroke="white" strokeWidth="0.5" />
        <circle cx="100" cy="140" r="3" fill="none" stroke="white" strokeWidth="0.5" />
      </svg>

      {/* Layer para os jogadores (children) */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};