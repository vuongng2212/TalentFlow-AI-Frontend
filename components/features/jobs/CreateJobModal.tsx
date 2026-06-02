import React, { useState } from 'react';
import Modal from '../../ui/dialog/Modal';
import { jobService } from '../../../services/api/job.service';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: () => void;
}

export default function CreateJobModal({ isOpen, onClose, onJobCreated }: CreateJobModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
        status: 'DRAFT', // Always create as draft first
        createdById: '1' // Temporary fallback, backend should override based on auth token
      });

      onJobCreated();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Requisition">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary (USD)</label>
            <input
              type="number"
              name="salaryMin"
              value={formData.salaryMin}
              onChange={handleChange}
              className="input w-full"
              placeholder="120000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary (USD)</label>
            <input
              type="number"
              name="salaryMax"
              value={formData.salaryMax}
              onChange={handleChange}
              className="input w-full"
              placeholder="160000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea w-full h-24"
            placeholder="Brief description of the role..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (one per line)</label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            className="textarea w-full h-32"
            placeholder="- 5+ years experience with React&#10;- Strong communication skills"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
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
            {loading ? 'Creating...' : 'Create Draft'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
