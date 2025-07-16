const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs'); 
const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
app.use(session({
    secret: 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true in production with HTTPS
}));

// Mock database for demonstration
const users = [
    { id: 1, username: 'admin', email: 'admin@techtrend.com', password: '$2b$10$hash' },
    { id: 2, username: 'user', email: 'user@techtrend.com', password: '$2b$10$hash' }
];

const products = [
    { id: 1, name: 'Gaming Laptop', price: 1299.99, category: 'Electronics', stock: 15 },
    { id: 2, name: 'Wireless Headphones', price: 199.99, category: 'Audio', stock: 50 },
    { id: 3, name: 'Smartphone', price: 699.99, category: 'Electronics', stock: 30 }
];

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Authentication required' });
    }
};

// Routes

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes

// Authentication routes
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        // In real implementation, compare with bcrypt
        // const isValid = await bcrypt.compare(password, user.password);
        const isValid = password === 'password'; // Simplified for demo
        
        if (isValid) {
            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email
            };
            res.json({ success: true, user: req.session.user });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        // Check if user exists
        const existingUser = users.find(u => u.username === username || u.email === email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        
        // In real implementation, hash password
        // const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
            id: users.length + 1,
            username,
            email,
            password: password // In real app, use hashedPassword
        };
        
        users.push(newUser);
        
        req.session.user = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
        };
        
        res.json({ success: true, user: req.session.user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Logout failed' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// Get current user
app.get('/api/user', (req, res) => {
    if (req.session.user) {
        res.json({ success: true, user: req.session.user });
    } else {
        res.status(401).json({ success: false, message: 'Not authenticated' });
    }
});

// Products routes
app.get('/api/products', (req, res) => {
    res.json({ success: true, products });
});

app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    
    if (product) {
        res.json({ success: true, product });
    } else {
        res.status(404).json({ success: false, message: 'Product not found' });
    }
});

// Protected routes
app.post('/api/products', isAuthenticated, (req, res) => {
    const { name, price, category, stock } = req.body;
    
    const newProduct = {
        id: products.length + 1,
        name,
        price: parseFloat(price),
        category,
        stock: parseInt(stock)
    };
    
    products.push(newProduct);
    res.json({ success: true, product: newProduct });
});

app.put('/api/products/:id', isAuthenticated, (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...req.body };
        res.json({ success: true, product: products[productIndex] });
    } else {
        res.status(404).json({ success: false, message: 'Product not found' });
    }
});

app.delete('/api/products/:id', isAuthenticated, (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex !== -1) {
        products.splice(productIndex, 1);
        res.json({ success: true, message: 'Product deleted' });
    } else {
        res.status(404).json({ success: false, message: 'Product not found' });
    }
});

// Orders routes
app.get('/api/orders', isAuthenticated, (req, res) => {
    // Mock orders data
    const orders = [
        { id: 1, userId: req.session.user.id, total: 1299.99, status: 'completed' },
        { id: 2, userId: req.session.user.id, total: 199.99, status: 'pending' }
    ];
    res.json({ success: true, orders });
});

// Stats API (for dashboard)
app.get('/api/stats', isAuthenticated, (req, res) => {
    const stats = {
        totalCustomers: users.length,
        totalProducts: products.length,
        totalOrders: 24,
        customerSatisfaction: 9.2
    };
    res.json({ success: true, stats });
});

// Catch-all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`TechTrend E-commerce server running on port ${PORT}`);
    console.log(`Access the application at: http://localhost:${PORT}`);
});

module.exports = app;