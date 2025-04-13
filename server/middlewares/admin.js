import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const isAdmin = async (req, res, next) => {
   try {
      const token = req.cookies["ace-token"];
      console.log("tocken wile admin",req.cookies["ace-token"])
      if (!token) {
         return res.status(401).json({ message: "Unauthorized. No token provided." });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded);
      console.log("isadmin",user.isAdmin)
      if (!user.isAdmin) {
         return res.status(403).json({ message: "Access denied. Admins only." });
      }
      req.user = user; 
      next(); 
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
   }
};

export { isAdmin };
