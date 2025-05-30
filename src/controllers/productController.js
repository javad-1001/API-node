const { pool } = require('../config/database');

const getAllProducts = async (req, res) => {
    try {
        const {
            minPrice,
            maxPrice,
            minHeight,
            maxHeight,
            category,
            title
        } = req.query;

        let query = 'SELECT * FROM products WHERE 1=1';
        const params = [];

        if (minPrice) {
            query += ' AND iPrice >= ?';
            params.push(parseFloat(minPrice));
        }

        if (maxPrice) {
            query += ' AND iPrice <= ?';
            params.push(parseFloat(maxPrice));
        }

        if (minHeight) {
            query += ' AND fHeight >= ?';
            params.push(parseFloat(minHeight));
        }

        if (maxHeight) {
            query += ' AND fHeight <= ?';
            params.push(parseFloat(maxHeight));
        }

        if (category) {
            query += ' AND iCategory = ?';
            params.push(parseInt(category));
        }

        if (title) {
            query += ' AND strTitle LIKE ?';
            params.push(`%${title}%`);
        }

        pool.query(query, params, (error, results) => {
            if (error) {
                console.error('Error fetching products:', error);
                return res.status(500).json({ 
                    result: false,
                    error: error.message 
                });
            }
            res.json({
                result: true,
                data: results
            });
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ 
            result: false,
            error: 'Internal server error' 
        });
    }
};

const addProduct = async (req, res) => {
    try {
        const product = {
            strTitle: req.body.strTitle,
            strDetail: req.body.strDetail,
            fWeight: req.body.fWeight,
            fHeight: req.body.fHeight,
            iPrice: req.body.iPrice,
            strImage: req.body.strImage,
            strSummery: req.body.strSummery,
            iCode: req.body.iCode,
            bActive: req.body.bActive,
            iCategory: req.body.iCategory
        };

        const query = "INSERT INTO `products` SET ?";
        pool.query(query, product, (error, results) => {
            if (error) {
                console.error('Error adding product:', error);
                return res.status(400).json({ 
                    result: false, 
                    error: 'Invalid product data',
                    details: error.message 
                });
            }
            res.status(201).json({
                result: true,
                message: 'Product added successfully',
                productId: results.insertId
            });
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { iProduct } = req.body;
        const query = "DELETE FROM products WHERE iProduct = ?";
        
        pool.query(query, [iProduct], (error, results) => {
            if (error) {
                console.error('Error deleting product:', error);
                return res.status(500).json({ 
                    result: false, 
                    error: 'Failed to delete product',
                    details: error.message 
                });
            }
            
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    result: false,
                    error: 'Product not found'
                });
            }
            
            res.status(200).json({
                result: true,
                message: 'Product deleted successfully'
            });
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { iProduct } = req.params;
        const updatedProduct = {
            strTitle: req.body.strTitle,
            strDetail: req.body.strDetail,
            fWeight: req.body.fWeight,
            fHeight: req.body.fHeight,
            iPrice: req.body.iPrice,
            strImage: req.body.strImage,
            strSummery: req.body.strSummery,
            iCode: req.body.iCode,
            bActive: req.body.bActive,
            iCategory: req.body.iCategory
        };

        const query = "UPDATE products SET ? WHERE iProduct = ?";
        pool.query(query, [updatedProduct, iProduct], (error, results) => {
            if (error) {
                console.error('Error updating product:', error);
                return res.status(400).json({ 
                    result: false, 
                    error: 'Invalid product data',
                    details: error.message 
                });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    result: false,
                    error: 'Product not found'
                });
            }

            res.status(200).json({
                result: true,
                message: 'Product updated successfully'
            });
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllProducts,
    addProduct,
    deleteProduct,
    updateProduct
}; 