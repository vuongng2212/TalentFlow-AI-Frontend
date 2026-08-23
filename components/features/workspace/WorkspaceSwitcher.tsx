"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "./RoleContext";
import { workspaceService } from "@/services/api/workspace.service";
import { useUIStore } from "@/lib/store/useUIStore";

export const WorkspaceSwitcher: React.FC = () => {
  const { activeWorkspace, workspaces, switchWorkspace, refreshWorkspaces } =
    useAuth();
  const { showLoading, hideLoading, globalLoading } = useUIStore();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [isBusiness, setIsBusiness] = useState(false);
  const [saving, setSaving] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setCreating(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSwitch = async (workspaceId: string) => {
    if (workspaceId === activeWorkspace?.id) {
      setOpen(false);
      return;
    }
    setOpen(false);
    showLoading("Switching workspace…");
    try {
      await switchWorkspace(workspaceId);
    } catch (err) {
      console.error("Failed to switch workspace", err);
    } finally {
      hideLoading();
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await workspaceService.createWorkspace({ name: newName.trim(), isBusiness });
      await refreshWorkspaces();
      setNewName("");
      setIsBusiness(false);
      setCreating(false);
      setOpen(false);
    } catch (err) {
      console.error("Failed to create workspace", err);
    } finally {
      setSaving(false);
    }
  };

  const initials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="workspace-switcher px-3" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all duration-200 text-left border border-transparent hover:border-slate-200 dark:hover:border-zinc-800"
        onClick={() => { setOpen((v) => !v); setCreating(false); }}
        title="Switch workspace"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={globalLoading}
      >
        <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-[11px] tracking-wider shadow-md">
          {activeWorkspace ? initials(activeWorkspace.name) : "?"}
        </div>
        <div className="flex-1 min-w-0 flex flex-col sidebar-expanded-only">
          <span className="text-sm font-bold text-slate-900 dark:text-zinc-50 truncate leading-tight">
            {activeWorkspace?.name ?? "Select workspace"}
          </span>
          <span className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mt-0.5 truncate">
            {activeWorkspace?.isBusiness ? "Business Plan" : "Personal Plan"}
          </span>
        </div>
        <svg
          className={`shrink-0 w-4 h-4 text-slate-400 dark:text-zinc-500 transition-transform duration-200 sidebar-expanded-only ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-3 right-3 mt-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in-up origin-top">
          <div className="px-3 py-2.5 bg-slate-50 dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Workspaces</span>
          </div>

          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 scrollbar-hide">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all duration-150 text-left ${ws.id === activeWorkspace?.id ? "bg-indigo-50 dark:bg-indigo-500/10" : "hover:bg-slate-50 dark:hover:bg-zinc-800/50"}`}
                onClick={() => handleSwitch(ws.id)}
                disabled={globalLoading}
                role="option"
                aria-selected={ws.id === activeWorkspace?.id}
              >
                <div className={`flex items-center justify-center shrink-0 w-7 h-7 rounded-md font-bold text-[10px] tracking-wider ${ws.id === activeWorkspace?.id ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'}`}>
                  {initials(ws.name)}
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <span className={`text-sm font-semibold truncate ${ws.id === activeWorkspace?.id ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-zinc-300'}`}>
                    {ws.name}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider truncate">
                    {ws.isBusiness ? "✦ Business" : "Personal"}
                  </span>
                </div>
                {ws.id === activeWorkspace?.id && (
                  <svg className="shrink-0 w-4 h-4 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100 dark:border-zinc-800 p-1.5 bg-slate-50 dark:bg-zinc-950">
            {/* Create new workspace */}
            {!creating ? (
              <button
                className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-white dark:hover:bg-zinc-900 transition-all duration-150 border border-transparent hover:border-slate-200 dark:hover:border-zinc-800 text-left group"
                onClick={() => setCreating(true)}
              >
                <div className="flex items-center justify-center shrink-0 w-7 h-7 rounded-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
                <span className="text-sm font-semibold text-slate-600 dark:text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  New workspace
                </span>
              </button>
            ) : (
              <form className="p-2 space-y-3" onSubmit={handleCreate}>
                <input
                  autoFocus
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-shadow text-slate-900 dark:text-zinc-50 placeholder:text-slate-400"
                  placeholder="Workspace name…"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  maxLength={150}
                  required
                />
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="peer appearance-none w-4 h-4 border border-slate-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 checked:bg-indigo-600 checked:border-indigo-600 transition-colors cursor-pointer"
                      checked={isBusiness}
                      onChange={(e) => setIsBusiness(e.target.checked)}
                    />
                    <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 14" fill="none">
                      <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-zinc-200 transition-colors">Business plan</span>
                </label>
                <div className="flex gap-2 justify-end pt-1">
                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs font-bold rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                    onClick={() => { setCreating(false); setNewName(""); }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-bold rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={saving || !newName.trim()}
                  >
                    {saving ? "Creating…" : "Create"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceSwitcher;