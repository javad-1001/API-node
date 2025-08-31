const { pool } = require('../config/database');

const addToCart = async (req, res) => {
    const userId = req.user.id; 
    const { productId, quantity } = req.body;

    try {
        pool.query("SELECT * FROM carts WHERE user_id=? AND status='active'", [userId], (err, results) => {
            if (err) return res.status(500).json({ error: 'DB error', details: err.message });

            let cartId;
            if (results.length === 0) {
                pool.query("INSERT INTO carts (user_id) VALUES (?)", [userId], (err2, insertRes) => {
                    if (err2) return res.status(500).json({ error: 'DB error', details: err2.message });
                    cartId = insertRes.insertId;
                    insertItem(cartId);
                });
            } else {
                cartId = results[0].id;
                insertItem(cartId);
            }

            function insertItem(cartId) {
                pool.query("SELECT * FROM cart_items WHERE cart_id=? AND product_id=?", [cartId, productId], (err3, itemRes) => {
                    if (err3) return res.status(500).json({ error: 'DB error', details: err3.message });

                    if (itemRes.length > 0) {
                        pool.query("UPDATE cart_items SET quantity=quantity+? WHERE id=?", [quantity || 1, itemRes[0].id]);
                    } else {
                        pool.query("INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?,?,?)", [cartId, productId, quantity || 1]);
                    }

                    res.json({ result: true, message: "محصول به سبد اضافه شد" });
                });
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const query = `
            SELECT p.iProduct AS id, p.strTitle AS title, p.iPrice AS price, p.strImage AS image_url, ci.quantity
            FROM carts c
            JOIN cart_items ci ON c.id = ci.cart_id
            JOIN products p ON ci.product_id = p.iProduct
            WHERE c.user_id=? AND c.status='active'
        `;
        pool.query(query, [userId], (err, results) => {
            if (err) return res.status(500).json({ error: 'DB error', details: err.message });
            res.json({ result: true, items: results });
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    addToCart,
    getCart
}; 