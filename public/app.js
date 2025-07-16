// Main Application Controller
class TechTrendApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'home';
        this.products = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.loadInitialPage();
    }

    setupEventListeners() {
        // Navigation event listeners
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-page]')) {
                e.preventDefault();
                this.navigateTo(e.target.dataset.page);
            }
        });

        // Form submission listeners
        document.addEventListener('submit', (e) => {
            if (e.target.matches('#loginForm')) {
                e.preventDefault();
                this.handleLogin(e.target);
            } else if (e.target.matches('#registerForm')) {
                e.preventDefault();
                this.handleRegister(e.target);
            } else if (e.target.matches('#productForm')) {
                e.preventDefault();
                this.handleProductSubmit(e.target);
            }
        });

        // Logout listener
        document.addEventListener('click', (e) => {
            if (e.target.matches('#logoutBtn')) {
                e.preventDefault();
                this.handleLogout();
            }
        });

        // Window popstate for browser navigation
        window.addEventListener('popstate', (e) => {
            this.loadPage(e.state?.page || 'home');
        });
    }

    // Authentication methods
    async checkAuthStatus() {
        try {
            const response = await fetch('/api/user');
            const data = await response.json();
            
            if (data.success) {
                this.currentUser = data.user;
                this.updateHeader();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        }
    }

    async handleLogin(form) {
        const formData = new FormData(form);
        const loginData = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();
            
            if (data.success) {
                this.currentUser = data.user;
                this.updateHeader();
                this.navigateTo('dashboard');
                this.showMessage('Login successful!', 'success');
            } else {
                this.showMessage(data.message, 'error');
            }
        } catch (error) {
            this.showMessage('Login failed. Please try again.', 'error');
        }
    }

    async handleRegister(form) {
        const formData = new FormData(form);
        const registerData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData)
            });

            const data = await response.json();
            
            if (data.success) {
                this.currentUser = data.user;
                this.updateHeader();
                this.navigateTo('dashboard');
                this.showMessage('Registration successful!', 'success');
            } else {
                this.showMessage(data.message, 'error');
            }
        } catch (error) {
            this.showMessage('Registration failed. Please try again.', 'error');
        }
    }

    async handleLogout() {
        try {
            const response = await fetch('/api/logout', { method: 'POST' });
            const data = await response.json();
            
            if (data.success) {
                this.currentUser = null;
                this.updateHeader();
                this.navigateTo('home');
                this.showMessage('Logged out successfully!', 'success');
            }
        } catch (error) {
            this.showMessage('Logout failed. Please try again.', 'error');
        }
    }

    // Navigation methods
    navigateTo(page) {
        this.currentPage = page;
        history.pushState({ page }, '', `/${page}`);
        this.loadPage(page);
    }

    loadInitialPage() {
        const path = window.location.pathname.slice(1) || 'home';
        this.loadPage(path);
    }

    async loadPage(page) {
        this.currentPage = page;
        const mainContent = document.getElementById('main-content');
        
        // Show loading
        mainContent.innerHTML = '<div class="loading">Loading...</div>';
        
        try {
            let content = '';
            
            switch (page) {
                case 'home':
                    content = await this.loadHomePage();
                    break;
                case 'products':
                    content = await this.loadProductsPage();
                    break;
                case 'about':
                    content = await this.loadAboutPage();
                    break;
                case 'contact':
                    content = await this.loadContactPage();
                    break;
                case 'login':
                    content = this.loadLoginPage();
                    break;
                case 'register':
                    content = this.loadRegisterPage();
                    break;
                case 'dashboard':
                    content = await this.loadDashboardPage();
                    break;
                default:
                    content = '<div class="error">Page not found</div>';
            }
            
            mainContent.innerHTML = content;
            this.updateActiveNavigation();
        } catch (error) {
            mainContent.innerHTML = '<div class="error">Error loading page</div>';
            console.error('Page load error:', error);
        }
    }

    // Page loading methods
    async loadHomePage() {
        const stats = await this.fetchStats();
        return `
            <div class="hero-section">
                <div class="container">
                    <h1>Welcome to TechTrend</h1>
                    <p>Your premier destination for cutting-edge technology</p>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <h3>${stats.totalProducts || 0}</h3>
                            <p>Products Available</p>
                        </div>
                        <div class="stat-item">
                            <h3>${stats.totalCustomers || 0}</h3>
                            <p>Happy Customers</p>
                        </div>
                        <div class="stat-item">
                            <h3>${stats.totalOrders || 0}</h3>
                            <p>Orders Processed</p>
                        </div>
                        <div class="stat-item">
                            <h3>${stats.customerSatisfaction || 0}/10</h3>
                            <p>Customer Satisfaction</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadProductsPage() {
        await this.fetchProducts();
        let productsHTML = this.products.map(product => `
            <div class="product-card">
                <h3>${product.name}</h3>
                <p class="price">$${product.price}</p>
                <p class="category">${product.category}</p>
                <p class="stock">Stock: ${product.stock}</p>
                <button class="btn-primary">Add to Cart</button>
            </div>
        `).join('');

        return `
            <div class="container">
                <h2>Our Products</h2>
                <div class="products-grid">
                    ${productsHTML}
                </div>
            </div>
        `;
    }

    loadAboutPage() {
        return `
            <div class="container">
                <h2>About TechTrend</h2>
                <div class="about-content">
                    <p>TechTrend is a leading e-commerce platform specializing in cutting-edge technology products.</p>
                    <div class="team-section">
                        <h3>Our Team</h3>
                        <div class="team-grid">
                            <div class="team-member">
                                <h4>John Doe</h4>
                                <p>CEO & Founder</p>
                            </div>
                            <div class="team-member">
                                <h4>Jane Smith</h4>
                                <p>CTO</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadContactPage() {
        return `
            <div class="container">
                <h2>Contact Us</h2>
                <div class="contact-content">
                    <div class="contact-info">
                        <h3>Get in Touch</h3>
                        <p>Email: info@techtrend.com</p>
                        <p>Phone: (555) 123-4567</p>
                        <p>Address: 123 Tech Street, Digital City, DC 12345</p>
                    </div>
                    <form class="contact-form">
                        <input type="text" placeholder="Your Name" required>
                        <input type="email" placeholder="Your Email" required>
                        <textarea placeholder="Your Message" required></textarea>
                        <button type="submit" class="btn-primary">Send Message</button>
                    </form>
                </div>
            </div>
        `;
    }

    loadLoginPage() {
        return `
            <div class="container">
                <div class="auth-form">
                    <h2>Login</h2>
                    <form id="loginForm">
                        <input type="text" name="username" placeholder="Username" required>
                        <input type="password" name="password" placeholder="Password" required>
                        <button type="submit" class="btn-primary">Login</button>
                    </form>
                    <p>Don't have an account? <a href="#" data-page="register">Register here</a></p>
                </div>
            </div>
        `;
    }

    loadRegisterPage() {
        return `
            <div class="container">
                <div class="auth-form">
                    <h2>Register</h2>
                    <form id="registerForm">
                        <input type="text" name="username" placeholder="Username" required>
                        <input type="email" name="email" placeholder="Email" required>
                        <input type="password" name="password" placeholder="Password" required>
                        <button type="submit" class="btn-primary">Register</button>
                    </form>
                    <p>Already have an account? <a href="#" data-page="login">Login here</a></p>
                </div>
            </div>
        `;
    }

    async loadDashboardPage() {
        if (!this.currentUser) {
            this.navigateTo('login');
            return '';
        }

        const stats = await this.fetchStats();
        return `
            <div class="container">
                <h2>Dashboard</h2>
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <h3>${stats.totalCustomers}</h3>
                        <p>Total Customers</p>
                    </div>
                    <div class="stat-card">
                        <h3>${stats.totalProducts}</h3>
                        <p>Products Available</p>
                    </div>
                    <div class="stat-card">
                        <h3>${stats.totalOrders}</h3>
                        <p>Total Orders</p>
                    </div>
                    <div class="stat-card">
                        <h3>${stats.customerSatisfaction}/10</h3>
                        <p>Customer Satisfaction</p>
                    </div>
                </div>
                <div class="dashboard-actions">
                    <button class="btn-primary" data-page="products">Manage Products</button>
                    <button class="btn-secondary">View Orders</button>
                </div>
            </div>
        `;
    }

    // API methods
    async fetchProducts() {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            if (data.success) {
                this.products = data.products;
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    }

    async fetchStats() {
        try {
            const response = await fetch('/api/stats');
            const data = await response.json();
            return data.success ? data.stats : {};
        } catch (error) {
            console.error('Failed to fetch stats:', error);
            return {};
        }
    }

    // UI Helper methods
    updateHeader() {
        const authSection = document.getElementById('auth-section');
        const userSection = document.getElementById('user-section');
        
        if (this.currentUser) {
            authSection.style.display = 'none';
            userSection.style.display = 'block';
            document.getElementById('username').textContent = this.currentUser.username;
        } else {
            authSection.style.display = 'block';
            userSection.style.display = 'none';
        }
    }

    updateActiveNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === this.currentPage) {
                link.classList.add('active');
            }
        });
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TechTrendApp();
});