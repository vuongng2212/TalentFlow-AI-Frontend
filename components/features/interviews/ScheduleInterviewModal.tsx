import React, { useState, useEffect } from 'react';
import Modal from '../../ui/dialog/Modal';
import { interviewService } from '../../../services/api/interview.service';
import { applicationService } from '../../../services/api/application.service';
import { userService } from '../../../services/api/user.service';
import { Application } from '../../../types';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInterviewScheduled: () => void;
}

export default function ScheduleInterviewModal({ isOpen, onClose, onInterviewScheduled }: ScheduleInterviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviewers, setInterviewers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    applicationId: '',
    interviewerId: '',
    type: 'TECHNICAL',
    scheduledAt: '',
    duration: 60,
    location: '',
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      // Load active applications
      applicationService.getApplications({ limit: 50 }).then(res => {
         setApplications(res.data);
      }).catch(console.error);

      // Load users/interviewers
      userService.getUsers({ limit: 50 }).then(res => {
         // Naive mapping, assuming backend paginated data structure
         setInterviewers(res.data || []);
      }).catch(console.error);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.scheduledAt) {
         throw new Error('Please select a date and time');
      }

      await interviewService.createInterview({
        applicationId: formData.applicationId,
        interviewerId: formData.interviewerId,
        type: formData.type as any,
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
        duration: Number(formData.duration),
        location: formData.location,
        notes: formData.notes,
      });

      onInterviewScheduled();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Interview">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Application / Candidate *</label>
          <select
            name="applicationId"
            required
            value={formData.applicationId}
            onChange={handleChange}
            className="select w-full"
          >
             <option value="" disabled>Select a candidate</option>
             {applications.map(app => (
                <option key={app.id} value={app.id}>
                  {app.candidate?.fullName} ({app.job?.title})
                </option>
             ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer *</label>
          <select
            name="interviewerId"
            required
            value={formData.interviewerId}
            onChange={handleChange}
            className="select w-full"
          >
             <option value="" disabled>Select an interviewer</option>
             {interviewers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.fullName} ({user.email})
                </option>
             ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="select w-full"
            >
              <option value="SCREENING">Screening</option>
              <option value="TECHNICAL">Technical</option>
              <option value="CULTURE_FIT">Culture Fit</option>
              <option value="FINAL">Final</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins) *</label>
            <input
              type="number"
              name="duration"
              min="15"
              step="15"
              required
              value={formData.duration}
              onChange={handleChange}
              className="input w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time *</label>
          <input
            type="datetime-local"
            name="scheduledAt"
            required
            value={formData.scheduledAt}
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location / Meeting Link</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="input w-full"
            placeholder="https://zoom.us/j/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="textarea w-full h-24"
            placeholder="Focus areas for this interview..."
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
            disabled={loading || !formData.applicationId || !formData.interviewerId}
          >
            {loading ? 'Scheduling...' : 'Schedule Interview'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
