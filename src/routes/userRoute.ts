// userRoutes.ts
import { Router } from "express";
import { signUp, signIn } from "../controller/userController";

const userRoute = Router();

// User registration route
userRoute.post("/signup", signUp);

// User login route
userRoute.post("/signin", signIn);

export default userRoute;
