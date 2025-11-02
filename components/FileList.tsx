"use client";

import { useBuilderStore } from "@/lib/store";
import { formatBytes } from "@/lib/utils";

export const FileList = () => {
  const files = useBuilderStore((state) => state.files);
  const removeFile = useBuilderStore((state) => state.removeFile);
  const clearFiles = useBuilderStore((state) => state.clearFiles);

  if (!files.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">
        No files added yet. Drop your project files to get started.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70">
      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-3">
        <p className="text-sm font-semibold text-slate-200">Project files</p>
        <button
          onClick={() => clearFiles()}
          className="text-xs text-slate-400 hover:text-emerald-300 transition"
        >
          Clear all
        </button>
      </div>
      <ul className="max-h-60 overflow-auto divide-y divide-slate-800">
        {files.map((file) => (
          <li
            key={file.id}
            className="flex items-center justify-between px-6 py-3 text-sm"
          >
            <div className="flex flex-col">
              <span className="text-slate-100">{file.name}</span>
              <span className="text-xs text-slate-500">
                {formatBytes(file.size)}
              </span>
            </div>
            <button
              onClick={() => removeFile(file.id)}
              className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-400 hover:bg-red-500/10 hover:text-red-300 transition"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
