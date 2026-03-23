import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface JogadorProps {
  id: string;
  nome: string;
  posicao?: { x: number; y: number };
  foto?: string;
  numero?: number;
  noCampo?: boolean;
  isDragging?: boolean;
  isGhost?: boolean;
  onRemove?: () => void;
  disabled?: boolean;
}

export const JogadorDraggable = ({ id, nome, posicao, noCampo, foto, numero, isDragging, isGhost, onRemove, disabled }: JogadorProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    disabled: disabled,
  });

  const style = {
    // Força o transform para nulo no elemento original para não deslocar nem 1px
    transform: isDragging ? 'translate3d(0, 0, 0)' : CSS.Translate.toString(transform),
    top: posicao?.y,
    left: posicao?.x,
    opacity: isGhost ? 0.3 : 1,
    transition: (isDragging || noCampo) ? 'none' : 'transform 200ms ease, opacity 200ms ease',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isDragging || disabled ? {} : listeners)}
      {...(isDragging || disabled ? {} : attributes)}
      tabIndex={noCampo && !disabled ? 0 : -1}
      onKeyDown={(e) => {
        if (noCampo && onRemove && (e.key === 'Delete' || e.key === 'Backspace')) {
          onRemove();
        }
      }}
      className={`
        group flex outline-none
        ${isDragging ? 'cursor-grabbing z-[1000] !opacity-100' : (disabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing')}
        touch-none
        ${noCampo 
          ? 'absolute z-10 flex-col items-center justify-center gap-1 w-14 focus:ring-2 ring-red-500 rounded-xl ring-offset-2 ring-offset-gray-900' 
          : `relative z-1 items-center gap-3 p-2 bg-gray-700/50 rounded-lg backdrop-blur-sm shadow-sm w-full box-border border border-transparent`
        }
        ${!noCampo && !isDragging ? 'hover:bg-gray-700 hover:border-gray-500' : ''}
      `}
    >
      <div className={`
        ${noCampo || isDragging ? 'w-14 h-14 border-2 rounded-xl' : 'w-10 h-10 border rounded-full'} 
        bg-gray-700 border-white/20 shadow-xl shrink-0 flex items-center justify-center relative
      `}>
        <div className="w-full h-full overflow-hidden rounded-[inherit]">
          {foto ? (
            <img src={foto} alt={nome} className="w-full h-full object-cover" />
          ) : (
            <div className="text-white/20 text-xs font-bold uppercase flex items-center justify-center h-full">
              {nome.substring(0, 2)}
            </div>
          )}
        </div>
        {(noCampo || isDragging) && numero && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center border-2 border-gray-900 shadow-lg z-20">
            {numero}
          </div>
        )}
      </div>
      <span className={`
        font-medium truncate
        ${noCampo || isDragging
          ? 'text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm max-w-[80px]' 
          : 'text-sm text-gray-200 group-hover:text-white'
        }
      `}>
        {nome}
      </span>
    </div>
  );
};