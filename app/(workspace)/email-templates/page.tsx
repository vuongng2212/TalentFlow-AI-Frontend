'use client';

import { useState, useEffect, useCallback } from 'react';
import { emailTemplateService } from '../../../services/api/email-template.service';
import { EmailTemplate } from '../../../types';
import LoadingSkeleton from '../../../components/ui/LoadingSkeleton';
import EmptyState from '../../../components/ui/EmptyState';
import CreateEditTemplateModal from '../../../components/features/email-templates/CreateEditTemplateModal';
import { useAuth } from '../../../components/features/workspace/RoleContext';
import { useMinDuration } from '../../../hooks/useMinDuration';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';

export default function EmailTemplatesPage() {
  const { isLoading: isAuthLoading, isAuthenticated, activeWorkspace } = useAuth();

  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal and action states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(search, 250);
  const { start: startMinDuration, end: endMinDuration } = useMinDuration();

  const loadTemplates = useCallback(
    async (isBackground = false) => {
      if (!isBackground) {
        startMinDuration();
        setLoading(true);
      } else {
        setIsFetching(true);
      }

      try {
        const response = await emailTemplateService.getEmailTemplates({
          search: debouncedSearch || undefined,
          page,
          limit: 10,
        });
        setTemplates(response.data);
        setTotalPages(response.meta.totalPages);
      } catch (error) {
        console.error('Failed to fetch email templates', error);
      } finally {
        if (!isBackground) {
          endMinDuration(() => setLoading(false));
        }
        setIsFetching(false);
      }
    },
    [debouncedSearch, page, startMinDuration, endMinDuration]
  );

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTemplates();

    const onFocus = () => {
      loadTemplates(true);
    };

    window.addEventListener('focus', onFocus);

    return () => {
      window.removeEventListener('focus', onFocus);
    };
  }, [isAuthLoading, isAuthenticated, loadTemplates, refreshKey]);

  const handleCreateOpen = () => {
    setSelectedTemplate(null);
    setIsModalOpen(true);
  };

  const handleEditOpen = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleDeleteTrigger = (id: string) => {
    setDeleteError(null);
    setConfirmDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteId) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await emailTemplateService.deleteEmailTemplate(confirmDeleteId);
      setConfirmDeleteId(null);
      setRefreshKey((prev) => prev + 1);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setDeleteError(error?.message || 'Failed to delete template');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaved = () => {
    setPage(1);
    setSearch('');
    setRefreshKey((prev) => prev + 1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setPage(1);
  };

  return (
    <>
      <header className="topbar bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
        <div className="crumb text-slate-500 dark:text-zinc-400">
          {activeWorkspace?.name ?? 'Workspace'} <span className="mx-2 text-slate-300 dark:text-zinc-700">/</span> <strong className="text-slate-900 dark:text-zinc-50 font-bold">Email Templates</strong>
          {isFetching && (
            <svg
              className="animate-spin h-4 w-4 text-indigo-600 dark:text-indigo-400 ml-2 inline"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
        </div>
        <button
          className="btn primary text-xs h-8 px-3 cursor-pointer active:scale-[0.98] transition-all"
          onClick={handleCreateOpen}
        >
          Create Template
        </button>
      </header>

      <section className="content bg-noise">
        <div className="page-head mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50">Email Templates</h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
              Manage reusable notification templates used to communicate with candidates.
            </p>
          </div>
        </div>

        {/* Search controls */}
        <div className="mb-6 relative z-10">
          <div className="relative">
            <input
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 outline-none transition-all border-slate-200 dark:border-zinc-800 focus:border-indigo-500 text-sm"
              type="text"
              placeholder="Search templates by name or subject..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>
        </div>

        {/* Templates list / Table */}
        {loading ? (
          <LoadingSkeleton type="table" count={5} />
        ) : templates.length > 0 ? (
          <>
            <div className="card bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none overflow-hidden relative z-10">
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-zinc-800">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-zinc-800/50">
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Template Name</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Subject Line</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Created Date</th>
                      <th className="pr-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 text-right whitespace-nowrap w-1">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {templates.map((template) => (
                      <tr
                        key={template.id}
                        className="group hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors duration-150"
                      >
                        <td
                          className="px-4 py-4 font-bold text-slate-900 dark:text-zinc-100 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          onClick={() => handleEditOpen(template)}
                        >
                          {template.name}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600 dark:text-zinc-400 max-w-xs truncate" title={template.subject}>
                          {template.subject}
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-500 dark:text-zinc-500 font-medium tabular-data">
                          {new Date(template.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="pr-4 py-4 text-right whitespace-nowrap w-1">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleEditOpen(template)}
                              className="btn secondary text-xs h-7 px-2.5 min-h-0 cursor-pointer active:scale-[0.98] transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTrigger(template.id)}
                              className="btn danger text-xs h-7 px-2.5 min-h-0 cursor-pointer active:scale-[0.98] transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-xs text-slate-500 dark:text-zinc-400">
                  Page <span className="font-bold tabular-data">{page}</span> of <span className="font-bold tabular-data">{totalPages}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn secondary text-xs h-8 px-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="btn secondary text-xs h-8 px-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title={search ? 'No templates match search' : 'No email templates found'}
            description={search ? 'Try adjusting your search terms.' : 'Create a custom email template to simplify communication.'}
            action={search ? { label: 'Clear search', onClick: handleClearFilters } : { label: 'Create Template', onClick: handleCreateOpen }}
          />
        )}
      </section>

      {/* Editor Modal */}
      <CreateEditTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        template={selectedTemplate}
        onSaved={handleSaved}
      />

      {/* Confirmation Dialog */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl max-w-md w-full flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-jakarta text-lg font-bold text-slate-900 dark:text-zinc-50">
              Delete Email Template
            </h3>
            {deleteError && (
              <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-lg text-xs font-semibold">
                {deleteError}
              </div>
            )}
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
              Are you sure you want to delete this email template? This template will no longer be available for workspace communications.
            </p>
            <div className="flex gap-3 justify-end mt-2">
              <button
                className="btn secondary text-xs h-9 cursor-pointer"
                onClick={() => setConfirmDeleteId(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn danger text-xs h-9 cursor-pointer active:scale-[0.98] transition-all"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Template'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
