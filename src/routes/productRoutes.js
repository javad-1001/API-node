const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
    getAllProducts,
    addProduct,
    deleteProduct,
    updateProduct
} = require('../controllers/productController');

router.get('/getAllProducts', getAllProducts);
router.post('/addProduct', verifyToken, addProduct);
router.post('/deleteProduct', verifyToken, deleteProduct);
router.put('/editProduct/:iProduct', verifyToken, updateProduct);

module.exports = router; 