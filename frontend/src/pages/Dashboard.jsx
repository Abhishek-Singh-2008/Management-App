import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const data = await api.projects.getAll();
      setProjects(data);
    } catch (err) {
      showToast(err.message || 'Failed to load projects.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setProjectName('');
    setProjectDesc('');
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (e, project) => {
    e.stopPropagation(); // Stop navigation trigger
    setEditingProject(project);
    setProjectName(project.name);
    setProjectDesc(project.description);
    setFormError('');
    setModalOpen(true);
  };

  const handleDeleteProject = async (e, id) => {
    e.stopPropagation(); // Stop navigation trigger
    if (!window.confirm('Are you absolutely sure you want to delete this project? All associated tasks will be permanently removed.')) {
      return;
    }

    try {
      await api.projects.delete(id);
      showToast('Project and its tasks successfully deleted.', 'success');
      fetchProjects();
    } catch (err) {
      showToast(err.message || 'Failed to delete project.', 'error');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim() || projectName.length < 3) {
      setFormError('Project name must be at least 3 characters.');
      return;
    }
    setFormError('');
    setIsSubmitting(true);

    try {
      if (editingProject) {
        await api.projects.update(editingProject.id, projectName, projectDesc);
        showToast('Project details successfully updated!', 'success');
      } else {
        await api.projects.create(projectName, projectDesc);
        showToast('New project created successfully!', 'success');
      }
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      showToast(err.message || 'Failed to save project.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Aggregated Stats
  const totalProjects = projects.length;
  const totalTasks = projects.reduce((acc, curr) => acc + (curr.taskCount || 0), 0);
  const averageTasks = totalProjects > 0 ? (totalTasks / totalProjects).toFixed(1) : 0;

  return (
    <div className="dashboard-page">
      {/* Header Info */}
      <div className="section-header" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '2.2rem' }}>Welcome, Workspace Owner</h1>
          <p style={{ color: 'hsl(var(--color-text-secondary))', marginTop: '0.25rem' }}>
            {user?.email} • Manage your work roadmap, objectives, and task queues.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={handleOpenCreateModal}>
            <span>＋</span> Create Project
          </button>
          <button className="btn btn-secondary" onClick={logout}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Analytics Statistics Banner */}
      <div className="stats-banner">
        <div className="stats-card">
          <div className="stats-icon-wrapper primary">📂</div>
          <div className="stats-details">
            <span className="stats-count">{totalProjects}</span>
            <span className="stats-label">Total Projects</span>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-icon-wrapper cyan">📋</div>
          <div className="stats-details">
            <span className="stats-count">{totalTasks}</span>
            <span className="stats-label">Total Active Tasks</span>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-icon-wrapper emerald">⚖️</div>
          <div className="stats-details">
            <span className="stats-count">{averageTasks}</span>
            <span className="stats-label">Avg. Tasks / Project</span>
          </div>
        </div>
      </div>

      {/* Projects Title */}
      <div className="section-header">
        <h2 className="section-title">Your active projects</h2>
        <span style={{ fontSize: '0.9rem', color: 'hsl(var(--color-text-muted))' }}>
          Showing {totalProjects} projects
        </span>
      </div>

      {/* Project Loading / List / Empty View */}
      {loading ? (
        <div className="projects-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton-card skeleton-shimmer" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ fontSize: '3rem' }}>📂</div>
          <h3 className="empty-state-title">No projects found</h3>
          <p className="empty-state-desc">Get started by creating your very first project to manage tasks and goals.</p>
          <button className="btn btn-primary" onClick={handleOpenCreateModal}>
            <span>＋</span> Create Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="project-card" 
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <div>
                <div className="project-meta-top">
                  <h3 className="project-card-name">{project.name}</h3>
                  <span className="task-count-tag">
                    {project.taskCount || 0} {project.taskCount === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
                <p className="project-card-description">{project.description || 'No description provided.'}</p>
              </div>
              <div className="project-meta-bottom">
                <span className="project-date">
                  📅 {new Date(project.createdAt).toLocaleDateString(undefined, { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
                <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
                  <button 
                    className="icon-btn edit" 
                    title="Edit project"
                    onClick={(e) => handleOpenEditModal(e, project)}
                  >
                    ✏️
                  </button>
                  <button 
                    className="icon-btn delete" 
                    title="Delete project"
                    onClick={(e) => handleDeleteProject(e, project.id)}
                  >
                    🗑️
                  </button>
                  <span className="project-arrow" style={{ marginLeft: '0.5rem' }}>➔</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Create/Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingProject ? 'Edit Project details' : 'Create New Project'}</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="projectName">Project Name</label>
                  <input
                    type="text"
                    id="projectName"
                    className="form-input"
                    placeholder="e.g. Website Redesign"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                  {formError && <span className="error-msg">{formError}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="projectDesc">Description</label>
                  <textarea
                    id="projectDesc"
                    className="form-input"
                    rows="4"
                    placeholder="Provide a detailed roadmap or objectives description..."
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    disabled={isSubmitting}
                    style={{ resize: 'none' }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingProject ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
