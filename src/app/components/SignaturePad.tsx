import { useRef, useState, useEffect } from "react";
import { Eraser } from "lucide-react";
import { motion } from "motion/react";

interface SignaturePadProps {
  label: string;
  required?: boolean;
  onChange?: (isEmpty: boolean) => void;
}

export function SignaturePad({ label, required, onChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set drawing styles
    ctx.strokeStyle = "#E5C000"; // yellow-400
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();

    if (isEmpty) {
      setIsEmpty(false);
      onChange?.(false);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    onChange?.(true);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-neutral-400 text-xs uppercase tracking-wider font-semibold">
          {label}
          {required && <span className="text-yellow-400 ml-1">*</span>}
        </label>
        <motion.button
          type="button"
          onClick={clearSignature}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded text-neutral-300 text-xs font-semibold uppercase tracking-wide transition-colors"
        >
          <Eraser size={14} />
          Limpar
        </motion.button>
      </div>
      <div className="relative bg-neutral-900 border-2 border-neutral-700 rounded-md p-4">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full h-40 cursor-crosshair bg-neutral-950 rounded border border-neutral-800"
        />
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-neutral-600 text-sm">
              Clique e arraste para assinar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
