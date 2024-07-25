import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        // console.log("Token:", token); // Debug: Log the token to see if it is received

        if (!token) {
            return res.status(401).json({ error: "Unauthorized user - No token found!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log("Decoded:", decoded); // Debug: Log the decoded token

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid token!" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(400).json({ error: "User not found!" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error occurred in protectRoute middleware:", error.message);
        res.status(500).json({ error: "Internal server error!" });
    }
};

export default protectRoute;
