"use client";

import { useCallback, useRef, useState } from "react";
import { MAX_FILE_BYTES } from "@/lib/quote/constants";
import { UploadCloud, FileBox, X } from "lucide-react";

type Props = {
  onFileAccepted: (file: File) => void;
  onClear: () => void;
  fileName: string | null;
  errorCode: string | null;
  setErrorCode: (c: string | null) => void;
  onPickStart?: () => void;
  onPickEnd?: () => void;
};

export default function UploadCard({
  onFileAccepted,
  onClear,
  fileName,
  setErrorCode,
  onPickStart,
  onPickEnd,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validate = useCallback((file: File) => {
    const name = file.name.toLowerCase();
    if (!name.endsWith(".stl")) return "UNSUPPORTED_FORMAT";
    if (file.size > MAX_FILE_BYTES) return "FILE_TOO_LARGE";
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      const err = validate(file);
      if (err) {
        setErrorCode(err);
        return;
      }
      setErrorCode(null);
      onFileAccepted(file);
    },
    [onFileAccepted, setErrorCode, validate]
  );

  return (
    <div className="rounded-3xl bg-white/[0.02] p-6 md:p-8 border border-white/10 shadow-2xl backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">STL Yükleme</h2>
          <p className="text-sm text-slate-400 mt-1">Sadece <strong className="text-white">.STL</strong> formatı · Maksimum 50 MB</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
          <FileBox className="w-5 h-5 text-indigo-400" />
        </div>
      </div>

      <div
        className={`rounded-2xl border-2 border-dashed p-8 transition-all duration-300 flex flex-col items-center justify-center text-center
          ${isDragging ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]" : "border-white/10 bg-black/20 hover:bg-white/[0.02] hover:border-indigo-400/50"}
        `}
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
      >
        <UploadCloud className={`w-12 h-12 mb-4 transition-colors ${isDragging ? "text-indigo-400" : "text-slate-500"}`} />
        
        <p className="text-base font-medium text-white mb-2">STL dosyanızı buraya sürükleyin</p>
        <p className="text-xs text-slate-500 mb-6">veya bilgisayarınızdan seçin</p>

        <button
          type="button"
          className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5"
          onPointerDown={() => onPickStart?.()}
          onClick={() => inputRef.current?.click()}
        >
          Dosya Seç
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".stl"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            onPickEnd?.();
            if (f) handleFile(f);
          }}
        />

        {fileName && (
          <div className="mt-6 w-full rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-4 py-3 text-left text-sm flex items-center justify-between gap-3 animate-in fade-in zoom-in duration-300">
            <span className="truncate font-medium text-indigo-300">{fileName}</span>
            <button
              type="button"
              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors shrink-0"
              onClick={() => { onClear(); setErrorCode(null); }}
              title="Kaldır"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
