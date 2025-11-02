"use client";

import { Dropzone } from "@/components/Dropzone";
import { FileList } from "@/components/FileList";
import { OptionsPanel } from "@/components/OptionsPanel";
import { PreviewPanel } from "@/components/PreviewPanel";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-12">
      <header className="space-y-4 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-200">
          CX-Freeze Builder
        </p>
        <h1 className="text-4xl font-bold text-slate-100 sm:text-5xl">
          Drag-and-drop executable generator
        </h1>
        <p className="mx-auto max-w-3xl text-sm text-slate-400 sm:text-base">
          Upload your Python sources, tweak cx_Freeze options, and instantly
          export a ready-to-build project bundle for Windows executables. No
          manual boilerplate required.
        </p>
      </header>
      <section className="grid gap-6 lg:grid-cols-[1.1fr_1.2fr]">
        <div className="space-y-6">
          <Dropzone />
          <FileList />
          <PreviewPanel />
        </div>
        <OptionsPanel />
      </section>
      <footer className="pt-8 text-center text-xs text-slate-500">
        Built for rapid cx_Freeze packaging. Customize settings, then run{" "}
        <code className="rounded bg-slate-800 px-2 py-1 text-[11px]">
          python setup.py build
        </code>{" "}
        inside the generated bundle.
      </footer>
    </main>
  );
}
