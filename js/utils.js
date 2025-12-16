const apiRoot = '/api';

function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span> <span style="cursor:pointer" onclick="this.parentElement.remove()">×</span>`;

    container.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

async function postJSON(url, data, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    try {
        const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(data) });
        return await res.json();
    } catch (e) { return { error: 'Network error' }; }
}

async function getJSON(url, token = null) {
    const headers = {};
    if (token) headers['Authorization'] = 'Bearer ' + token;
    try {
        const res = await fetch(url, { headers });
        return await res.json();
    } catch (e) { return { error: 'Network error' }; }
}

async function deleteJSON(url, token = null) {
    const headers = {};
    if (token) headers['Authorization'] = 'Bearer ' + token;
    try {
        const res = await fetch(url, { method: 'DELETE', headers });
        return await res.json();
    } catch (e) { return { error: 'Network error' }; }
}
