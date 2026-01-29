
module.exports = authMiddleware;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // console.log("AUTH HEADER:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = decoded; // {_id, email}
        req.user = {
            id: decoded._id,
            email: decoded.email
        };
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};