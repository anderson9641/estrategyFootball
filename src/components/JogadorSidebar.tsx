import React from 'react';
import { JogadorDraggable } from './JogadorDraggable';

interface Player {
  id: number;
  name: string;
  number: number | null;
  position: string;
  photo: string;
  age?: number;
}

interface JogadorSidebarProps {
  titulo: string;
  players: Player[];
  idPrefix?: string;
  isDrawingMode?: boolean;
  listaTimes: any[];
  selectedTeamId: number;
  onTeamChange: (id: number) => void;
  onDeletePlayer: (playerId: number) => void;
  variante: 'casa' | 'visitante';
}

export const JogadorSidebar: React.FC<JogadorSidebarProps> = ({ 
  players, idPrefix = "", isDrawingMode, 
  listaTimes, selectedTeamId, onTeamChange, onDeletePlayer, variante 
}) => {
  // Agrupar jogadores por posição
  const jogadoresPorPosicao = players.reduce((acc, player) => {
    const pos = player.position || "Outros";
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(player);
    return acc;
  }, {} as Record<string, Player[]>);

  return (
    <div className="flex flex-col h-full bg-gray-800 border-x border-gray-700 w-full overflow-hidden shadow-xl">
      <div className="p-4 border-b border-gray-700 bg-gray-800/80">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
            <span className={`w-1.5 h-4 rounded-full ${variante === 'casa' ? 'bg-blue-500' : 'bg-red-500'}`}></span>
            {variante === 'casa' ? 'Casa' : 'Visitante'}
          </h2>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Plantel</span>
        </div>

        <select
          value={selectedTeamId}
          onChange={(e) => onTeamChange(Number(e.target.value))}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500 transition-all font-bold"
        >
          <option value={0}>Selecione o Time</option>
          {listaTimes.map((time) => (
            <option key={time.id} value={time.id}>{time.name}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4 custom-scrollbar">
        {Object.entries(jogadoresPorPosicao).map(([posicao, atletas]) => (
          <div key={posicao} className="space-y-3">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2 mb-2 border-l-2 border-gray-700 ml-1">
              {posicao}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {atletas.map((player) => (
                <div key={player.id} className="group/item relative">
                  <JogadorDraggable
                    id={`${idPrefix}${player.id}`}
                    nome={player.name}
                    foto={player.photo}
                    numero={player.number}
                    disabled={isDrawingMode}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Remover ${player.name} do time permanentemente?`)) {
                        onDeletePlayer(player.id);
                      }
                    }}
                    className="absolute top-1 right-1 opacity-0 group-hover/item:opacity-100 p-1.5 bg-red-600/90 text-white rounded-md hover:bg-red-700 transition-all z-10 shadow-lg"
                    title="Remover jogador do time"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
