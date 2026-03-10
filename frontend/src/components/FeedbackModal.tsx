import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CreateFeedbackRequest } from '../types/feedback';
import './FeedbackModal.css';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFeedbackRequest) => Promise<void>;
  isLoading?: boolean;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateFeedbackRequest>({
    name: '',
    email: '',
    message: '',
    category: undefined,
    priority: undefined,
  });
  const [error, setError] = useState<string | null>(null);
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalHost(document.body);
  }, []);

  const CATEGORY_OPTIONS = [
    'Bug',
    'Feature Request',
    'Complaint',
    'Praise',
    'Other',
  ];

  const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!formData.message.trim()) {
      setError('Message is required');
      return;
    }
    if (formData.message.length < 10) {
      setError('Message must be at least 10 characters long');
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({
        name: '',
        email: '',
        message: '',
        category: undefined,
        priority: undefined,
      });
      onClose();
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    }
  };

  if (!isOpen || !portalHost) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Submit Feedback</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Please provide detailed feedback (minimum 10 characters)..."
              rows={5}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category (optional)</label>
            <select
              id="category"
              name="category"
              value={formData.category ?? ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category: e.target.value || undefined,
                }))
              }
              className="filter-select"
              disabled={isLoading}
            >
              <option value="">Let AI decide</option>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority (optional)</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority ?? ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priority: e.target.value || undefined,
                }))
              }
              className="filter-select"
              disabled={isLoading}
            >
              <option value="">Let AI decide</option>
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button button-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    portalHost
  );
};
