const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
    getAllBlogs,
    addBlog,
    deleteBlog,
    updateBlog
} = require('../controllers/blogController');

router.get('/getAllBlogs', getAllBlogs); // این endpoint نیازی به توکن ندارد
router.post('/addBlog', verifyToken, addBlog);
router.post('/deleteBlog', verifyToken, deleteBlog);
router.put('/editBlog/:iBlog', verifyToken, updateBlog);

module.exports = router; 