const db = require('../db');

const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM products', (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const createProduct = (name, quantity) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO products (name, quantity) VALUES (?, ?)', [name, quantity], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const updateProduct = (productId, name, quantity) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE products SET name = ?, quantity = ? WHERE id = ?', [name, quantity, productId], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const deleteProduct = (productId) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM products WHERE id = ?', [productId], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
