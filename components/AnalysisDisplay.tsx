import React from 'react';
import { AnalysisResult } from '../types';
import { Cpu, Zap, AlertTriangle, Lightbulb, Box } from 'lucide-react';

interface AnalysisDisplayProps {
  result: AnalysisResult;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Device Overview Header */}
      <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Cpu size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                {result.deviceName}
              </h2>
              {result.estimatedAge && (
                <span className="inline-block mt-2 px-3 py-1 bg-slate-700 rounded-full text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Era: {result.estimatedAge}
                </span>
              )}
            </div>
          </div>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
            {result.deviceFunction}
          </p>
        </div>
      </div>

      {/* Safety Warnings */}
      {result.safetyWarnings.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-900/50 rounded-xl p-4 flex gap-4 items-start">
          <AlertTriangle className="text-amber-500 shrink-0 mt-1" />
          <div>
            <h3 className="text-amber-400 font-bold mb-1">Safety First</h3>
            <ul className="list-disc list-inside text-amber-200/80 text-sm space-y-1">
              {result.safetyWarnings.map((warning, idx) => (
                <li key={idx}>{warning}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Harvestable Parts Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Box className="text-emerald-400" />
          <h3 className="text-2xl font-bold text-white">Harvestable Components</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.parts.map((part, index) => (
            <div 
              key={index} 
              className="group bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-xl p-5 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] flex flex-col h-full relative overflow-hidden"
            >
              {/* Index Number Watermark */}
              <div className="absolute top-2 right-2 text-6xl font-bold text-slate-700/20 pointer-events-none select-none">
                {index + 1}
              </div>

              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="bg-slate-900 rounded-lg p-2 border border-slate-700">
                     <Zap className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                  ${part.harvestability === 'High' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-900' : 
                    part.harvestability === 'Medium' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-900' : 
                    'bg-slate-700 text-slate-400'}`}>
                  {part.harvestability} Value
                </span>
              </div>
              
              <h4 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors relative z-10">
                {part.name}
              </h4>
              <p className="text-slate-400 text-xs font-mono mb-3 relative z-10">{part.type}</p>
              
              <p className="text-slate-300 text-sm mb-4 flex-grow relative z-10">
                {part.description}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-700/50 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-400 uppercase">Project Ideas</span>
                </div>
                <ul className="space-y-1">
                  {part.projectIdeas.map((idea, i) => (
                    <li key={i} className="text-sm text-slate-400 pl-2 border-l-2 border-slate-700">
                      {idea}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;