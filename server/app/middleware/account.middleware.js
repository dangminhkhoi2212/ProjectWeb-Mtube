const jwt = require('jsonwebtoken');

module.exports = verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Invalid token' });
    try {
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.accountId = decode.accountId;
        next();
    } catch (error) {
        return res.status(403).json({ message: error.message });
    }
};
