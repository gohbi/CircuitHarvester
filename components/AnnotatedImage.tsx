import React, { useState } from 'react';
import { Part } from '../types';

interface AnnotatedImageProps {
  imageSrc: string;
  parts: Part[];
}

const AnnotatedImage: React.FC<AnnotatedImageProps> = ({ imageSrc, parts }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shadow-xl group">
      <img 
        src={imageSrc} 
        alt="Analyzed Circuit" 
        className="w-full h-auto block"
      />
      
      {parts.map((part, index) => {
        if (!part.box_2d || part.box_2d.length !== 4) return null;

        const [ymin, xmin, ymax, xmax] = part.box_2d;
        
        // Convert 1000-based coordinates to percentages
        const top = (ymin / 1000) * 100 + '%';
        const left = (xmin / 1000) * 100 + '%';
        const height = ((ymax - ymin) / 1000) * 100 + '%';
        const width = ((xmax - xmin) / 1000) * 100 + '%';

        const isHovered = hoveredIndex === index;

        return (
          <div
            key={index}
            className={`absolute border-2 transition-all duration-300 cursor-help
              ${isHovered ? 'border-emerald-400 bg-emerald-400/10 z-20' : 'border-emerald-500/60 z-10 hover:border-emerald-400 hover:bg-emerald-400/10'}
            `}
            style={{ top, left, width, height }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Number Badge */}
            <div className={`absolute -top-3 -left-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
              ${isHovered ? 'bg-emerald-400 text-slate-900 scale-110' : 'bg-emerald-600 text-white shadow-lg'}
              transition-transform`}
            >
              {index + 1}
            </div>

            {/* Tooltip on hover */}
            <div className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 bg-slate-900/95 text-white text-xs whitespace-nowrap rounded border border-slate-700 shadow-xl pointer-events-none transition-opacity duration-200
              ${isHovered ? 'opacity-100' : 'opacity-0'}
            `}>
              <span className="font-bold text-emerald-400">{index + 1}.</span> {part.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnnotatedImage;