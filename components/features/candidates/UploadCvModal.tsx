import React, { useState, useEffect } from 'react';
import Modal from '../../ui/dialog/Modal';
import { useUIStore } from '../../../lib/store/useUIStore';
import { api } from '../../../lib/api-client';
import { jobService } from '../../../services/api/job.service';
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

      // Using raw axios via api object since we need to send FormData
      await api.post('/applications/upload', formData);

      if (onUploadSuccess) onUploadSuccess();
      handleClose();
    } catch (err) {
      hideLoading();
      setError(err instanceof Error ? err.message : 'Failed to upload CV');
    } finally {
      hideLoading();
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={showModal} onClose={handleClose} title="Upload Candidate CV">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Job *</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">CV File (PDF/DOCX) *</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 cursor-pointer"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
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
