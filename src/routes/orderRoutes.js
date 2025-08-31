const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { addToCart,getCart} = require('../controllers/orderController');

router.post('/addToCart', verifyToken, addToCart);
router.get('/cart', verifyToken, getCart);


module.exports = router; 