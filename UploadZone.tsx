"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { cn, formatFileSize } from "@/lib/utils";

interface UploadZoneProps {
  onFile: (file: File) => void;
  className?: string;
}

export function UploadZone({ onFile, className }: UploadZoneProps) {
  const inputRef  = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [hover,    setHover]    = useState(false);

  const handleDragOver  = (e: DragEvent) => { e.preventDefault(); setDragging(true);  };
  const handleDragLeave = ()              => setDragging(false);
  const handleDrop      = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") onFile(file);
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      className={cn(
        "upload-zone py-10 px-6",
        dragging && "dragging",
        className
      )}
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && inputRef.current?.click()}
      aria-label="Upload PDF"
    >
      {/* Icon */}
      <div
        className="text-6xl mb-4 transition-transform duration-300"
        style={{ transform: (dragging || hover) ? "scale(1.15) rotate(-4deg)" : "scale(1) rotate(0deg)" }}
      >
        📄
      </div>

      {/* Text */}
      <p className="text-base font-bold text-purple-700 mb-1">
        {dragging ? "Drop it here!" : "Drop your PDF here"}
      </p>
      <p className="text-sm text-muted">
        or <span className="text-purple-600 font-semibold underline underline-offset-2">tap to browse</span>
      </p>

      {/* Accepted types */}
      <div className="mt-4 flex items-center gap-2 flex-wrap justify-center">
        {["PDF", "Research", "Legal", "Notes"].map(t => (
          <span key={t} className="chip-purple text-2xs px-2 py-0.5">{t}</span>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleChange}
        aria-hidden
      />
    </div>
  );
}
