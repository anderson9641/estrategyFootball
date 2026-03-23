import { useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { Campo } from "./components/Campo";
import { JogadorDraggable } from "./components/JogadorDraggable";
import dadosTimes from "./dados_times.json";
import { TacticalBoard } from "./components/TacticalBoard";
import type { Drawing } from "./components/TacticalBoard";
import { ModalCadastroTime } from "./components/ModalCadastroTime";
import { JogadorSidebar } from "./components/JogadorSidebar";

interface JogadorEscalado {
  id: string;
  nome: string;
  numero?: number | null;
  posicao: string;
  idade?: number;
  x: number;
  y: number;
  foto: string;
  lado: 'casa' | 'visitante';
}

const timesIniciais = dadosTimes.map((item) => ({
  id: item.response[0].team.id,
  name: item.response[0].team.name,
  logo: item.response[0].team.logo,
  players: item.response[0].players,
  colors: { primary: "#3b82f6", secondary: "#ffffff" }
}));

export default function App() {
  const [listaTimes, setListaTimes] = useState(timesIniciais);
  const [idTimeEsquerda, setIdTimeEsquerda] = useState<number>();
  const [idTimeDireita, setIdTimeDireita] = useState<number>();
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [escalacao, setEscalacao] = useState<JogadorEscalado[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawingType, setDrawingType] = useState<'arrow' | 'freehand'>('arrow');
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveCustomTeam = (nomeTime: string, nomesJogadores: string[]) => {
    const novoId = Date.now();
    const novoTime = {
      id: novoId,
      name: nomeTime,
      logo: "https://img.freepik.com/vetores-premium/icone-simples-preto-do-jogador-de-futebol-isolado-no-fundo-branco_98402-68338.jpg",
      colors: { primary: "#4b5563", secondary: "#ffffff" },
      players: nomesJogadores.map((nome, index) => ({
        id: (novoId + index),
        name: nome,
        number: index + 1,
        position: "Defender",
        photo: "https://img.freepik.com/vetores-premium/icone-simples-preto-do-jogador-de-futebol-isolado-no-fundo-branco_98402-68338.jpg",
        age: 25
      }))
    };

    setListaTimes([novoTime, ...listaTimes]);
    setIdTimeEsquerda(novoId);
    setEscalacao([]);
  };

  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
    setActiveId(null);
  };

  const addDrawing = (drawing: Drawing) => {
    setDrawings([...drawings, drawing]);
  };

  const clearDrawings = () => {
    setDrawings([]);
  };

  const timeEsquerda = listaTimes.find(t => t.id === idTimeEsquerda);
  const timeDireita = listaTimes.find(t => t.id === idTimeDireita);

  // Buscar informações do jogador sendo arrastado para o DragOverlay
  const activePlayer = activeId ? (
    listaTimes.flatMap(t => t.players).find(p => p.id.toString() === activeId || `right-${p.id}` === activeId) ||
    escalacao.find(p => p.id === activeId)
  ) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const removerJogador = (id: string) => {
    setEscalacao((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDeletePlayer = (playerId: number) => {
    setListaTimes(prev => prev.map(time => ({
      ...time,
      players: time.players.filter(p => p.id !== playerId)
    })));
    setEscalacao(prev => prev.filter(p => !p.id.endsWith(playerId.toString())));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    setActiveId(null);

    if (over && over.id === "campo-futebol") {
      const activeIdStr = active.id as string;
      const isAlreadyInField = activeIdStr.startsWith('field-');
      const isRightSide = activeIdStr.includes('-right-') || (activeIdStr.startsWith('right-') && !isAlreadyInField);

      const playerOriginalId = activeIdStr
        .replace('field-left-', '')
        .replace('field-right-', '')
        .replace('right-', '');

      const campoRect = over.rect;
      const itemRect = active.rect.current.translated;
      const jogadorUniqueIdInField = isRightSide ? `field-right-${playerOriginalId}` : `field-left-${playerOriginalId}`;

      if (campoRect && itemRect) {
        const xRelativo = itemRect.left - campoRect.left;
        const yRelativo = itemRect.top - campoRect.top;

        const jaEscalado = escalacao.find((p) => p.id === activeIdStr || p.id === jogadorUniqueIdInField);

        if (jaEscalado) {
          setEscalacao((prev) =>
            prev.map((p) =>
              (p.id === activeIdStr || p.id === jogadorUniqueIdInField)
                ? { ...p, x: xRelativo, y: yRelativo } : p,
            ),
          );
        } else {
          const timeId = isRightSide ? idTimeDireita : idTimeEsquerda;
          const playerInfo = listaTimes
            .find(t => t.id === timeId)
            ?.players.find((p) => p.id.toString() === playerOriginalId);

          if (playerInfo) {
            setEscalacao([
              ...escalacao,
              {
                id: jogadorUniqueIdInField,
                nome: playerInfo.name,
                numero: playerInfo.number,
                posicao: playerInfo.position,
                idade: playerInfo.age,
                x: xRelativo,
                y: yRelativo,
                foto: playerInfo.photo,
                lado: isRightSide ? 'visitante' : 'casa'
              },
            ]);
          }
        }
      }
    }
  };

  return (
    <div className="h-screen w-full bg-gray-900 text-gray-100 p-2 overflow-hidden flex flex-col">
      <header className="max-w-full mx-auto flex items-center gap-4 bg-gray-800 p-3 rounded-xl shadow-lg mb-4 w-full border border-gray-700">
        <h1 className="text-lg font-black italic tracking-tighter text-blue-500 ml-2">ESTRATEGY<span className="text-white">FOOTBALL</span></h1>

        <div className="flex-1"></div>

        <div className="flex items-center gap-2 pr-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 text-xs transition-colors shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Novo Time
          </button>

          <button
            onClick={toggleDrawingMode}
            className={`font-bold py-2 px-4 rounded-lg flex items-center gap-2 text-xs transition-all shadow-lg ${isDrawingMode ? "bg-yellow-500 text-black scale-105" : "bg-gray-700 text-white border border-gray-600 hover:bg-gray-600"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            {isDrawingMode ? "Parar Desenho" : "Desenhar Tática"}
          </button>

          {isDrawingMode && (
            <>
              <div className="flex bg-gray-700 rounded-lg p-0.5 border border-gray-600 shadow-inner">
                <button
                  onClick={() => setDrawingType('arrow')}
                  className={`p-2 rounded transition-all ${drawingType === 'arrow' ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white"}`}
                  title="Seta Direta"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => setDrawingType('freehand')}
                  className={`p-2 rounded transition-all ${drawingType === 'freehand' ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white"}`}
                  title="Lápis Livre"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              <button
                onClick={clearDrawings}
                className="bg-yellow-600/20 hover:bg-yellow-600 text-yellow-500 hover:text-white border border-yellow-600/30 font-bold py-2 px-3 rounded-lg text-xs transition-all flex items-center gap-1"
                title="Limpar apenas desenhos"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Limpar Desenhos
              </button>
            </>
          )}

          <button
            onClick={() => { setEscalacao([]); setDrawings([]); }}
            className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/30 font-bold py-2 px-4 rounded-lg text-xs transition-all shadow-md"
          >
            Limpar Tudo
          </button>
        </div>
      </header>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <main className="flex-1 flex gap-2 min-h-0">
          <div className="hidden lg:flex w-72 flex-col min-h-0 bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
            <JogadorSidebar
              titulo={timeEsquerda?.name || "Time A"}
              players={timeEsquerda?.players?.filter(p => !escalacao.find(e => e.id === `field-left-${p.id}`)) || []}
              isDrawingMode={isDrawingMode}
              listaTimes={listaTimes}
              selectedTeamId={idTimeEsquerda || 0}
              onTeamChange={setIdTimeEsquerda}
              onDeletePlayer={handleDeletePlayer}
              variante="casa"
            />
          </div>

          <div className="flex-1 flex justify-center items-center relative bg-gray-950/80 rounded-3xl border border-gray-800 overflow-hidden shadow-inner">
            <div className="w-full h-full flex justify-center items-center p-4">
              <Campo>
                {escalacao.map((p) => (
                  <JogadorDraggable
                    key={p.id}
                    id={p.id}
                    nome={p.nome}
                    foto={p.foto}
                    numero={p.numero}
                    noCampo
                    posicao={{ x: p.x, y: p.y }}
                    onRemove={() => removerJogador(p.id)}
                    disabled={isDrawingMode}
                    variante={p.lado}
                  />
                ))}

                <TacticalBoard
                  isActive={isDrawingMode}
                  drawingType={drawingType}
                  drawings={drawings}
                  onAddDrawing={addDrawing}
                />
              </Campo>
            </div>
          </div>

          <div className={`flex items-stretch transition-all duration-500 ease-in-out ${isRightSidebarOpen ? 'w-72' : 'w-10'}`}>
            <button
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
              className="w-10 flex flex-col items-center justify-center gap-10 bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors z-20"
            >
              <div className="rotate-90 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                {isRightSidebarOpen ? 'Recolher' : 'Visitante'}
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 text-gray-400 transition-transform duration-500 ${isRightSidebarOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {isRightSidebarOpen && (
              <div className="flex-1 min-w-0 bg-gray-800 border-y border-r border-gray-700 shadow-2xl overflow-hidden flex flex-col">
                <JogadorSidebar
                  titulo={timeDireita?.name || "Time B"}
                  players={timeDireita?.players?.filter(p => !escalacao.find(e => e.id === `field-right-${p.id}`)) || []}
                  idPrefix="right-"
                  isDrawingMode={isDrawingMode}
                  listaTimes={listaTimes}
                  selectedTeamId={idTimeDireita || 0}
                  onTeamChange={setIdTimeDireita}
                  onDeletePlayer={handleDeletePlayer}
                  variante="visitante"
                />
              </div>
            )}
          </div>
        </main>

        <DragOverlay dropAnimation={null} zIndex={1000}>
          {activeId && activePlayer ? (
            <JogadorDraggable
              id={activeId}
              nome={(activePlayer as any).name || (activePlayer as any).nome}
              foto={(activePlayer as any).photo || (activePlayer as any).foto}
              numero={(activePlayer as any).number ?? (activePlayer as any).numero}
              noCampo={activeId.startsWith('field-')}
              isDragging
              variante={activeId.startsWith('right-') || activeId.includes('-right-') || (activePlayer as any).lado === 'visitante' ? 'visitante' : 'casa'}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <ModalCadastroTime
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomTeam}
      />
    </div>
  );
}
