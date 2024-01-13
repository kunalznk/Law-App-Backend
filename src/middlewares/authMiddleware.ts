require('dotenv').config()
import { Request , Response , NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"


declare global {
    namespace Express {
      interface Request {
        user ?: 
        string | JwtPayload,
        headers: {
            authorization: string
        }
      }
    }
  }
 
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.headers.authorization?.split(' ')[1] ?? '';
        const payload  = jwt.verify(token, process.env.JWT_SECRET_KEY!)
        if(payload) req.user = payload;
        next();
    } catch (error) {
     res.status(500).json({
        message: "Unauthorized",
        error
     })   
    }
}  
  