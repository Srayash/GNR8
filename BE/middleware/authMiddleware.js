const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            message: "You're not authorized to acces this page."
        });
    }

    const token = authHeader.split(' ')[1];
    console.log(token);
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if(decoded.userId){
            req.userId = decoded.userId;

            next();
        } else {
            return res.status(403).json({
                message: "You're not authorized to acces this page."
            });
        }

    } catch(err){
        return res.status(403).json({
             message: "You're not authorized to acces this page."
        });
    }
};

module.exports = {
    authMiddleware
}