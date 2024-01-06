const express = require("express");
const router = express.Router();
const ProductModel = require('../models/Product');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: Product 1
 *                 quantity: 10
 */
router.get("/api/products", async (req, res) => {
  try {
    const products = await ProductModel.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             name: New Product
 *             quantity: 5
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/api/products", async (req, res) => {
  const { name, quantity } = req.body;
  try {
    await ProductModel.createProduct(name, quantity);
    res.status(201).send("Product created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating product' });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the product
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             name: Updated Product
 *             quantity: 8
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put("/api/products/:id", async (req, res) => {
  const productId = req.params.id;
  const { name, quantity } = req.body;
  try {
    await ProductModel.updateProduct(productId, name, quantity);
    res.send("Product updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating product' });
  }
});


/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the product
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete("/api/products/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    await ProductModel.deleteProduct(productId);
    res.send("Product deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting product' });
  }
});

module.exports = router;
