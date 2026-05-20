import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function ProjectDetails() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Task Modal state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskStatus, setTaskStatus] = useState('todo');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskFormError, setTaskFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Project Edit Modal state
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectFormError, setProjectFormError] = useState('');

  const fetchProjectData = async () => {
    try {
      const data = await api.projects.getById(projectId);
      setProject(data.project);
      setTasks(data.tasks);
    } catch (err) {
      showToast(err.message || 'Failed to retrieve project details.', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  // Project CRUD operations from within Project Details page
  const handleOpenEditProjectModal = () => {
    if (!project) return;
    setProjectName(project.name);
    setProjectDesc(project.description);
    setProjectFormError('');
    setProjectModalOpen(true);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim() || projectName.length < 3) {
      setProjectFormError('Project name must be at least 3 characters.');
      return;
    }
    setProjectFormError('');
    setIsSubmitting(true);

    try {
      await api.projects.update(projectId, projectName, projectDesc);
      showToast('Project updated successfully!', 'success');
      setProjectModalOpen(false);
      fetchProjectData();
    } catch (err) {
      showToast(err.message || 'Failed to update project.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete this project? All associated tasks will be permanently removed.')) {
      return;
    }
    try {
      await api.projects.delete(projectId);
      showToast('Project successfully deleted.', 'success');
      navigate('/');
    } catch (err) {
      showToast(err.message || 'Failed to delete project.', 'error');
    }
  };

  // Task CRUD operations
  const handleOpenAddTaskModal = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskDesc('');
    setTaskStatus('todo');
    setTaskAssignee('');
    setTaskFormError('');
    setTaskModalOpen(true);
  };

  const handleOpenEditTaskModal = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDesc(task.description);
    setTaskStatus(task.status);
    setTaskAssignee(task.assignedTo);
    setTaskFormError('');
    setTaskModalOpen(true);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || taskTitle.length < 2) {
      setTaskFormError('Task title must be at least 2 characters.');
      return;
    }
    setTaskFormError('');
    setIsSubmitting(true);

    try {
      if (editingTask) {
        await api.tasks.update(
          editingTask.id,
          taskTitle,
          taskDesc,
          taskStatus,
          taskAssignee
        );
        showToast('Task details updated!', 'success');
      } else {
        await api.tasks.create(
          projectId,
          taskTitle,
          taskDesc,
          taskStatus,
          taskAssignee
        );
        showToast('Task added successfully!', 'success');
      }
      setTaskModalOpen(false);
      fetchProjectData();
    } catch (err) {
      showToast(err.message || 'Failed to save task.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      await api.tasks.delete(taskId);
      showToast('Task deleted successfully.', 'success');
      fetchProjectData();
    } catch (err) {
      showToast(err.message || 'Failed to delete task.', 'error');
    }
  };

  const handleQuickMoveTask = async (task, direction) => {
    const statusSequence = ['todo', 'in-progress', 'done'];
    const currentIndex = statusSequence.indexOf(task.status);
    
    let newIndex = currentIndex + direction;
    if (newIndex < 0 || newIndex >= statusSequence.length) return;

    const newStatus = statusSequence[newIndex];
    try {
      await api.tasks.update(
        task.id,
        task.title,
        task.description,
        newStatus,
        task.assignedTo
      );
      showToast(`Task moved to ${newStatus === 'in-progress' ? 'In Progress' : newStatus === 'done' ? 'Done' : 'To Do'}`, 'success');
      fetchProjectData();
    } catch (err) {
      showToast(err.message || 'Failed to move task.', 'error');
    }
  };

  // Filter tasks based on Search query & Dropdown filter
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in-progress');
  const doneTasks = filteredTasks.filter((t) => t.status === 'done');

  return (
    <div className="project-details-page">
      {/* Loading Skeletons */}
      {loading ? (
        <>
          <div className="project-details-header skeleton-shimmer skeleton-card" style={{ height: '180px' }} />
          <div className="controls-bar">
            <div className="skeleton-shimmer" style={{ width: '250px', height: '40px', borderRadius: '12px' }} />
            <div className="skeleton-shimmer" style={{ width: '150px', height: '40px', borderRadius: '12px' }} />
          </div>
          <div className="kanban-board">
            {[1, 2, 3].map((n) => (
              <div key={n} className="kanban-column" style={{ opacity: 0.5 }}>
                <div className="skeleton-task skeleton-shimmer" />
                <div className="skeleton-task skeleton-shimmer" />
              </div>
            ))}
          </div>
        </>
      ) : !project ? (
        <div className="empty-state">
          <h3 className="empty-state-title">Project not found</h3>
          <p className="empty-state-desc">The project may have been deleted by another administrator.</p>
          <Link to="/" className="btn btn-primary">Return to Dashboard</Link>
        </div>
      ) : (
        <>
          {/* Breadcrumb & Navigation Header */}
          <div className="project-details-header">
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">📂 Dashboard</Link>
              <span>➔</span>
              <span>Project Details</span>
            </div>
            
            <div className="project-title-section">
              <div>
                <h1 className="section-title" style={{ fontSize: '2.2rem', color: 'white' }}>{project.name}</h1>
                <p className="project-desc-text" style={{ marginTop: '0.5rem' }}>
                  {project.description || 'No description provided for this project.'}
                </p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'hsl(var(--color-text-muted))' }}>
                  <span>📅 Created on: {new Date(project.createdAt).toLocaleDateString(undefined, { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}</span>
                  <span>📊 Total Tasks: {tasks.length}</span>
                </div>
              </div>
              <div className="project-header-actions">
                <button className="btn btn-secondary" onClick={handleOpenEditProjectModal}>
                  ✏️ Edit
                </button>
                <button className="btn btn-danger" onClick={handleDeleteProject}>
                  🗑️ Delete Project
                </button>
              </div>
            </div>
          </div>

          {/* Controls Bar for Search & Filters */}
          <div className="controls-bar">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search tasks by title or content..."
                className="form-input search-field"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="filter-group">
                <label className="filter-label">Filter stage:</label>
                <select
                  className="select-dropdown"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All columns</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              
              <button className="btn btn-primary" onClick={handleOpenAddTaskModal}>
                <span>＋</span> Add Task
              </button>
            </div>
          </div>

          {/* Kanban Board Columns */}
          <div className="kanban-board">
            
            {/* Column 1: TO DO */}
            {(statusFilter === 'all' || statusFilter === 'todo') && (
              <div className="kanban-column">
                <div className="kanban-column-header">
                  <div className="column-title-box">
                    <div className="column-indicator todo" />
                    <h3 className="column-title">To Do</h3>
                  </div>
                  <span className="column-count">{todoTasks.length}</span>
                </div>
                <div className="task-list">
                  {todoTasks.length === 0 ? (
                    <div className="empty-state" style={{ minHeight: '120px', padding: '1.5rem' }}>
                      <span style={{ fontSize: '0.85rem' }}>No tasks in To Do</span>
                    </div>
                  ) : (
                    todoTasks.map((task) => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onEdit={handleOpenEditTaskModal}
                        onDelete={handleDeleteTask}
                        onMoveLeft={null} // Cannot move left of To Do
                        onMoveRight={() => handleQuickMoveTask(task, 1)}
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Column 2: IN PROGRESS */}
            {(statusFilter === 'all' || statusFilter === 'in-progress') && (
              <div className="kanban-column">
                <div className="kanban-column-header">
                  <div className="column-title-box">
                    <div className="column-indicator in-progress" />
                    <h3 className="column-title">In Progress</h3>
                  </div>
                  <span className="column-count">{inProgressTasks.length}</span>
                </div>
                <div className="task-list">
                  {inProgressTasks.length === 0 ? (
                    <div className="empty-state" style={{ minHeight: '120px', padding: '1.5rem' }}>
                      <span style={{ fontSize: '0.85rem' }}>No tasks In Progress</span>
                    </div>
                  ) : (
                    inProgressTasks.map((task) => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onEdit={handleOpenEditTaskModal}
                        onDelete={handleDeleteTask}
                        onMoveLeft={() => handleQuickMoveTask(task, -1)}
                        onMoveRight={() => handleQuickMoveTask(task, 1)}
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Column 3: DONE */}
            {(statusFilter === 'all' || statusFilter === 'done') && (
              <div className="kanban-column">
                <div className="kanban-column-header">
                  <div className="column-title-box">
                    <div className="column-indicator done" />
                    <h3 className="column-title">Done</h3>
                  </div>
                  <span className="column-count">{doneTasks.length}</span>
                </div>
                <div className="task-list">
                  {doneTasks.length === 0 ? (
                    <div className="empty-state" style={{ minHeight: '120px', padding: '1.5rem' }}>
                      <span style={{ fontSize: '0.85rem' }}>No tasks completed</span>
                    </div>
                  ) : (
                    doneTasks.map((task) => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onEdit={handleOpenEditTaskModal}
                        onDelete={handleDeleteTask}
                        onMoveLeft={() => handleQuickMoveTask(task, -1)}
                        onMoveRight={null} // Cannot move right of Done
                      />
                    ))
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Project Edit Modal */}
          {projectModalOpen && (
            <div className="modal-overlay" onClick={() => setProjectModalOpen(false)}>
              <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3 className="modal-title">Edit Project Details</h3>
                  <button className="modal-close" onClick={() => setProjectModalOpen(false)}>×</button>
                </div>
                <form onSubmit={handleProjectSubmit}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label className="form-label" htmlFor="editProjName">Project Name</label>
                      <input
                        type="text"
                        id="editProjName"
                        className="form-input"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        disabled={isSubmitting}
                        required
                      />
                      {projectFormError && <span className="error-msg">{projectFormError}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="editProjDesc">Description</label>
                      <textarea
                        id="editProjDesc"
                        className="form-input"
                        rows="4"
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
                      onClick={() => setProjectModalOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Task Create/Edit Modal */}
          {taskModalOpen && (
            <div className="modal-overlay" onClick={() => setTaskModalOpen(false)}>
              <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3 className="modal-title">{editingTask ? 'Edit Task Details' : 'Add New Task'}</h3>
                  <button className="modal-close" onClick={() => setTaskModalOpen(false)}>×</button>
                </div>
                <form onSubmit={handleTaskSubmit}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label className="form-label" htmlFor="taskTitle">Task Title</label>
                      <input
                        type="text"
                        id="taskTitle"
                        className="form-input"
                        placeholder="e.g. Design Dashboard UI"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        disabled={isSubmitting}
                        required
                      />
                      {taskFormError && <span className="error-msg">{taskFormError}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label" htmlFor="taskDesc">Description</label>
                      <textarea
                        id="taskDesc"
                        className="form-input"
                        rows="4"
                        placeholder="Detail the steps or objectives needed to achieve this task..."
                        value={taskDesc}
                        onChange={(e) => setTaskDesc(e.target.value)}
                        disabled={isSubmitting}
                        style={{ resize: 'none' }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="taskAssignee">Assigned To</label>
                      <input
                        type="text"
                        id="taskAssignee"
                        className="form-input"
                        placeholder="e.g. Abhishek"
                        value={taskAssignee}
                        onChange={(e) => setTaskAssignee(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>

                    {editingTask && (
                      <div className="form-group">
                        <label className="form-label" htmlFor="taskStatus">Stage / Status</label>
                        <select
                          id="taskStatus"
                          className="select-dropdown"
                          value={taskStatus}
                          onChange={(e) => setTaskStatus(e.target.value)}
                          disabled={isSubmitting}
                        >
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setTaskModalOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : editingTask ? 'Save Changes' : 'Create Task'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Subcomponent: TaskCard
function TaskCard({ task, onEdit, onDelete, onMoveLeft, onMoveRight }) {
  return (
    <div className="task-card" onClick={() => onEdit(task)}>
      <div>
        <h4 className="task-card-title">{task.title}</h4>
        <p className="task-card-desc">{task.description || 'No description provided.'}</p>
      </div>
      <div className="task-card-footer" onClick={(e) => e.stopPropagation()}>
        <span className="task-assignee">
          👤 {task.assignedTo ? task.assignedTo : 'Unassigned'}
        </span>
        <div style={{ display: 'flex', gap: '0.1rem', alignItems: 'center' }}>
          {/* Quick-move columns controls */}
          {onMoveLeft && (
            <button 
              className="icon-btn" 
              title="Move to previous stage" 
              onClick={() => onMoveLeft()}
            >
              ◀
            </button>
          )}
          
          <button 
            className="icon-btn edit" 
            title="Edit details" 
            onClick={() => onEdit(task)}
          >
            ✏️
          </button>
          
          <button 
            className="icon-btn delete" 
            title="Delete task" 
            onClick={() => onDelete(task.id)}
          >
            🗑️
          </button>

          {onMoveRight && (
            <button 
              className="icon-btn" 
              title="Move to next stage" 
              onClick={() => onMoveRight()}
            >
              ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
