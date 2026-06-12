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
    <div className="workspace-switcher" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        className="workspace-trigger"
        onClick={() => { setOpen((v) => !v); setCreating(false); }}
        title="Switch workspace"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={globalLoading}
      >
        <div className="workspace-avatar">
          {activeWorkspace ? initials(activeWorkspace.name) : "?"}
        </div>
        <div className="workspace-info sidebar-expanded-only">
          <span className="workspace-name">
            {activeWorkspace?.name ?? "Select workspace"}
          </span>
          <span className="workspace-plan">
            {activeWorkspace?.isBusiness ? "Business" : "Personal"}
          </span>
        </div>
        <svg
          className={`workspace-chevron sidebar-expanded-only ${open ? "rotated" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="workspace-dropdown" role="listbox">
          <div className="workspace-dropdown-header">Workspaces</div>

          {workspaces.map((ws) => (
            <button
              key={ws.id}
              className={`workspace-option ${ws.id === activeWorkspace?.id ? "active" : ""}`}
              onClick={() => handleSwitch(ws.id)}
              disabled={globalLoading}
              role="option"
              aria-selected={ws.id === activeWorkspace?.id}
            >
              <div className="workspace-option-avatar">
                {initials(ws.name)}
              </div>
              <div className="workspace-option-info">
                <span className="workspace-option-name">{ws.name}</span>
                <span className="workspace-option-plan">
                  {ws.isBusiness ? "✦ Business" : "Personal"}
                </span>
              </div>
              {ws.id === activeWorkspace?.id && (
                <svg className="workspace-option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}

          <div className="workspace-dropdown-divider" />

          {/* Create new workspace */}
          {!creating ? (
            <button
              className="workspace-option create-btn"
              onClick={() => setCreating(true)}
            >
              <div className="workspace-option-avatar create">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </div>
              <span className="workspace-option-name">New workspace</span>
            </button>
          ) : (
            <form className="workspace-create-form" onSubmit={handleCreate}>
              <input
                autoFocus
                className="input input-sm"
                placeholder="Workspace name…"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                maxLength={150}
                required
              />
              <label className="workspace-create-toggle">
                <input
                  type="checkbox"
                  checked={isBusiness}
                  onChange={(e) => setIsBusiness(e.target.checked)}
                />
                <span>Business plan</span>
              </label>
              <div className="workspace-create-actions">
                <button
                  type="button"
                  className="btn secondary btn-xs"
                  onClick={() => { setCreating(false); setNewName(""); }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn primary btn-xs"
                  disabled={saving || !newName.trim()}
                >
                  {saving ? "Creating…" : "Create"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkspaceSwitcher;
