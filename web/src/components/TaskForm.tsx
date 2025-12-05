import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Task } from '../types/Task';
import './TaskForm.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function TaskForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'PENDING',
    dueDate: '',
    altText: '',
    hasMedia: false,
    labels: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      fetchTask(id);
    }
  }, [id, isEditing]);

  const fetchTask = async (taskId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/tasks/${taskId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch task');
      }
      const data = await response.json();
      const task = data.data;
      setFormData({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : 'Failed to load task' });
    } finally {
      setLoading(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = 'Title is required';
    }

    if (formData.hasMedia && (!formData.altText || formData.altText.trim() === '')) {
      newErrors.altText = 'Alt text is required when media is included';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      const url = isEditing ? `${API_URL}/tasks/${id}` : `${API_URL}/tasks`;
      const method = isEditing ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        dueDate: formData.dueDate || null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save task');
      }

      navigate('/');
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : 'Failed to save task',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Task, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (loading && isEditing) {
    return (
      <section aria-label="Loading task">
        <p>Loading task...</p>
      </section>
    );
  }

  return (
    <section aria-label={isEditing ? 'Edit task' : 'Create new task'}>
      <h1>{isEditing ? 'Edit Task' : 'Create New Task'}</h1>

      <form onSubmit={handleSubmit} noValidate aria-label="Task form">
        {errors.general && (
          <div role="alert" className="error-message" aria-live="assertive">
            {errors.general}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="title">
            Title <span aria-label="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            aria-required="true"
            aria-describedby={errors.title ? 'title-error' : undefined}
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <span id="title-error" className="error-message" role="alert">
              {errors.title}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
            aria-describedby="description-help"
          />
          <span id="description-help" className="help-text">
            Provide additional details about the task
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={formData.status || 'PENDING'}
            onChange={(e) => handleChange('status', e.target.value)}
            aria-describedby="status-help"
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <span id="status-help" className="help-text">
            Current status of the task
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            value={formData.dueDate || ''}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            aria-describedby="dueDate-help"
          />
          <span id="dueDate-help" className="help-text">
            Optional due date for the task
          </span>
        </div>

        <fieldset className="form-group">
          <legend>Media & Accessibility</legend>
          
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="hasMedia"
              checked={formData.hasMedia || false}
              onChange={(e) => handleChange('hasMedia', e.target.checked)}
            />
            <label htmlFor="hasMedia">This task includes media (images, videos, etc.)</label>
          </div>

          {formData.hasMedia && (
            <div className="form-group">
              <label htmlFor="altText">
                Alt Text <span aria-label="required">*</span>
              </label>
              <input
                type="text"
                id="altText"
                value={formData.altText || ''}
                onChange={(e) => handleChange('altText', e.target.value)}
                required={formData.hasMedia}
                aria-required={formData.hasMedia}
                aria-describedby={
                  errors.altText
                    ? 'altText-error'
                    : 'altText-help'
                }
                aria-invalid={!!errors.altText}
              />
              {errors.altText && (
                <span id="altText-error" className="error-message" role="alert">
                  {errors.altText}
                </span>
              )}
              {!errors.altText && (
                <span id="altText-help" className="help-text">
                  Describe the media content for screen readers and accessibility
                </span>
              )}
            </div>
          )}
        </fieldset>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </section>
  );
}

