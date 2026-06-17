'use client';

import React, { useState, useEffect, useRef } from 'react';
import Modal from '../../ui/dialog/Modal';
import { useUIStore } from '../../../lib/store/useUIStore';
import { emailTemplateService } from '../../../services/api/email-template.service';
import { EmailTemplate } from '../../../types';

interface CreateEditTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: EmailTemplate | null;
  onSaved: () => void;
}

const DYNAMIC_VARIABLES = [
  { label: 'Candidate Name', token: '{{candidateName}}' },
  { label: 'Job Title', token: '{{jobTitle}}' },
  { label: 'Company Name', token: '{{companyName}}' },
  { label: 'Interview Date', token: '{{interviewDate}}' },
  { label: 'Interview Time', token: '{{interviewTime}}' },
];

export default function CreateEditTemplateModal({
  isOpen,
  onClose,
  template,
  onSaved,
}: CreateEditTemplateModalProps) {
  const isEdit = !!template;
  const { showLoading, hideLoading } = useUIStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: '',
  });

  const [lastFocusedField, setLastFocusedField] = useState<'subject' | 'body'>('body');

  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Load template data on edit
  useEffect(() => {
    if (template) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: template.name,
        subject: template.subject,
        body: template.body,
      });
    } else {
      setFormData({
        name: '',
        subject: '',
        body: '',
      });
    }
    setError(null);
  }, [template, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const insertVariable = (token: string) => {
    const input = lastFocusedField === 'subject' ? subjectRef.current : bodyRef.current;
    if (!input) return;

    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    const text = input.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    const newValue = before + token + after;

    if (lastFocusedField === 'subject') {
      setFormData((prev) => ({ ...prev, subject: newValue }));
    } else {
      setFormData((prev) => ({ ...prev, body: newValue }));
    }

    // Restore focus and update cursor position
    setTimeout(() => {
      input.focus();
      const newCursorPos = start + token.length;
      input.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const actionText = isEdit ? 'Saving template changes...' : 'Creating email template...';
    showLoading(actionText);

    try {
      if (isEdit && template) {
        await emailTemplateService.updateEmailTemplate(template.id, {
          subject: formData.subject,
          body: formData.body,
        });
      } else {
        await emailTemplateService.createEmailTemplate({
          name: formData.name,
          subject: formData.subject,
          body: formData.body,
        });
      }

      onSaved();
      onClose();
    } catch (err: unknown) {
      const apiError = err as { message?: string };
      setError(apiError?.message || 'Failed to save email template');
    } finally {
      hideLoading();
      setLoading(false);
    }
  };

  // Compile helper placeholders for Live Preview
  const getCompiledText = (text: string) => {
    if (!text) return '';
    return text
      .replace(/\{\{candidateName\}\}/g, 'Maya Chen')
      .replace(/\{\{jobTitle\}\}/g, 'Senior Frontend Engineer')
      .replace(/\{\{companyName\}\}/g, 'TalentFlow AI')
      .replace(/\{\{interviewDate\}\}/g, 'Thursday, June 25, 2026')
      .replace(/\{\{interviewTime\}\}/g, '14:00 GMT+7');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Email Template' : 'Create Custom Email Template'}
      size="5xl"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-lg text-sm font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full max-h-[85vh]">
        {/* Editor Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 flex flex-col justify-between overflow-y-auto pr-2">
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">
                Template Name *
              </label>
              <input
                type="text"
                name="name"
                required
                disabled={isEdit || loading}
                value={formData.name}
                onChange={handleChange}
                className={`input w-full ${isEdit ? 'bg-slate-100 dark:bg-zinc-800 text-slate-500 cursor-not-allowed border-dashed' : ''}`}
                placeholder="e.g. Technical Interview Invite"
                maxLength={120}
              />
              {!isEdit && (
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">
                  Unique name within workspace. Cannot be changed later.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">
                Subject Line *
              </label>
              <input
                ref={subjectRef}
                type="text"
                name="subject"
                required
                disabled={loading}
                value={formData.subject}
                onChange={handleChange}
                onFocus={() => setLastFocusedField('subject')}
                className="input w-full"
                placeholder="e.g. Schedule technical discussion - {{companyName}}"
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">
                Template Body *
              </label>
              <textarea
                ref={bodyRef}
                name="body"
                required
                disabled={loading}
                value={formData.body}
                onChange={handleChange}
                onFocus={() => setLastFocusedField('body')}
                className="textarea w-full h-[500px] text-sm font-sans resize-none"
                placeholder="Compose your template body..."
              />
            </div>

            {/* Placeholder Pills */}
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                Insert Tokens
              </span>
              <div className="flex flex-wrap gap-1.5">
                {DYNAMIC_VARIABLES.map((v) => (
                  <button
                    key={v.token}
                    type="button"
                    onClick={() => insertVariable(v.token)}
                    className="px-2 py-0.5 rounded-md border border-slate-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-900 bg-slate-50 dark:bg-zinc-900 text-[10px] font-semibold text-slate-700 dark:text-zinc-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    + {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 dark:border-zinc-800/60 mt-6 bg-slate-50/50 dark:bg-zinc-900/10 -mx-6 -mb-6 p-6">
            <button
              type="button"
              onClick={onClose}
              className="btn secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Template'}
            </button>
          </div>
        </form>

        {/* Live Preview Panel */}
        <div className="flex flex-col border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50/50 dark:bg-zinc-900/40 overflow-hidden select-none">
          <div className="bg-slate-100 dark:bg-zinc-900/80 px-4 py-3 border-b border-slate-200 dark:border-zinc-800 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">Live Preview</span>
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 block mt-0.5">Mock rendering showing sample candidate data</span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/50 bg-indigo-50/30 px-2 py-0.5 text-[9px] font-bold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
              Compiled
            </span>
          </div>

          {/* Email Shell */}
          <div className="flex-1 flex flex-col p-4 bg-white dark:bg-zinc-950 overflow-y-auto">
            {/* Headers */}
            <div className="space-y-2 pb-3 border-b border-slate-100 dark:border-zinc-900 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium w-14 shrink-0">From:</span>
                <span className="text-slate-700 dark:text-zinc-300 font-bold bg-slate-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded">
                  recruiting@talentflow.ai
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium w-14 shrink-0">To:</span>
                <span className="text-slate-700 dark:text-zinc-300 font-bold bg-slate-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded">
                  maya.chen@example.dev
                </span>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <span className="text-slate-400 font-medium w-14 shrink-0 mt-0.5">Subject:</span>
                <span className="text-slate-950 dark:text-zinc-50 font-extrabold line-clamp-2">
                  {formData.subject ? getCompiledText(formData.subject) : '[Enter email subject to preview]'}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 pt-4 text-sm text-slate-800 dark:text-zinc-200 leading-relaxed font-sans whitespace-pre-wrap select-text">
              {formData.body ? getCompiledText(formData.body) : '[Enter template body to preview]'}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
