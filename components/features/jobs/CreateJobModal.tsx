import React, { useState, useEffect } from 'react';
import Modal from '../../ui/dialog/Modal';
import { useUIStore } from '../../../lib/store/useUIStore';
import { jobService } from '../../../services/api/job.service';
import { useModalStore } from '../../../lib/store/useModalStore';

interface CreateJobModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onJobCreated?: () => void;
}

export default function CreateJobModal({ isOpen, onClose, onJobCreated }: CreateJobModalProps) {
  const activeModal = useModalStore((state) => state.activeModal);
  const closeModal = useModalStore((state) => state.closeModal);

  const showModal = isOpen !== undefined ? isOpen : (activeModal === 'create-job');
  const handleClose = onClose || closeModal;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showLoading, hideLoading } = useUIStore();

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    employmentType: 'FULL_TIME',
    description: '',
    requirements: '',
    salaryMin: '',
    salaryMax: '',
  });

  useEffect(() => {
    if (showModal) {
      setError(null);
      setFormData({
        title: '',
        department: '',
        location: '',
        employmentType: 'FULL_TIME',
        description: '',
        requirements: '',
        salaryMin: '',
        salaryMax: '',
      });
    }
  }, [showModal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    showLoading('Creating job...');
      try {
      await jobService.createJob({
        title: formData.title,
        department: formData.department,
        location: formData.location,
        employmentType: formData.employmentType as any,
        description: formData.description,
        requirements: formData.requirements.split('\n').filter(r => r.trim() !== ''),
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : undefined,
        status: 'DRAFT' // Always create as draft first
      });

      if (onJobCreated) onJobCreated();
      handleClose();
    } catch (err) {
      hideLoading();
      setError(err instanceof Error ? err.message : 'Failed to create job');
    } finally {
      hideLoading();
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={showModal} onClose={handleClose} title="Create New Requisition">
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-lg text-sm font-semibold">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">Job Title *</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="input w-full"
            placeholder="e.g. Senior Frontend Engineer"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">Department *</label>
            <input
              type="text"
              name="department"
              required
              value={formData.department}
              onChange={handleChange}
              className="input w-full"
              placeholder="e.g. Engineering"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">Location *</label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="input w-full"
              placeholder="e.g. Remote, US"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">Type *</label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="select w-full"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">Min Salary (USD)</label>
            <input
              type="number"
              name="salaryMin"
              value={formData.salaryMin}
              onChange={handleChange}
              className="input w-full tabular-nums font-mono"
              placeholder="120000"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">Max Salary (USD)</label>
            <input
              type="number"
              name="salaryMax"
              value={formData.salaryMax}
              onChange={handleChange}
              className="input w-full tabular-nums font-mono"
              placeholder="160000"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea w-full h-24"
            placeholder="Brief description of the role..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">Requirements (one per line)</label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            className="textarea w-full h-32"
            placeholder="- 5+ years experience with React&#10;- Strong communication skills"
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
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Draft'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
