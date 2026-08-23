import React, { useState, useEffect } from 'react';
import Modal from '../../ui/dialog/Modal';
import { useUIStore } from '../../../lib/store/useUIStore';
import { jobService } from '../../../services/api/job.service';
import { applicationService } from '../../../services/api/application.service';
import { Job } from '../../../types';
import { useModalStore } from '../../../lib/store/useModalStore';

interface UploadCvModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onUploadSuccess?: () => void;
}

export default function UploadCvModal({ isOpen, onClose, onUploadSuccess }: UploadCvModalProps) {
  const activeModal = useModalStore((state) => state.activeModal);
  const closeModal = useModalStore((state) => state.closeModal);

  const showModal = isOpen !== undefined ? isOpen : (activeModal === 'upload-cv');
  const handleClose = onClose || closeModal;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const { showLoading, hideLoading } = useUIStore();

  const [selectedJobId, setSelectedJobId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => {
      setError(null);
      setFile(null);
      jobService.getJobs({ status: 'OPEN', limit: 50 }).then(res => {
         setJobs(res.data);
         if (res.data.length > 0) setSelectedJobId(res.data[0].id);
      }).catch(console.error);
    }, 0);
    return () => clearTimeout(timer);
  }, [showModal]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const ext = droppedFile.name.split('.').pop()?.toLowerCase();
      if (ext && ['pdf', 'doc', 'docx'].includes(ext)) {
        setFile(droppedFile);
      } else {
        setError('Only PDF, DOC, or DOCX files are allowed.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedJobId) return;

    setLoading(true);
    setError(null);

    showLoading('Uploading CV...');
      try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jobId', selectedJobId);
      if (coverLetter.trim()) formData.append('coverLetter', coverLetter);

      await applicationService.uploadApplicationCv(formData);

      if (onUploadSuccess) onUploadSuccess();
      handleClose();
    } catch (err) {
      hideLoading();
      // Surface backend validation / conflict messages (e.g. 409 Already applied).
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to upload CV';
      setError(message);
    } finally {
      hideLoading();
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={showModal} onClose={handleClose} title="Upload Candidate CV">
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-lg text-sm font-semibold">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">Target Job *</label>
          <select
            className="select w-full"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            required
          >
             <option value="" disabled>Select a job</option>
             {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
             ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">CV File (PDF/DOCX) *</label>
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              isDragActive
                ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10'
                : 'border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/10 hover:border-indigo-500/50 dark:hover:border-indigo-500/40'
            }`}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              required={!file}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            <div className="flex flex-col items-center justify-center space-y-2.5">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/30 dark:border-indigo-900/30 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                  {file ? file.name : 'Click to upload or drag & drop'}
                </p>
                <p className="text-xs text-slate-400 dark:text-zinc-500">PDF, DOCX, or DOC up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">Cover Letter (optional)</label>
          <textarea
            className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 outline-none transition-all border-slate-200 dark:border-zinc-800 focus:border-indigo-500 text-sm resize-none h-24"
            placeholder="Add a short note to the recruiter…"
            maxLength={2000}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 dark:border-zinc-800/60 mt-6 bg-slate-50/50 dark:bg-zinc-900/10 -mx-6 -mb-6 p-6">
          <button
            type="button"
            onClick={handleClose}
            className="btn secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn primary"
            disabled={loading || !file || !selectedJobId}
          >
            {loading ? 'Uploading & Parsing...' : 'Upload & Parse'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
