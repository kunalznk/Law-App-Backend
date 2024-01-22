// userRoutes.ts
import { Router } from "express";
import { signUp, signIn, verifyEmail, resendVerifyEmail } from "../controller/userController";

const userRoute = Router();

// User registration route
userRoute.post("/signup", signUp);

// User login route
userRoute.post("/signin", signIn);

// User verify email route
userRoute.post("/verify", verifyEmail);

// User resend verify email route
userRoute.post("/verify/resend", resendVerifyEmail);

export default userRoute;
