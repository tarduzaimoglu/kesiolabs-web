"use client";

import { useCallback, useRef, useState } from "react";
import { MAX_FILE_BYTES } from "@/lib/quote/constants";

type Props = {
  onFileAccepted: (file: File) => void;
  onClear: () => void;
  fileName: string | null;
  errorCode: string | null;
  setErrorCode: (c: string | null) => void;
};

export default function UploadCard({ onFileAccepted, onClear, fileName, setErrorCode }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validate = useCallback((file: File) => {
    const name = file.name.toLowerCase();
    if (!name.endsWith(".stl")) return "UNSUPPORTED_FORMAT";
    if (file.size > MAX_FILE_BYTES) return "FILE_TOO_LARGE";
    return null;
  }, []);

  const handleFile = useCallback((file: File) => {
    const err = validate(file);
    if (err) {
      setErrorCode(err);
      return;
    }
    setErrorCode(null);
    onFileAccepted(file);
  }, [onFileAccepted, setErrorCode, validate]);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="mb-3">
        <h2 className="text-base font-semibold tracking-normal text-neutral-900">STL Yükleme</h2>
        <p className="text-sm text-neutral-600">Sadece .STL · Maksimum 50 MB</p>
      </div>

      <div
        className={[
          "rounded-2xl border-2 border-dashed p-5 transition",
          isDragging ? "border-orange-500 bg-orange-50" : "border-neutral-200 bg-neutral-50",
        ].join(" ")}
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
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm font-medium text-neutral-900">STL dosyanızı buraya sürükleyin</p>
          <p className="text-xs text-neutral-600">veya</p>
          <button
            type="button"
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
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
              if (f) handleFile(f);
            }}
          />

          {fileName && (
            <div className="mt-3 w-full rounded-xl bg-white px-3 py-2 text-left text-sm ring-1 ring-black/5">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-neutral-900">{fileName}</span>
                <button
                  type="button"
                  className="text-xs font-semibold text-neutral-700 hover:text-neutral-900"
                  onClick={() => { onClear(); setErrorCode(null); }}
                >
                  Kaldır
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
