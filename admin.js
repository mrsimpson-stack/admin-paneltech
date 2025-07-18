document.addEventListener('DOMContentLoaded', function() {
    // Check admin authentication
    checkAdminAuth();
    
    // Load initial data
    loadDashboardData();
    
    // Setup event listeners
    setupEventListeners();
});

function checkAdminAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/admin-login.html';
    }
    
    // Verify token with server
    fetch('/api/admin/verify', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            window.location.href = '/admin-login.html';
        }
    })
    .catch(() => {
        window.location.href = '/admin-login.html';
    });
}

function loadDashboardData() {
    fetch('/api/admin/stats')
    .then(response => response.json())
    .then(data => {
        // Update dashboard with data
        updateDashboardUI(data);
    })
    .catch(error => {
        console.error('Error loading dashboard data:', error);
    });
}

function updateDashboardUI(data) {
    // Implement this to update your dashboard UI
    console.log('Dashboard data:', data);
}

function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('href').substring(1);
            showTab(tabId);
        });
    });
    
    // Logout
    document.getElementById('logout').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('adminToken');
        window.location.href = '/admin-login.html';
    });
}

function showTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabId).classList.add('active');
    
    // Update page title
    document.getElementById('page-title').textContent = 
        document.querySelector(`.nav-links a[href="#${tabId}"]`).textContent;
    
    // Load data for this tab if needed
    if (tabId === 'users') {
        loadUsers();
    } else if (tabId === 'deposits') {
        loadDeposits();
    } else if (tabId === 'withdrawals') {
        loadWithdrawals();
    }
}

// Add more functions to load and manage data