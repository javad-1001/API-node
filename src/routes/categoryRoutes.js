const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getSubCategories
} = require('../controllers/categoryController');

// Get all categories
router.get('/getAllCategories', getAllCategories);

// Get sub-categories by parent ID
router.get('/getSubCategories/:id', getSubCategories);

module.exports = router; 