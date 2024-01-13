import { Router } from "express";
import lawController from "../controller/lawController";
import { authMiddleware } from "../middlewares/authMiddleware";

const lawRoute = Router();

lawRoute.post("/laws", authMiddleware, lawController.addLaw);
lawRoute.get("/laws", authMiddleware, lawController.getLaws);
lawRoute.get("/laws/filter", authMiddleware , lawController.getLawsFilter);
lawRoute.get("/laws/:lawId/chapter/section", authMiddleware , lawController.getChaptersAndSectionsByLawId);
lawRoute.get("/laws/section/:sectionId", authMiddleware ,  lawController.getSectionsBySectionId);
lawRoute.get("/laws/:lawId", authMiddleware , lawController.getLaw);
lawRoute.put("/laws/:lawId", authMiddleware, lawController.updateLaw);
lawRoute.delete("/laws/:lawId", authMiddleware, lawController.deleteLaw);

export default lawRoute;
