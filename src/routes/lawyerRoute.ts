// lawyerRoutes.ts
import { Router } from "express";
import { getSingleLawyer, filterLawyers, getTopLawyers } from "../controller/lawyerController";
import { authMiddleware } from "../middlewares/authMiddleware";


const lawyerRoute = Router();

lawyerRoute.get("/top-lawyers", authMiddleware ,getTopLawyers);

lawyerRoute.get("/:lawyerId", authMiddleware, getSingleLawyer);

lawyerRoute.get("/filter", authMiddleware, filterLawyers);

export default lawyerRoute;
