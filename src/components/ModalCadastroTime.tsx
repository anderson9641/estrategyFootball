import React, { useState } from 'react';

interface ModalCadastroTimeProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nomeTime: string, nomesJogadores: string[]) => void;
}

export const ModalCadastroTime: React.FC<ModalCadastroTimeProps> = ({ isOpen, onClose, onSave }) => {
  const [nomeTime, setNomeTime] = useState('');
  const [jogadoresInput, setJogadoresInput] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!nomeTime.trim() || !jogadoresInput.trim()) return;
    
    // Divide por linhas ou vírgulas e limpa espaços
    const nomes = jogadoresInput
      .split(/[\n,]+/)
      .map(n => n.trim())
      .filter(n => n.length > 0);

    if (nomes.length === 0) return;

    onSave(nomeTime.trim(), nomes);
    setNomeTime('');
    setJogadoresInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Criar Meu Time</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-1 uppercase tracking-wider">
              Nome do Time
            </label>
            <input
              type="text"
              value={nomeTime}
              onChange={(e) => setNomeTime(e.target.value)}
              placeholder="Ex: Amigos do Anderson"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-1 uppercase tracking-wider">
              Jogadores (um por linha)
            </label>
            <textarea
              value={jogadoresInput}
              onChange={(e) => setJogadoresInput(e.target.value)}
              placeholder="Digite os nomes dos amigos..."
              rows={6}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Dica: Você pode copiar e colar uma lista de nomes aqui.
            </p>
          </div>
        </div>
        
        <div className="p-6 bg-gray-900/50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg font-bold text-gray-400 hover:text-white hover:bg-gray-700 transition-all border border-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!nomeTime.trim() || !jogadoresInput.trim()}
            className="flex-1 px-4 py-3 rounded-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar Time
          </button>
        </div>
      </div>
    </div>
  );
};
