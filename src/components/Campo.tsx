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
      className="relative w-[1000px] h-[650px] bg-[#1a2e1a] rounded-[20px] border-[6px] border-white/80 mx-auto overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] ring-1 ring-white/20"
      style={{
        backgroundImage: 'radial-gradient(circle at center, #2d4c2d 0%, #1a2e1a 100%)',
      }}
    >
      {/* SVG de fundo para as marcações do campo (Horizontal) */}
      <svg
        viewBox="0 0 140 100"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
        preserveAspectRatio="none"
      >
        {/* Linha de Meio de Campo (Vertical agora) */}
        <line x1="70" y1="0" x2="70" y2="100" stroke="white" strokeWidth="0.8" />
        <circle cx="70" cy="50" r="15" fill="none" stroke="white" strokeWidth="0.8" />
        <circle cx="70" cy="50" r="1" fill="white" />

        {/* Linhas Laterais e Fundo */}
        <rect x="0" y="0" width="140" height="100" fill="none" stroke="white" strokeWidth="0.8" />

        {/* Grande Área Esquerda */}
        <rect x="0" y="20" width="22" height="60" fill="none" stroke="white" strokeWidth="0.8" />
        <rect x="0" y="35" width="8" height="30" fill="none" stroke="white" strokeWidth="0.8" />
        {/* Arco da Grande Área Esquerda */}
        <path d="M 22 35 Q 32 50 22 65" fill="none" stroke="white" strokeWidth="0.8" />

        {/* Grande Área Direita */}
        <rect x="118" y="20" width="22" height="60" fill="none" stroke="white" strokeWidth="0.8" />
        <rect x="132" y="35" width="8" height="30" fill="none" stroke="white" strokeWidth="0.8" />
        {/* Arco da Grande Área Direita */}
        <path d="M 118 35 Q 108 50 118 65" fill="none" stroke="white" strokeWidth="0.8" />

        {/* Escanteios */}
        <path d="M 0 5 Q 5 5 5 0" fill="none" stroke="white" strokeWidth="0.8" />
        <path d="M 135 0 Q 135 5 140 5" fill="none" stroke="white" strokeWidth="0.8" />
        <path d="M 0 95 Q 5 95 5 100" fill="none" stroke="white" strokeWidth="0.8" />
        <path d="M 135 100 Q 135 95 140 95" fill="none" stroke="white" strokeWidth="0.8" />
      </svg>

      {/* Layer para os jogadores (children) */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};