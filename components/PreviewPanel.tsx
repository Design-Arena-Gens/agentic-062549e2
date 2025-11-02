"use client";

import { useMemo, useState } from "react";
import { saveAs } from "file-saver";
import { useBuilderStore } from "@/lib/store";
import { createProjectZip, generateSetupPy } from "@/lib/setupGenerator";

const codeBlockClass =
  "rounded-lg border border-slate-800 bg-slate-950/80 p-4 font-mono text-xs leading-relaxed text-slate-200 whitespace-pre overflow-auto";

export const PreviewPanel = () => {
  const options = useBuilderStore((state) => state.options);
  const files = useBuilderStore((state) => state.files);
  const isGenerating = useBuilderStore((state) => state.isGenerating);
  const setGenerating = useBuilderStore((state) => state.setGenerating);
  const [status, setStatus] = useState<string | null>(null);

  const preparedOptions = useMemo(() => {
    const includeFiles = new Set(options.includeFiles);
    if (files.length) {
      includeFiles.add("src");
    }
    return { ...options, includeFiles: Array.from(includeFiles) };
  }, [options, files]);

  const setupPreview = useMemo(
    () => generateSetupPy(preparedOptions),
    [preparedOptions]
  );

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setStatus("Copied to clipboard.");
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      setStatus("Unable to copy. Please copy manually.");
      setTimeout(() => setStatus(null), 5000);
    }
  };

  const downloadBundle = async () => {
    if (!options.entryScript) {
      setStatus("Please select an entry script before generating.");
      setTimeout(() => setStatus(null), 4000);
      return;
    }

    try {
      setGenerating(true);
      setStatus("Bundling project...");
      const blob = await createProjectZip(options, files);
      saveAs(blob, `${options.projectName || "cx-freeze-project"}.zip`);
      setStatus("Bundle ready. Check your downloads.");
    } catch (error) {
      console.error(error);
      setStatus("Failed to generate bundle.");
    } finally {
      setGenerating(false);
      setTimeout(() => setStatus(null), 4000);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70">
      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-100">
          setup.py preview
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => copyToClipboard(setupPreview)}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-emerald-400 hover:text-emerald-200 transition"
          >
            Copy
          </button>
          <button
            onClick={downloadBundle}
            disabled={isGenerating}
            className="rounded-lg border border-emerald-400 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500"
          >
            {isGenerating ? "Generating..." : "Download bundle"}
          </button>
        </div>
      </div>
      <div className="p-6">
        {!options.entryScript && (
          <div className="mb-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            Select an entry script to finalize the configuration.
          </div>
        )}
        <pre className={codeBlockClass}>{setupPreview}</pre>
        {status && (
          <p className="mt-4 text-xs text-slate-400 transition">{status}</p>
        )}
      </div>
    </div>
  );
};
