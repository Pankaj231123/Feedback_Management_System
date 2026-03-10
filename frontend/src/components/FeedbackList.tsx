import React from 'react';
import { Feedback } from '../types/feedback';
import './FeedbackModal.css';

interface FeedbackListProps {
  feedbacks: Feedback[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<void>;
  isDeletingId?: string;
}

export const FeedbackList: React.FC<FeedbackListProps> = (
  { feedbacks, isLoading, onDelete, isDeletingId }: FeedbackListProps
) => {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'High':
        return '#dc2626';
      case 'Medium':
        return '#f59e0b';
      case 'Low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getSentimentEmoji = (sentiment?: string) => {
    switch (sentiment) {
      case 'Positive':
        return '😊';
      case 'Negative':
        return '😞';
      case 'Neutral':
        return '😐';
      default:
        return '❓';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return <div className="loading">Loading feedbacks...</div>;
  }

  if (feedbacks.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 No feedbacks yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="feedback-list">
      <div className="feedback-grid">
        {feedbacks.map((feedback) => (
          <div key={feedback._id} className="feedback-card">
            <div className="feedback-header">
              <div className="feedback-title">
                <h3>{feedback.name}</h3>
                <span className="sentiment-badge">
                  {getSentimentEmoji(feedback.sentiment)}
                </span>
              </div>
              <button
                className="delete-button"
                onClick={() => feedback._id && onDelete(feedback._id)}
                disabled={isDeletingId === feedback._id}
                title="Delete feedback"
              >
                {isDeletingId === feedback._id ? '⏳' : '🗑️'}
              </button>
            </div>

            <p className="feedback-email">{feedback.email}</p>

            <div className="feedback-badges">
              <span
                className="badge badge-category"
                style={{ backgroundColor: '#e0e7ff' }}
              >
                {feedback.category}
              </span>
              <span
                className="badge badge-priority"
                style={{ backgroundColor: getPriorityColor(feedback.priority) }}
              >
                {feedback.priority}
              </span>
              <span
                className="badge badge-team"
                style={{ backgroundColor: '#dbeafe' }}
              >
                {feedback.team}
              </span>
            </div>

            <p className="feedback-message">{feedback.message}</p>

            <div className="feedback-footer">
              <small>{formatDate(feedback.createdAt)}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
