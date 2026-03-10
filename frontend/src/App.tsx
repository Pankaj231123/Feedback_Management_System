import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Feedback, CreateFeedbackRequest } from './types/feedback';
import { feedbackApi } from './api/feedbackApi';
import { FeedbackModal } from './components/FeedbackModal';
import { SearchFilters } from './components/SearchFilters';
import { FeedbackList } from './components/FeedbackList';
import './App.css';

function App() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Filter states
  const [nameFilter, setNameFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Fetch feedbacks with current filters
  const loadFeedbacks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await feedbackApi.getFeedbacks({
        name: nameFilter || undefined,
        category: categoryFilter || undefined,
        priority: priorityFilter || undefined,
      });

      if (response.data) {
        setFeedbacks(response.data);
      }
    } catch (error) {
      console.error('Failed to load feedbacks:', error);
      alert('Failed to load feedbacks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [nameFilter, categoryFilter, priorityFilter]);

  // Load feedbacks on mount and when filters change
  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  // Handle creating new feedback
  const handleCreateFeedback = async (data: CreateFeedbackRequest) => {
    try {
      await feedbackApi.createFeedback(data);
      alert('✅ Feedback submitted successfully!');
      // Reload feedbacks to see the new one
      await loadFeedbacks();
    } catch (error) {
      console.error('Failed to create feedback:', error);
      throw error;
    }
  };

  const insightCards = useMemo(() => {
    const total = feedbacks.length;
    const highPriority = feedbacks.filter((f) => f.priority === 'High').length;
    const positive = feedbacks.filter((f) => f.sentiment === 'Positive').length;
    const activeTeams = new Set(
      feedbacks
        .map((f) => f.team)
        .filter((team): team is string => Boolean(team))
    ).size;

    return [
      { label: 'Total Feedback', value: total, accent: 'primary' },
      { label: 'High Priority', value: highPriority, accent: 'warning' },
      { label: 'Positive Sentiment', value: positive, accent: 'success' },
      { label: 'Teams Engaged', value: activeTeams, accent: 'info' },
    ];
  }, [feedbacks]);

  // Handle deleting feedback
  const handleDeleteFeedback = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    setIsDeletingId(id);
    try {
      await feedbackApi.deleteFeedback(id);
      alert('✅ Feedback deleted successfully!');
      // Reload feedbacks
      await loadFeedbacks();
    } catch (error) {
      console.error('Failed to delete feedback:', error);
      alert('Failed to delete feedback. Please try again.');
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🎯 Feedback Management System</h1>
          <p>Powered by AI - Intelligent Feedback Classification</p>
        </div>
        <button
          className="button button-primary"
          onClick={() => setIsModalOpen(true)}
        >
          + Submit Feedback
        </button>
      </header>

      <section className="insights-section">
        {insightCards.map((card) => (
          <article key={card.label} className={`insight-card accent-${card.accent}`}>
            <span className="insight-label">{card.label}</span>
            <strong className="insight-value">{card.value}</strong>
          </article>
        ))}
      </section>

      <main className="app-main">
        <section className="filters-section">
          <h2>Search & Filter</h2>
          <SearchFilters
            nameValue={nameFilter}
            categoryValue={categoryFilter}
            priorityValue={priorityFilter}
            onNameChange={setNameFilter}
            onCategoryChange={setCategoryFilter}
            onPriorityChange={setPriorityFilter}
          />
        </section>

        <section className="feedbacks-section">
          <div className="section-header">
            <h2>Recent Feedbacks</h2>
            <span className="count-badge">{feedbacks.length} feedbacks</span>
          </div>
          <FeedbackList
            feedbacks={feedbacks}
            isLoading={isLoading}
            onDelete={handleDeleteFeedback}
            isDeletingId={isDeletingId ?? undefined}
          />
        </section>
      </main>

      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateFeedback}
      />
    </div>
  );
}

export default App;
