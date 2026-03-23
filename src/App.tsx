import { useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { Campo } from "./components/Campo";
import { JogadorDraggable } from "./components/JogadorDraggable";
import dadosTimes from "./dados_times.json";
import { TacticalBoard } from "./components/TacticalBoard";
import type { Drawing } from "./components/TacticalBoard";

interface JogadorEscalado {
  id: string;
  nome: string;
  numero?: number;
  posicao: string;
  idade?: number;
  x: number;
  y: number;
  foto: string;
}

const times = dadosTimes.map((item) => ({
  id: item.response[0].team.id,
  name: item.response[0].team.name,
  logo: item.response[0].team.logo,
  players: item.response[0].players,
  colors: { primary: "#3b82f6", secondary: "#ffffff" }
}));

export default function App() {
  const [idTimeSelecionado, setIdTimeSelecionado] = useState<number>(); // Flamengo default
  const [escalacao, setEscalacao] = useState<JogadorEscalado[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawingType, setDrawingType] = useState<'arrow' | 'freehand'>('arrow');
  const [drawings, setDrawings] = useState<Drawing[]>([]);

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

  const timeAtual = times.find(t => t.id === idTimeSelecionado);
  const activePlayer = times
    .flatMap((t) => t.players)
    .find((p) => p.id.toString() === activeId) ||
    escalacao.find((p) => p.id === activeId);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const removerJogador = (id: string) => {
    setEscalacao((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    setActiveId(null);

    if (over && over.id === "campo-futebol") {
      const jogadorId = active.id as string;
      const campoRect = over.rect;
      const itemRect = active.rect.current.translated;

      if (campoRect && itemRect) {
        const xRelativo = itemRect.left - campoRect.left;
        const yRelativo = itemRect.top - campoRect.top;

        const jaEscalado = escalacao.find((p) => p.id === jogadorId);

        if (jaEscalado) {
          setEscalacao((prev) =>
            prev.map((p) =>
              p.id === jogadorId ? { ...p, x: xRelativo, y: yRelativo } : p,
            ),
          );
        } else {
          const playerInfo = times
            .flatMap((t) => t.players)
            .find((p) => p.id.toString() === jogadorId);

          if (playerInfo) {
            setEscalacao([
              ...escalacao,
              {
                id: jogadorId,
                nome: playerInfo.name,
                numero: playerInfo.number ?? undefined,
                posicao: playerInfo.position,
                idade: playerInfo.age,
                x: xRelativo,
                y: yRelativo,
                foto: playerInfo.photo
              },
            ]);
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <header className="max-w-6xl mx-auto flex flex-wrap items-center gap-6 bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
        <img
          src={timeAtual ? timeAtual.logo : "https://img.freepik.com/vetores-premium/icone-simples-preto-do-jogador-de-futebol-isolado-no-fundo-branco_98402-68338.jpg"}
          alt="Logo"
          className="w-16 h-16 object-contain"
        />

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
            Selecione o Clube
          </label>
          <select
            value={idTimeSelecionado}
            onChange={(e) => setIdTimeSelecionado(Number(e.target.value))}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="-1">Selecione um time</option>
            {times.map((time) => (
              <option key={time.id} value={time.id}>
                {time.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleDrawingMode}
            className={`font-bold py-2.5 px-4 rounded-lg transition-all shadow-md flex items-center gap-2 ${isDrawingMode
                ? "bg-yellow-500 text-black hover:bg-yellow-600"
                : "bg-gray-700 text-white hover:bg-gray-600 border border-gray-600"
              }`}
            title={isDrawingMode ? "Sair do Modo Desenho" : "Ativar Modo Desenho (Estratégia)"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <span className="hidden md:inline">{isDrawingMode ? "Parar Desenho" : "Desenhar Tática"}</span>
          </button>

          {isDrawingMode && (
            <div className="flex bg-gray-700 rounded-lg p-1 border border-gray-600">
              <button
                onClick={() => setDrawingType('arrow')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 text-sm font-bold ${drawingType === 'arrow' ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white"
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Seta
              </button>
              <button
                onClick={() => setDrawingType('freehand')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 text-sm font-bold ${drawingType === 'freehand' ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white"
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Lápis
              </button>
            </div>
          )}

          {drawings.length > 0 && (
            <button
              onClick={clearDrawings}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2.5 px-4 rounded-lg transition-all shadow-md border border-gray-600"
              title="Limpar Desenhos"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}

          <button
            onClick={() => {
              setEscalacao([]);
              setDrawings([]);
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all shadow-md ml-2"
          >
            Limpar Tudo
          </button>
        </div>
      </header>

      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <main className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 items-start">
          <aside className="w-full lg:w-72 bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-inner overflow-hidden">
            <h4
              className="text-lg font-bold mb-4 pb-2 border-b-4"
              style={{ borderColor: timeAtual ? timeAtual.colors.primary : "" }}
            >
              {timeAtual ? timeAtual.name : "Plantel"}
            </h4>
            <div className="flex flex-col gap-6 h-[600px] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
              {timeAtual ? (
                <>
                  {["Goalkeeper", "Defender", "Midfielder", "Attacker"].map((pos) => {
                    const playersInPos = timeAtual.players.filter(
                      (p) => p.position === pos && !escalacao.find((e) => e.id === p.id.toString())
                    );

                    if (playersInPos.length === 0) return null;

                    const posLabels: Record<string, string> = {
                      Goalkeeper: "Goleiros",
                      Defender: "Defensores",
                      Midfielder: "Meio-Campistas",
                      Attacker: "Atacantes"
                    };

                    return (
                      <div key={pos} className="flex flex-col gap-2">
                        <h5 className="text-xs uppercase tracking-widest text-gray-500 font-bold border-l-2 border-gray-600 pl-2">
                          {posLabels[pos]}
                        </h5>
                        <div className="grid grid-cols-1 gap-2">
                          {playersInPos.map((p) => (
                            <JogadorDraggable
                              key={p.id}
                              id={p.id.toString()}
                              nome={p.name}
                              foto={p.photo}
                              isGhost={activeId === p.id.toString()}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <p className="text-gray-500 text-sm italic">Selecione um time para ver o plantel</p>
              )}
            </div>
          </aside>

          <section className="flex-1 w-full flex justify-center">
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
                  isGhost={activeId === p.id}
                  onRemove={() => removerJogador(p.id)}
                  disabled={isDrawingMode}
                />
              ))}

              <TacticalBoard
                isActive={isDrawingMode}
                drawingType={drawingType}
                drawings={drawings}
                onAddDrawing={addDrawing}
              />
            </Campo>
          </section>
        </main>

        <DragOverlay dropAnimation={null}>
          {activeId ? (
            <JogadorDraggable
              id={activeId}
              nome={'nome' in activePlayer! ? activePlayer.nome : (activePlayer as any).name}
              foto={activeId.includes('escalado') || 'foto' in activePlayer! ? (activePlayer as any).foto : (activePlayer as any).photo}
              numero={'numero' in activePlayer! ? activePlayer.numero : (activePlayer as any).number}
              noCampo={true} // Forçamos o estilo de campo no overlay para o cálculo bater
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
