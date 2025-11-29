import React, { useState, useRef } from 'react';
import { Camera, Upload, RotateCcw, Cpu, Loader2 } from 'lucide-react';
import { AnalysisState } from './types';
import { analyzeCircuitBoard } from './services/geminiService';
import CameraModal from './components/CameraModal';
import AnalysisDisplay from './components/AnalysisDisplay';

function App() {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null,
    image: null,
  });

  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64String = reader.result as string;
        processImage(base64String);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64Image: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, image: base64Image }));
    
    try {
      const result = await analyzeCircuitBoard(base64Image);
      setState(prev => ({ ...prev, isLoading: false, result }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred." 
      }));
    }
  };

  const handleReset = () => {
    setState({
      isLoading: false,
      error: null,
      result: null,
      image: null,
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 selection:bg-emerald-500/30">
      <div className="circuit-pattern fixed inset-0 opacity-20 pointer-events-none" />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-1.5 rounded-lg">
              <Cpu className="text-slate-900 w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Circuit<span className="text-emerald-400">Harvester</span>
            </span>
          </div>
          {state.result && (
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all text-sm font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">New Scan</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Landing State */}
          {!state.result && !state.isLoading && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12 animate-[fadeIn_0.5s_ease-out]">
              <div className="space-y-4 max-w-2xl">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                  Decode <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    The Machine
                  </span>
                </h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                  Upload a photo of any circuit board or electronic device. 
                  Identify components, learn how they work, and find parts to 
                  harvest for your next project.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                <button
                  onClick={() => setShowCamera(true)}
                  className="group relative flex flex-col items-center justify-center p-8 bg-slate-800 border-2 border-slate-700 rounded-2xl hover:border-emerald-500 transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Camera className="w-8 h-8 text-emerald-400" />
                  </div>
                  <span className="text-lg font-bold text-white">Scan Board</span>
                  <span className="text-sm text-slate-400 mt-2">Use Camera</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative flex flex-col items-center justify-center p-8 bg-slate-800 border-2 border-slate-700 rounded-2xl hover:border-cyan-500 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-cyan-400" />
                  </div>
                  <span className="text-lg font-bold text-white">Upload Image</span>
                  <span className="text-sm text-slate-400 mt-2">From Gallery</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {state.error && (
                <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 max-w-md">
                  {state.error}
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {state.isLoading && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu className="w-8 h-8 text-emerald-500 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">Analyzing Circuitry...</h3>
                <p className="text-slate-400">Identifying components and reading labels</p>
              </div>
            </div>
          )}

          {/* Results State */}
          {state.result && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Image Preview (Sticky Sidebar on Desktop) */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-slate-800 p-2 rounded-2xl border border-slate-700 shadow-xl">
                  {state.image && (
                    <img 
                      src={state.image} 
                      alt="Analyzed Circuit" 
                      className="w-full h-auto rounded-xl"
                    />
                  )}
                  <div className="mt-4 px-2 pb-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Analysis Status</h4>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-sm font-medium">Complete</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Content */}
              <div className="lg:col-span-2">
                <AnalysisDisplay result={state.result} />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Camera Modal */}
      {showCamera && (
        <CameraModal 
          onClose={() => setShowCamera(false)}
          onCapture={(image) => {
            setShowCamera(false);
            processImage(image);
          }}
        />
      )}
    </div>
  );
}

export default App;