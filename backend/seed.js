require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');

const sampleProducts = [
  {
    name: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear headphones with 30h battery life.',
    price: 79.99,
    category: 'Electronics',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  },
  {
    name: 'Classic Cotton T-Shirt',
    description: 'Soft unisex tee available in multiple colors.',
    price: 24.99,
    category: 'Clothing',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
  },
  {
    name: 'Stainless Water Bottle',
    description: 'Insulated 32oz bottle keeps drinks cold for 24 hours.',
    price: 29.99,
    category: 'Accessories',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
  },
  {
    name: 'Running Sneakers',
    description: 'Lightweight mesh sneakers for everyday comfort.',
    price: 89.99,
    category: 'Footwear',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
  },
  {
    name: 'Leather Wallet',
    description: 'Slim bifold wallet with RFID blocking.',
    price: 39.99,
    category: 'Accessories',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracking, heart rate monitor, and notifications.',
    price: 149.99,
    category: 'Electronics',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
  },
];

async function seed() {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@store.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: 'Store Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    console.log(`Admin created: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log('Admin already exists');
  }

  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(sampleProducts);
    console.log(`Seeded ${sampleProducts.length} products`);
  } else {
    console.log(`Products already exist (${count})`);
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
