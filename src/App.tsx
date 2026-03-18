import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { Campo } from "./components/Campo";
import { JogadorDraggable } from "./components/JogadorDraggable";
import dados from "./brasileirao.json";

interface JogadorEscalado {
  id: string;
  nome: string;
  x: number;
  y: number;
  foto: string;
}

export default function App() {
  const [indexTimeSelecionado, setIndexTimeSelecionado] = useState(-1);
  const [escalacao, setEscalacao] = useState<JogadorEscalado[]>([]);

  const timeAtual = dados.teams[indexTimeSelecionado];

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    // 1. Verifica se soltou dentro do campo
    if (over && over.id === "campo-futebol") {
      const jogadorId = active.id as string;

      // 2. Pegamos as dimensões do campo e do objeto arrastado
      const campoRect = over.rect; // Retângulo do campo
      const itemRect = active.rect.current.translated; // Onde o item está agora

      if (campoRect && itemRect) {
        // 3. Calculamos a posição relativa:
        // Onde o item está (itemRect.left) menos onde o campo começa (campoRect.left)
        const xRelativo = itemRect.left - campoRect.left;
        const yRelativo = itemRect.top - campoRect.top;

        const jaEscalado = escalacao.find((p) => p.id === jogadorId);

        if (jaEscalado) {
          // Se já estava no campo, apenas atualizamos para a nova posição
          setEscalacao((prev) =>
            prev.map((p) =>
              p.id === jogadorId ? { ...p, x: xRelativo, y: yRelativo } : p,
            ),
          );
        } else {
          // Se está vindo da lista lateral pela primeira vez
          const playerInfo = dados.teams
            .flatMap((t) => t.players)
            .find((p) => p.id.toString() === jogadorId);

          if (playerInfo) {
            setEscalacao([
              ...escalacao,
              {
                id: jogadorId,
                nome: playerInfo.name,
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
      {/* HEADER */}
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
            value={indexTimeSelecionado}
            onChange={(e) => setIndexTimeSelecionado(Number(e.target.value))}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="-1">Selecione um time</option>
            {dados.teams.map((time, index) => (
              <option key={time.id} value={index}>
                {time.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setEscalacao([])}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all shadow-md"
        >
          Limpar Campo
        </button>
      </header>

      <DndContext onDragEnd={handleDragEnd}>
        <main className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 items-start">
          {/* LISTA DE RESERVAS */}
          <aside className="w-full lg:w-72 bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-inner">
            <h4
              className="text-lg font-bold mb-4 pb-2 border-b-4"
              style={{ borderColor: timeAtual ? timeAtual.colors.primary : "" }}
            >
              {timeAtual ? timeAtual.name : ""}
            </h4>
            <div className="flex flex-wrap lg:flex-col gap-3">
              {timeAtual
                ? timeAtual.players
                    .filter(
                      (p) => !escalacao.find((e) => e.id === p.id.toString()),
                    )
                    .map((p) => (
                      <JogadorDraggable
                        key={p.id}
                        id={p.id.toString()}
                        nome={p.name}
                      />
                    ))
                : ""}
            </div>
          </aside>

          {/* ÁREA DO CAMPO */}
          <section className="flex-1 w-full flex justify-center">
            <Campo>
              {escalacao.map((p) => (
                <JogadorDraggable
                  key={p.id}
                  id={p.id}
                  nome={p.nome}
                  foto={
                    p.foto
                  }
                  noCampo
                  posicao={{ x: p.x, y: p.y }}
                />
              ))}
            </Campo>
          </section>
        </main>
      </DndContext>
    </div>
  );
}
