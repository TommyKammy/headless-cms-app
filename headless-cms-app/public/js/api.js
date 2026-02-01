const API_BASE_URL = '';
const AUTH_TOKEN = 'demo-token';

const api = {
    async fetch(url, options = {}) {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AUTH_TOKEN}`,
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        return response.json();
    },

    // Content Models
    getModels() {
        return this.fetch('/api/admin/models');
    },

    getModel(id) {
        return this.fetch(`/api/admin/models/${id}`);
    },

    createModel(data) {
        return this.fetch('/api/admin/models', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    updateModel(id, data) {
        return this.fetch(`/api/admin/models/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    deleteModel(id) {
        return this.fetch(`/api/admin/models/${id}`, {
            method: 'DELETE'
        });
    },

    // Contents
    getContents(modelId) {
        const query = modelId ? `?modelId=${modelId}` : '';
        return this.fetch(`/api/admin/contents${query}`);
    },

    getContent(id) {
        return this.fetch(`/api/admin/contents/${id}`);
    },

    createContent(data) {
        return this.fetch('/api/admin/contents', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    updateContent(id, data) {
        return this.fetch(`/api/admin/contents/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    deleteContent(id) {
        return this.fetch(`/api/admin/contents/${id}`, {
            method: 'DELETE'
        });
    }
};
