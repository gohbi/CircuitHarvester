import React, { useRef, useEffect, useState } from 'react';
import { X, Camera, RefreshCw } from 'lucide-react';

interface CameraModalProps {
  onCapture: (base64Image: string) => void;
  onClose: () => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' } // Prefer back camera
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError("Unable to access camera. Please ensure permissions are granted.");
        console.error("Camera Error:", err);
      }
    };

    startCamera();

    return () => {
      // Cleanup stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageData);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
        <div className="flex justify-between items-center p-4 bg-slate-800">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            Scanner
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative aspect-[3/4] bg-black">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-red-400">
              {error}
            </div>
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
          )}
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Scanning Overlay */}
          {!error && (
            <div className="absolute inset-0 border-2 border-emerald-500/30 pointer-events-none">
              <div className="absolute top-1/4 left-8 right-8 h-0.5 bg-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-800 flex justify-center">
          <button
            onClick={handleCapture}
            disabled={!!error}
            className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          >
            <div className="w-14 h-14 rounded-full border-2 border-slate-800" />
          </button>
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default CameraModal;