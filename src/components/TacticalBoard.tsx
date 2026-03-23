import React, { useState, useRef } from 'react';

export interface DrawingPoint {
  x: number;
  y: number;
}

export interface Drawing {
  id: string;
  type: 'arrow' | 'freehand';
  points: DrawingPoint[]; // Para setas, terá 2 pontos (start, end). Para freehand, terá N pontos.
  color: string;
}

interface TacticalBoardProps {
  isActive: boolean;
  drawingType: 'arrow' | 'freehand';
  drawings: Drawing[];
  onAddDrawing: (drawing: Drawing) => void;
}

export const TacticalBoard: React.FC<TacticalBoardProps> = ({ isActive, drawingType, drawings, onAddDrawing }) => {
  const [currentPoints, setCurrentPoints] = useState<DrawingPoint[]>([]);
  const containerRef = useRef<SVGSVGElement>(null);

  const getPoint = (e: React.MouseEvent | MouseEvent): DrawingPoint => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive) return;
    const p = getPoint(e);
    setCurrentPoints([p]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isActive || currentPoints.length === 0) return;
    const p = getPoint(e);

    if (drawingType === 'arrow') {
      setCurrentPoints([currentPoints[0], p]);
    } else {
      setCurrentPoints([...currentPoints, p]);
    }
  };

  const handleMouseUp = () => {
    if (currentPoints.length >= 2) {
      const dist = Math.hypot(
        currentPoints[currentPoints.length - 1].x - currentPoints[0].x,
        currentPoints[currentPoints.length - 1].y - currentPoints[0].y
      );

      if (dist > 5 || currentPoints.length > 5) {
        onAddDrawing({
          id: Math.random().toString(36).substr(2, 9),
          type: drawingType,
          points: currentPoints,
          color: '#fbbf24',
        });
      }
    }
    setCurrentPoints([]);
  };

  const renderPath = (points: DrawingPoint[]) => {
    if (points.length < 2) return "";
    return `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
  };

  return (
    <svg
      ref={containerRef}
      className={`absolute inset-0 w-full h-full z-50 ${isActive ? 'cursor-crosshair' : 'pointer-events-none'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 Z" fill="currentColor" />
        </marker>
      </defs>

      {drawings.map((d) => (
        d.type === 'arrow' ? (
          <line
            key={d.id}
            x1={d.points[0].x}
            y1={d.points[0].y}
            x2={d.points[d.points.length - 1].x}
            y2={d.points[d.points.length - 1].y}
            stroke={d.color}
            strokeWidth="6"
            markerEnd="url(#arrowhead)"
            strokeLinecap="round"
            style={{ color: d.color }}
            className="drop-shadow-md opacity-80"
          />
        ) : (
          <path
            key={d.id}
            d={renderPath(d.points)}
            fill="none"
            stroke={d.color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-md opacity-80"
          />
        )
      ))}

      {currentPoints.length >= 2 && (
        drawingType === 'arrow' ? (
          <line
            x1={currentPoints[0].x}
            y1={currentPoints[0].y}
            x2={currentPoints[currentPoints.length - 1].x}
            y2={currentPoints[currentPoints.length - 1].y}
            stroke="#fbbf24"
            strokeWidth="3"
            markerEnd="url(#arrowhead)"
            strokeDasharray="4"
            style={{ color: '#fbbf24' }}
            className="opacity-60"
          />
        ) : (
          <path
            d={renderPath(currentPoints)}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3"
            strokeDasharray="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-60"
          />
        )
      )}
    </svg>
  );
};
