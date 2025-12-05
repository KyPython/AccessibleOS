import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Task } from '../types/Task';
import './TaskList.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  if (loading) {
    return (
      <section aria-label="Loading tasks">
        <p>Loading tasks...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section aria-label="Error loading tasks" role="alert">
        <p className="error-message">Error: {error}</p>
        <button onClick={fetchTasks} className="primary">
          Retry
        </button>
      </section>
    );
  }

  return (
    <section aria-label="Task list">
      <div className="task-list-header">
        <h1>Tasks</h1>
        <Link to="/tasks/new" className="button primary" role="button">
          Create New Task
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div role="status" aria-live="polite">
          <p>No tasks found. Create your first task to get started!</p>
        </div>
      ) : (
        <ul className="task-list" role="list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item" role="listitem">
              <article>
                <h2>
                  <Link to={`/tasks/${task.id}/edit`}>{task.title}</Link>
                </h2>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                <div className="task-meta">
                  <span className="task-status" aria-label={`Status: ${task.status}`}>
                    {task.status}
                  </span>
                  {task.dueDate && (
                    <time dateTime={task.dueDate}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </time>
                  )}
                </div>
                {task.hasMedia && task.altText && (
                  <p className="task-alt-text" aria-label="Media description">
                    Media: {task.altText}
                  </p>
                )}
                <div className="task-actions">
                  <Link
                    to={`/tasks/${task.id}/edit`}
                    className="button"
                    aria-label={`Edit task: ${task.title}`}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="button danger"
                    aria-label={`Delete task: ${task.title}`}
                  >
                    Delete
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

