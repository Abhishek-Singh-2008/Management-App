const API_BASE_URL = window.location.origin.includes(':5173')
  ? 'http://localhost:5000/api'
  : '/api';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // If we're not on the login page already, redirect to login
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
    const data = await response.json();
    throw new Error(data.error || 'Session expired. Please log in again.');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.errors?.[0] || 'Something went wrong.');
  }
  return data;
};

export const api = {
  auth: {
    async register(email, password) {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(res);
    },

    async login(email, password) {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(res);
    },
  },

  projects: {
    async getAll() {
      const res = await fetch(`${API_BASE_URL}/projects`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    async getById(id) {
      const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },

    async create(name, description) {
      const res = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, description }),
      });
      return handleResponse(res);
    },

    async update(id, name, description) {
      const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ name, description }),
      });
      return handleResponse(res);
    },

    async delete(id) {
      const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  tasks: {
    async create(projectId, title, description, status, assignedTo) {
      const res = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ title, description, status, assignedTo }),
      });
      return handleResponse(res);
    },

    async update(id, title, description, status, assignedTo) {
      const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ title, description, status, assignedTo }),
      });
      return handleResponse(res);
    },

    async delete(id) {
      const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },
};
