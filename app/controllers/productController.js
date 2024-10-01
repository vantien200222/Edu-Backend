const db = require('../config/db');

const productController = {
    createProduct: async (req, res) => {
        try {
            const { name, description, price, category, stock } = req.body;

            if (!name || !price) {
                return res.status(400).json({ message: 'Name and price are required' });
            }

            const query = 'INSERT INTO products (name, description, price, category, stock) VALUES (?, ?, ?, ?, ?)';
            const values = [name, description, price, category, stock];

            const [result] = await db.execute(query, values);
            const productId = result.insertId;

            res.status(201).json({ id: productId, name, description, price, category, stock });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const productId = req.params.id;
            const { name, description, price, category, stock } = req.body;

            const updateFields = [];
            const updateValues = [];

            if (name) {
                updateFields.push('name = ?');
                updateValues.push(name);
            }
            if (description) {
                updateFields.push('description = ?');
                updateValues.push(description);
            }
            if (price) {
                updateFields.push('price = ?');
                updateValues.push(price);
            }
            if (category) {
                updateFields.push('category = ?');
                updateValues.push(category);
            }
            if (stock) {
                updateFields.push('stock = ?');
                updateValues.push(stock);
            }

            if (updateFields.length === 0) {
                return res.status(400).json({ message: 'No fields to update' });
            }

            const updateQuery = `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`;
            updateValues.push(productId);

            const [result] = await db.execute(updateQuery, updateValues);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.status(200).json({ message: 'Product updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const productId = req.params.id;

            const deleteQuery = 'DELETE FROM products WHERE id = ?';
            const [result] = await db.execute(deleteQuery, [productId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getAllProducts: async (req, res) => {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const offset = (page - 1) * limit;

        try {
            const query = `SELECT * FROM products LIMIT ${offset}, ${limit}`;
            const [products] = await db.execute(query);

            const countQuery = 'SELECT COUNT(*) as count FROM products';
            const [countResult] = await db.execute(countQuery);
            const totalItems = countResult[0].count;

            res.status(200).json({ data: products, totalItems, page, limit });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getProductById: async (req, res) => {
        try {
            const productId = req.params.id;

            const query = 'SELECT * FROM products WHERE id = ?';
            const [product] = await db.execute(query, [productId]);

            if (product.length === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.status(200).json(product[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    searchProducts: async (req, res) => {
        const searchTerm = req.query.q;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const offset = (page - 1) * limit;

        try {
            const query = `SELECT * FROM products WHERE name LIKE ? OR description LIKE ? LIMIT ${offset}, ${limit}`;
            const searchValue = `%${searchTerm}%`;
            const [products] = await db.execute(query, [searchValue, searchValue]);

            const countQuery = 'SELECT COUNT(*) as count FROM products WHERE name LIKE ? OR description LIKE ?';
            const [countResult] = await db.execute(countQuery, [searchValue, searchValue]);
            const totalItems = countResult[0].count;

            res.status(200).json({ data: products, totalItems, page, limit });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = productController;