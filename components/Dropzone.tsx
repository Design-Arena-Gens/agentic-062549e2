"use client";

import { useCallback, useState } from "react";
import { useBuilderStore } from "@/lib/store";
import type { UploadedFile } from "@/lib/types";

const readFileAsText = async (file: File): Promise<UploadedFile> => {
  const text = await file.text();
  const randomId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return {
    id: randomId,
    file,
    name: file.name,
    size: file.size,
    text
  };
};

export const Dropzone = () => {
  const addFiles = useBuilderStore((state) => state.addFiles);
  const [isDragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList?.length) return;

      const files = await Promise.all(
        Array.from(fileList).map((file) => readFileAsText(file))
      );
      addFiles(files);
    },
    [addFiles]
  );

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-10 transition bg-slate-900/60 ${
        isDragging
          ? "border-emerald-400/70 bg-emerald-950/40"
          : "border-slate-700"
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        if (!isDragging) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      role="presentation"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/80 border border-slate-700">
          <span className="text-4xl">📦</span>
        </div>
        <div>
          <p className="text-xl font-semibold">
            Drag &amp; drop your project files here
          </p>
          <p className="text-sm text-slate-400">
            Drop your Python entry script and any supporting resources.
          </p>
        </div>
        <label className="relative">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(event) => handleFiles(event.target.files)}
          />
          <span className="inline-flex items-center rounded-lg border border-emerald-400 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-400/10 cursor-pointer transition">
            Browse files
          </span>
        </label>
      </div>
    </div>
  );
};
