import React, { useState } from 'react';
import { AnalysisResult, Part } from '../types';
import { Cpu, Zap, AlertTriangle, Lightbulb, Box, Check, Printer, ShoppingCart, X, FileText } from 'lucide-react';

interface AnalysisDisplayProps {
  result: AnalysisResult;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result }) => {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [showShoppingList, setShowShoppingList] = useState(false);

  const toggleSelection = (index: number) => {
    const newSelection = new Set(selectedIndices);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedIndices(newSelection);
  };

  const selectedParts = result.parts.filter((_, i) => selectedIndices.has(i));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out] pb-24">
      
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Box className="text-emerald-400" />
            <h3 className="text-2xl font-bold text-white">Harvestable Components</h3>
          </div>
          <p className="text-sm text-slate-400 hidden md:block">
            Select items to build a shopping list
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.parts.map((part, index) => {
            const isSelected = selectedIndices.has(index);
            return (
              <div 
                key={index} 
                id={`part-${index}`}
                onClick={() => toggleSelection(index)}
                className={`group cursor-pointer relative overflow-hidden rounded-xl p-5 transition-all duration-300 flex flex-col h-full border 
                  ${isSelected 
                    ? 'bg-slate-800 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                    : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
              >
                {/* Selection Checkbox */}
                <div className={`absolute top-4 right-4 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors z-20
                  ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 group-hover:border-slate-400'}`}>
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>

                {/* Index Number Watermark */}
                <div className="absolute top-2 right-12 text-6xl font-bold text-slate-700/20 pointer-events-none select-none">
                  {index + 1}
                </div>

                <div className="flex justify-between items-start mb-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-sm transition-colors
                      ${isSelected ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
                      {index + 1}
                    </div>
                    <div className="bg-slate-900 rounded-lg p-2 border border-slate-700">
                       <Zap className="w-4 h-4 text-cyan-400" />
                    </div>
                  </div>
                </div>
                
                <div className="pr-8">
                  <h4 className={`text-xl font-bold mb-1 transition-colors relative z-10 ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                    {part.name}
                  </h4>
                  <p className="text-slate-400 text-xs font-mono mb-3 relative z-10">{part.type}</p>
                </div>
                
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
            );
          })}
        </div>
      </div>

      {/* Floating Action Bar for Selection */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-full shadow-2xl transition-all duration-300 z-40 flex items-center gap-4
        ${selectedIndices.size > 0 ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}>
        <span className="font-bold text-emerald-400">{selectedIndices.size} selected</span>
        <div className="h-4 w-px bg-slate-600" />
        <button 
          onClick={() => setShowShoppingList(true)}
          className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="font-medium">View List</span>
        </button>
      </div>

      {/* Shopping List Modal */}
      {showShoppingList && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white text-slate-900 w-full max-w-2xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <ShoppingCart className="text-emerald-600" />
                  Project Shopping List
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Parts harvested from {result.deviceName}
                </p>
              </div>
              <button 
                onClick={() => setShowShoppingList(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Printable Content */}
            <div className="flex-1 overflow-y-auto p-6" id="printable-list">
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 flex gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 shrink-0" />
                  <p>
                    Use this list to verify specs for connectors (like pin pitch, voltage) or to find compatible add-ons for your projects.
                  </p>
                </div>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="py-3 px-2 text-sm font-bold text-slate-500 uppercase">#</th>
                      <th className="py-3 px-2 text-sm font-bold text-slate-500 uppercase">Component</th>
                      <th className="py-3 px-2 text-sm font-bold text-slate-500 uppercase">Type / Specs</th>
                      <th className="py-3 px-2 text-sm font-bold text-slate-500 uppercase w-12 text-center">Chk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedParts.map((part, idx) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <td className="py-4 px-2 font-mono text-slate-400 text-sm">
                          {idx + 1}
                        </td>
                        <td className="py-4 px-2">
                          <div className="font-bold text-slate-900">{part.name}</div>
                          <div className="text-sm text-slate-500 mt-1">{part.description}</div>
                        </td>
                        <td className="py-4 px-2">
                          <span className="inline-block px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600 border border-slate-200">
                            {part.type}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <div className="w-5 h-5 border-2 border-slate-300 rounded mx-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex justify-between items-center gap-4">
              <span className="text-sm text-slate-500 hidden sm:inline">
                {selectedParts.length} items ready for export
              </span>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowShoppingList(false)}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-white hover:border-slate-400 transition-all"
                >
                  Close
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                >
                  <Printer className="w-5 h-5" />
                  Print List
                </button>
              </div>
            </div>
          </div>
          
          {/* Print Styles */}
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #printable-list, #printable-list * {
                visibility: visible;
              }
              #printable-list {
                position: fixed;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: white;
                color: black;
                padding: 20px;
              }
              /* Hide scrollbars in print */
              ::-webkit-scrollbar {
                display: none;
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default AnalysisDisplay;