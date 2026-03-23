import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface JogadorProps {
  id: string;
  nome: string;
  foto: string;
  numero?: number | null;
  noCampo?: boolean;
  posicao?: { x: number; y: number };
  isDragging?: boolean;
  onRemove?: () => void;
  disabled?: boolean;
  variante?: 'casa' | 'visitante';
}

export const JogadorDraggable = ({
  id, nome, foto, numero, noCampo, posicao,
  isDragging, onRemove, disabled, variante = 'casa'
}: JogadorProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    disabled: disabled,
  });

  const style = {
    // Se estiver no campo, aplica o transform do dnd-kit. 
    // Se estiver na sidebar (!noCampo), não aplica transform para o original ficar parado 
    // enquanto o DragOverlay (em outro lugar) se move.
    transform: noCampo ? CSS.Translate.toString(transform) : undefined,
    top: posicao?.y,
    left: posicao?.x,
    opacity: isDragging && !noCampo ? 0.5 : 1, // Leve opacidade na sidebar para indicar arraste
    zIndex: isDragging ? 1000 : (noCampo ? 10 : 1),
    // Transição removida conforme solicitado pelo usuário
  };

  const ringColor = variante === 'casa' ? 'ring-blue-500' : 'ring-red-500';
  const borderColor = variante === 'casa' ? 'border-blue-500' : 'border-red-500';
  const bgColor = variante === 'casa' ? 'bg-blue-600' : 'bg-red-600';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(disabled ? {} : listeners)}
      {...(disabled ? {} : attributes)}
      tabIndex={noCampo && !disabled ? 0 : -1}
      onKeyDown={(e) => {
        if (noCampo && onRemove && (e.key === 'Delete' || e.key === 'Backspace')) {
          onRemove();
        }
      }}
      className={`
        group flex outline-none touch-none
        ${isDragging ? 'cursor-grabbing z-[1000]' : (disabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing text-white')}
        ${noCampo
          ? `absolute z-10 flex-col items-center justify-center gap-1 w-14 focus:ring-2 rounded-xl ring-offset-2 ring-offset-gray-900 ${ringColor}`
          : 'bg-gray-700 hover:bg-gray-600 border border-gray-600 p-2 rounded-lg items-center gap-3 w-full shadow-sm hover:shadow-md transition-shadow'
        }
      `}
    >
      <div className={`relative flex-shrink-0 ${noCampo ? 'w-12 h-12' : 'w-10 h-10'}`}>
        <img
          src={foto}
          alt={nome}
          className={`w-full h-full rounded-full object-cover border-2 shadow-inner ${noCampo ? borderColor : 'border-gray-600'}`}
        />
        {numero && (
          <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg ${bgColor}`}>
            {numero}
          </div>
        )}
      </div>

      <div className={`flex flex-col min-w-0 ${noCampo ? 'items-center' : 'text-left'}`}>
        <p className={`leading-tight truncate font-bold ${noCampo ? 'text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded shadow-sm' : 'text-sm text-gray-200'}`}>
          {nome}
        </p>
        {!noCampo && (
          <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider truncate">
            {variante === 'casa' ? 'Time A' : 'Time B'}
          </span>
        )}
      </div>
    </div>
  );
};
