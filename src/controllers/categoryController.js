const { pool } = require('../config/database');

const getAllCategories = async (req, res) => {
    try {
        const query = 'SELECT * FROM categories ORDER BY id';
        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching categories:', error);
                return res.status(500).json({ 
                    result: false, 
                    error: 'Database error',
                    details: error.message 
                });
            }
            res.json({
                result: true,
                data: results
            });
        });
    } catch (error) {
        console.error('Error in getAllCategories:', error);
        res.status(500).json({ 
            result: false, 
            error: 'Internal server error' 
        });
    }
};

const getSubCategories = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM categories WHERE iSubID = ?';
        
        pool.query(query, [id], (error, results) => {
            if (error) {
                console.error('Error fetching sub-categories:', error);
                return res.status(500).json({ 
                    result: false, 
                    error: 'Database error',
                    details: error.message 
                });
            }
            res.json({
                result: true,
                data: results
            });
        });
    } catch (error) {
        console.error('Error in getSubCategories:', error);
        res.status(500).json({ 
            result: false, 
            error: 'Internal server error' 
        });
    }
};

module.exports = {
    getAllCategories,
    getSubCategories
}; 