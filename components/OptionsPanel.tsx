"use client";

import { ChangeEvent } from "react";
import { useBuilderStore } from "@/lib/store";
import { uniqueStrings } from "@/lib/utils";

const textFieldClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none";

const labelClass = "text-xs font-semibold uppercase tracking-wide text-slate-400";

export const OptionsPanel = () => {
  const options = useBuilderStore((state) => state.options);
  const setOption = useBuilderStore((state) => state.setOption);
  const files = useBuilderStore((state) => state.files);

  const pythonFiles = files.filter((file) => file.name.endsWith(".py"));

  const handleListChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: "packages" | "includes" | "excludes" | "includeFiles"
  ) => {
    const tokens = uniqueStrings(event.target.value);
    setOption(field, tokens);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-6">
      <div className="space-y-3">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className={labelClass}>Project name</span>
            <input
              className={textFieldClass}
              value={options.projectName}
              onChange={(event) => setOption("projectName", event.target.value)}
              placeholder="my_app"
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Version</span>
            <input
              className={textFieldClass}
              value={options.version}
              onChange={(event) => setOption("version", event.target.value)}
              placeholder="0.1.0"
            />
          </label>
        </div>
        <label className="space-y-1.5">
          <span className={labelClass}>Description</span>
          <input
            className={textFieldClass}
            value={options.description}
            onChange={(event) => setOption("description", event.target.value)}
            placeholder="Executable generated via cx_Freeze"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className={labelClass}>Company / Author</span>
            <input
              className={textFieldClass}
              value={options.companyName}
              onChange={(event) => setOption("companyName", event.target.value)}
              placeholder="ACME Labs"
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Copyright</span>
            <input
              className={textFieldClass}
              value={options.copyright}
              onChange={(event) => setOption("copyright", event.target.value)}
              placeholder="Copyright (c) 2024"
            />
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-200">
          Entry configuration
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className={labelClass}>Entry script</span>
            <select
              className={`${textFieldClass} bg-slate-950`}
              value={options.entryScript}
              onChange={(event) => setOption("entryScript", event.target.value)}
            >
              <option value="">Select your entry point</option>
              {pythonFiles.map((file) => (
                <option key={file.id} value={`src/${file.name}`}>
                  src/{file.name}
                </option>
              ))}
              {options.entryScript &&
                !pythonFiles.some(
                  (file) => `src/${file.name}` === options.entryScript
                ) && (
                  <option value={options.entryScript}>
                    {options.entryScript}
                  </option>
                )}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Target executable name</span>
            <input
              className={textFieldClass}
              value={options.targetName}
              onChange={(event) => setOption("targetName", event.target.value)}
              placeholder="MyApp"
            />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className={labelClass}>Base</span>
            <div className="flex gap-2">
              {[
                { value: "Console", label: "Console" },
                { value: "Win32GUI", label: "Win32 GUI" }
              ].map((item) => (
                <button
                  key={item.value}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm transition ${
                    options.base === item.value
                      ? "border-emerald-400 bg-emerald-400/10 text-emerald-200"
                      : "border-slate-700 text-slate-400 hover:border-emerald-400/50"
                  }`}
                  onClick={() =>
                    setOption("base", item.value as typeof options.base)
                  }
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Icon (optional)</span>
            <input
              className={textFieldClass}
              value={options.iconPath}
              onChange={(event) => setOption("iconPath", event.target.value)}
              placeholder="assets/icon.ico"
            />
          </label>
        </div>
        <label className="space-y-1.5">
          <span className={labelClass}>Build directory</span>
          <input
            className={textFieldClass}
            value={options.buildDir}
            onChange={(event) => setOption("buildDir", event.target.value)}
            placeholder="build"
          />
        </label>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-200">Dependencies</h3>
        <label className="space-y-1.5">
          <span className={labelClass}>Packages (comma separated)</span>
          <input
            className={textFieldClass}
            value={options.packages.join(", ")}
            onChange={(event) => handleListChange(event, "packages")}
            placeholder="numpy, pandas"
          />
        </label>
        <label className="space-y-1.5">
          <span className={labelClass}>Includes (comma separated)</span>
          <input
            className={textFieldClass}
            value={options.includes.join(", ")}
            onChange={(event) => handleListChange(event, "includes")}
            placeholder="pkg_resources.py2_warn"
          />
        </label>
        <label className="space-y-1.5">
          <span className={labelClass}>Excludes (comma separated)</span>
          <input
            className={textFieldClass}
            value={options.excludes.join(", ")}
            onChange={(event) => handleListChange(event, "excludes")}
            placeholder="tkinter, tests"
          />
        </label>
        <label className="space-y-1.5">
          <span className={labelClass}>
            Extra files to include (comma separated)
          </span>
          <input
            className={textFieldClass}
            value={options.includeFiles.join(", ")}
            onChange={(event) => handleListChange(event, "includeFiles")}
            placeholder="data/config.json"
          />
        </label>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-200">Build options</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={options.optimize}
              onChange={(event) => setOption("optimize", event.target.checked)}
              className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-emerald-400 focus:ring-emerald-400"
            />
            Generate optimized bytecode
          </label>
          <label className="flex items-center gap-3 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={options.includeMSVCR}
              onChange={(event) =>
                setOption("includeMSVCR", event.target.checked)
              }
              className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-emerald-400 focus:ring-emerald-400"
            />
            Include MSVCR runtime
          </label>
        </div>
      </div>
    </div>
  );
};
