const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req.headers['x-access-token'];
    
    if (!token) {
        return res.status(403).json({ 
            result: false, 
            message: 'Token is required for authentication' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ 
            result: false, 
            message: 'Invalid or expired token' 
        });
    }
};

module.exports = {
    verifyToken
}; 