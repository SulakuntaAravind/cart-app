const request = require('supertest');
const app = require('./server');
describe('🛍️ Add to Cart - API Tests', () => {

  // Reset cart before each test
  beforeEach(async () => {
    await request(app).delete('/api/cart');
  });

  // ─── Health Check ──────────────────────────────────────────────────────────
  describe('Health Check', () => {
    test('GET /health → returns ok status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  // ─── Products ──────────────────────────────────────────────────────────────
  describe('GET /api/products', () => {
    test('returns all products', async () => {
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.products).toHaveLength(6);
    });

    test('each product has required fields', async () => {
      const res = await request(app).get('/api/products');
      res.body.products.forEach(p => {
        expect(p).toHaveProperty('id');
        expect(p).toHaveProperty('name');
        expect(p).toHaveProperty('price');
        expect(p).toHaveProperty('category');
      });
    });
  });

  // ─── Cart - GET ────────────────────────────────────────────────────────────
  describe('GET /api/cart', () => {
    test('returns empty cart initially', async () => {
      const res = await request(app).get('/api/cart');
      expect(res.statusCode).toBe(200);
      expect(res.body.cart).toEqual([]);
      expect(res.body.total).toBe(0);
      expect(res.body.count).toBe(0);
    });
  });

  // ─── Cart - ADD ────────────────────────────────────────────────────────────
  describe('POST /api/cart - Add to Cart', () => {
    test('adds a valid product to cart', async () => {
      const res = await request(app)
        .post('/api/cart')
        .send({ productId: 1 });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.item.productId).toBe(1);
      expect(res.body.item.quantity).toBe(1);
    });

    test('adds product with custom quantity', async () => {
      const res = await request(app)
        .post('/api/cart')
        .send({ productId: 2, quantity: 3 });

      expect(res.statusCode).toBe(201);
      expect(res.body.item.quantity).toBe(3);
    });

    test('increments quantity if product already in cart', async () => {
      await request(app).post('/api/cart').send({ productId: 1, quantity: 1 });
      const res = await request(app).post('/api/cart').send({ productId: 1, quantity: 2 });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Quantity updated');
      const cart = await request(app).get('/api/cart');
      const item = cart.body.cart.find(i => i.productId === 1);
      expect(item.quantity).toBe(3);
    });

    test('returns 400 when productId is missing', async () => {
      const res = await request(app).post('/api/cart').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('returns 404 for invalid productId', async () => {
      const res = await request(app).post('/api/cart').send({ productId: 999 });
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ─── Cart - UPDATE ─────────────────────────────────────────────────────────
  describe('PUT /api/cart/:id - Update Quantity', () => {
    test('updates item quantity', async () => {
      const add = await request(app).post('/api/cart').send({ productId: 1 });
      const itemId = add.body.item.id;

      const res = await request(app)
        .put(`/api/cart/${itemId}`)
        .send({ quantity: 5 });

      expect(res.statusCode).toBe(200);
      expect(res.body.item.quantity).toBe(5);
    });

    test('removes item when quantity set to 0', async () => {
      const add = await request(app).post('/api/cart').send({ productId: 1 });
      const itemId = add.body.item.id;

      const res = await request(app)
        .put(`/api/cart/${itemId}`)
        .send({ quantity: 0 });

      expect(res.statusCode).toBe(200);
      expect(res.body.cart).toHaveLength(0);
    });

    test('returns 404 for non-existent item', async () => {
      const res = await request(app).put('/api/cart/999').send({ quantity: 2 });
      expect(res.statusCode).toBe(404);
    });
  });

  // ─── Cart - DELETE ─────────────────────────────────────────────────────────
  describe('DELETE /api/cart/:id - Remove Item', () => {
    test('removes specific item from cart', async () => {
      const add = await request(app).post('/api/cart').send({ productId: 3 });
      const itemId = add.body.item.id;

      const res = await request(app).delete(`/api/cart/${itemId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.cart).toHaveLength(0);
    });

    test('returns 404 for non-existent item', async () => {
      const res = await request(app).delete('/api/cart/999');
      expect(res.statusCode).toBe(404);
    });
  });

  // ─── Cart - CLEAR ──────────────────────────────────────────────────────────
  describe('DELETE /api/cart - Clear Cart', () => {
    test('clears all items from cart', async () => {
      await request(app).post('/api/cart').send({ productId: 1 });
      await request(app).post('/api/cart').send({ productId: 2 });

      const res = await request(app).delete('/api/cart');
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Cart cleared');

      const cart = await request(app).get('/api/cart');
      expect(cart.body.cart).toHaveLength(0);
    });
  });

  // ─── Cart Total ────────────────────────────────────────────────────────────
  describe('Cart Total Calculation', () => {
    test('calculates correct total with multiple items', async () => {
      // Product 1: price 2499, qty 2 = 4998
      // Product 4: price 999, qty 1 = 999
      // Total = 5997
      await request(app).post('/api/cart').send({ productId: 1, quantity: 2 });
      await request(app).post('/api/cart').send({ productId: 4, quantity: 1 });

      const res = await request(app).get('/api/cart');
      expect(res.body.total).toBe(5997);
      expect(res.body.count).toBe(3);
    });
  });
});
