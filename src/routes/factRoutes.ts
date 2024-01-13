// routes.ts
import { Router } from "express";
import { getRandomFacts } from "../controller/factController";
import { authMiddleware } from "../middlewares/authMiddleware";


const factsRoute = Router();

factsRoute.get("/random-facts", authMiddleware, getRandomFacts);

export default factsRoute;
