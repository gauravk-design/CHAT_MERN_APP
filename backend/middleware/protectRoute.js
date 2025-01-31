import jwt from 'jsonwebtoken';
import userModel from '../model/user.model.js';
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({message: "Unauthorized - No token found: "})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message: "Unauthorized - Invalid token: "})
        }


        const user = await userModel.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({message: "Unauthorized - User not found: "})
        }

        req.user = user;

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        return res.status(500).json({ message: "Internsal server error" });
        
    }
}


export default protectRoute;