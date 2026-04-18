const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory store
let cart = [];
let nextId = 1;

const products = [
  { id: 1, name: 'Wireless Headphones', price: 2499, image: '🎧', category: 'Electronics' },
  { id: 2, name: 'Running Shoes', price: 3999, image: '👟', category: 'Sports' },
  { id: 3, name: 'Coffee Maker', price: 4599, image: '☕', category: 'Kitchen' },
  { id: 4, name: 'Yoga Mat', price: 999, image: '🧘', category: 'Sports' },
  { id: 5, name: 'Smart Watch', price: 8999, image: '⌚', category: 'Electronics' },
  { id: 6, name: 'Backpack', price: 1799, image: '🎒', category: 'Accessories' },
];

// GET all products
app.get('/api/products', (req, res) => {
  res.json({ success: true, products });
});

// GET cart
app.get('/api/cart', (req, res) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ success: true, cart, total, count: cart.reduce((s, i) => s + i.quantity, 0) });
});

// POST add to cart
app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, message: 'productId is required' });
  }

  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const existing = cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
    return res.json({ success: true, message: 'Quantity updated', cart });
  }

  const cartItem = { id: nextId++, productId, ...product, quantity };
  cart.push(cartItem);
  res.status(201).json({ success: true, message: 'Added to cart', item: cartItem, cart });
});

// PUT update quantity
app.put('/api/cart/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { quantity } = req.body;
  const item = cart.find(i => i.id === id);

  if (!item) return res.status(404).json({ success: false, message: 'Cart item not found' });
  if (quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
    return res.json({ success: true, message: 'Item removed', cart });
  }

  item.quantity = quantity;
  res.json({ success: true, message: 'Updated', item, cart });
});

// DELETE remove from cart
app.delete('/api/cart/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const exists = cart.find(i => i.id === id);
  if (!exists) return res.status(404).json({ success: false, message: 'Cart item not found' });

  cart = cart.filter(i => i.id !== id);
  res.json({ success: true, message: 'Removed from cart', cart });
});

// DELETE clear cart
app.delete('/api/cart', (req, res) => {
  cart = [];
  nextId = 1;
  res.json({ success: true, message: 'Cart cleared' });
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
