

// const jwt = require('jsonwebtoken');
// const User = require('../models/User');


// const authMiddleware = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     // console.log("AUTH HEADER:", authHeader);

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         // req.user = decoded; // {_id, email}
//         req.user = {
//             _id: decoded._id
//         };
//         next();
//     } catch (err) {
//         return res.status(401).json({ message: "Invalid or expired token" });
//     }
// };
// module.exports = authMiddleware;

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
<<<<<<< HEAD
            _id: decoded._id,
            userId: decoded._id // changes login singup
            // _id: decoded._id,
            // userId: decoded._id // changes login singup
=======
<<<<<<< HEAD
            id: decoded._id,
            // email: decoded.email
=======
            _id: decoded._id
>>>>>>> 7228e290a23bfacd28777bb3c4a3a1affbbca15a
>>>>>>> testingBranch
        };
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
<<<<<<< HEAD
module.exports = authMiddleware;
=======
<<<<<<< HEAD

=======
>>>>>>> 7228e290a23bfacd28777bb3c4a3a1affbbca15a
module.exports = authMiddleware;
>>>>>>> testingBranch
