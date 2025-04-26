const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const login = async (req, res) => {
    const { strUsername, strPassword } = req.body;
    console.log('Login attempt:', { strUsername }); // Not logging password for security

    try {
        const query = `SELECT * FROM user_admin WHERE strUsername = ? AND strPassword = ?`;
        pool.query(query, [strUsername, strPassword], (error, results) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ error: 'Database error', details: error.message });
            }
            
            if (results.length > 0) {
                const user = results[0];
                const token = jwt.sign(
                    { id: user.id }, 
                    process.env.JWT_SECRET || 'your_secret_key', 
                    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
                );
                
                res.status(200).json({
                    result: true,
                    message: 'Login successful',
                    id: user.id,
                    strToken: token,
                    strMobile: user.strMobile,
                    strName: user.strName,
                    strFamily: user.strFamily,
                });
            } else {
                res.status(401).json({ result: false, error: 'Invalid credentials' });
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    login
}; 