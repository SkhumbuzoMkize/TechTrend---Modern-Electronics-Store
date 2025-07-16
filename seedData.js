const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const products = [
    {
        name: "Smartphone Pro X",
        description: "Latest flagship smartphone with advanced camera system and 5G connectivity.",
        price: 999.99,
        category: "Mobile",
        image: "📱",
        stock: 50,
        featured: true
    },
    {
        name: "Wireless Headphones",
        description: "Premium noise-cancelling wireless headphones with 30-hour battery life.",
        price: 299.99,
        category: "Audio",
        image: "🎧",
        stock: 30,
        featured: true
    },
    {
        name: "Smart Watch Ultra",
        description: "Advanced fitness tracking and smart features in a sleek design.",
        price: 449.99,
        category: "Accessories",
        image: "⌚",
        stock: 25,
        featured: false
    },
    {
        name: "Laptop Gaming Beast",
        description: "High-performance gaming laptop with RTX graphics and 16GB RAM.",
        price: 1599.99,
        category: "Computers",
        image: "💻",
        stock: 15,
        featured: true
    },
    {
        name: "Tablet Pro 12",
        description: "Professional tablet with stylus support and all-day battery.",
        price: 799.99,
        category: "Electronics",
        image: "📱",
        stock: 20,
        featured: false
    },
    {
        name: "Wireless Speaker",
        description: "Portable Bluetooth speaker with 360-degree sound and waterproof design.",
        price: 199.99,
        category: "Audio",
        image: "🔊",
        stock: 40,
        featured: false
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techtrend');
        
        // Clear existing products
        await Product.deleteMany({});
        
        // Insert new products
        await Product.insertMany(products);
        
        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();