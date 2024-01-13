// factsController.ts
import { Request, Response } from "express";
import { FactsModel, Fact } from "../models/factModel";
import { buildFailMessage, buildSuccessMessage } from "../utils/common";

export const getRandomFacts = async (req: Request, res: Response) => {
    try {
        const randomFacts: Fact[] = await FactsModel.aggregate([
            { $sample: { size: 10 } },
        ]);

        const { data, statusCode } = buildSuccessMessage(randomFacts);
        res.status(statusCode).json(data);
    } catch (error) {
        const { data, statusCode } = buildFailMessage(error);
        res.status(statusCode).json(data);
    }
};
