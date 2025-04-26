const { pool } = require('../config/database');

const getAllBlogs = async (req, res) => {
    try {
        const query = 'SELECT * FROM blogs ORDER BY strDate DESC';
        pool.query(query, (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.json(results);
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const addBlog = async (req, res) => {
    try {
        const blog = {
            strTitle: req.body.strTitle,
            strDescription: req.body.strDescription,
            strDate: req.body.strDate || new Date().toISOString().slice(0, 10), // اگر تاریخ ارسال نشد، تاریخ امروز
            strImage: req.body.strImage
        };

        const query = "INSERT INTO `blogs` SET ?";
        pool.query(query, blog, (error, results) => {
            if (error) {
                console.error('Error adding blog:', error);
                return res.status(400).json({ 
                    result: false, 
                    error: 'Invalid blog data',
                    details: error.message 
                });
            }
            res.status(201).json({
                result: true,
                message: 'Blog added successfully',
                blogId: results.insertId
            });
        });
    } catch (error) {
        console.error('Error adding blog:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const { iBlog } = req.body;
        const query = "DELETE FROM blogs WHERE iBlog = ?";
        
        pool.query(query, [iBlog], (error, results) => {
            if (error) {
                console.error('Error deleting blog:', error);
                return res.status(500).json({ 
                    result: false, 
                    error: 'Failed to delete blog',
                    details: error.message 
                });
            }
            
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    result: false,
                    error: 'Blog not found'
                });
            }
            
            res.status(200).json({
                result: true,
                message: 'Blog deleted successfully'
            });
        });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateBlog = async (req, res) => {
    try {
        const { iBlog } = req.params;
        const updatedBlog = {
            strTitle: req.body.strTitle,
            strDescription: req.body.strDescription,
            strDate: req.body.strDate,
            strImage: req.body.strImage
        };

        const query = "UPDATE blogs SET ? WHERE iBlog = ?";
        pool.query(query, [updatedBlog, iBlog], (error, results) => {
            if (error) {
                console.error('Error updating blog:', error);
                return res.status(400).json({ 
                    result: false, 
                    error: 'Invalid blog data',
                    details: error.message 
                });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    result: false,
                    error: 'Blog not found'
                });
            }

            res.status(200).json({
                result: true,
                message: 'Blog updated successfully'
            });
        });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllBlogs,
    addBlog,
    deleteBlog,
    updateBlog
}; 