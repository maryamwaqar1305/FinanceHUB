/**
 * FinanceHub API Client
 * Handles all communication with the Node.js backend.
 * Set API_BASE_URL to your Render backend URL before deploying.
 */

const API_BASE_URL = (window.FINANCEHUB_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getToken() {
    return localStorage.getItem('financehub_token');
}

async function request(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE_URL}${path}`, options);

    let data;
    try {
        data = await res.json();
    } catch {
        throw new Error(res.ok ? 'Invalid server response' : `Request failed (${res.status})`);
    }

    if (!res.ok) {
        throw new Error(data.msg || `Request failed (${res.status})`);
    }
    return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

const Auth = {
    register: (name, email, phone, password) =>
        request('POST', '/api/auth/register', { name, email, phone, password }),

    login: (email, password) =>
        request('POST', '/api/auth/login', { email, password }),

    me: () => request('GET', '/api/auth/me'),
};

// ─── Transactions ─────────────────────────────────────────────────────────────

const Transactions = {
    getAll: () => request('GET', '/api/transactions'),
    create: (data) => request('POST', '/api/transactions', data),
    update: (id, data) => request('PUT', `/api/transactions/${id}`, data),
    delete: (id) => request('DELETE', `/api/transactions/${id}`),
};

// ─── Goals ────────────────────────────────────────────────────────────────────

const Goals = {
    getAll: () => request('GET', '/api/goals'),
    create: (data) => request('POST', '/api/goals', data),
    update: (id, data) => request('PUT', `/api/goals/${id}`, data),
    delete: (id) => request('DELETE', `/api/goals/${id}`),
};

// ─── Holdings ─────────────────────────────────────────────────────────────────

const Holdings = {
    getAll: () => request('GET', '/api/holdings'),
    create: (data) => request('POST', '/api/holdings', data),
    delete: (id) => request('DELETE', `/api/holdings/${id}`),
};

window.FinanceAPI = { Auth, Transactions, Goals, Holdings };
