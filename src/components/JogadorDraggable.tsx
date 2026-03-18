import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface JogadorProps {
  id: string;
  nome: string;
  posicao?: { x: number; y: number };
  foto?: string;
  noCampo?: boolean;
}

export const JogadorDraggable = ({ id, nome, posicao, noCampo, foto }: JogadorProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    top: posicao?.y,
    left: posicao?.x,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        flex  
        cursor-grab active:cursor-grabbing touch-none
        text-xs font-bold whitespace-nowrap text-center text-orange-500
        ${noCampo ? 'absolute z-10 flex-col  items-center justify-center gap-1' : 'relative z-1 items-center gap-2'}
        
      `}
    >
        <div className={`${noCampo ? 'w-10 h-10' : 'w-8 h-8'} bg-white border-2 border-black rounded shadow-md shrink-0`}>
            <img src={foto} alt="" />
        </div>
        <span>

      {nome}
        </span>
    </div>
  );
};