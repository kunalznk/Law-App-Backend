// lawyerController.ts
import { Request, Response } from "express";
import { LawyerModel, Lawyer } from "../models/lawyerModel";
import { buildFailMessage, buildSuccessMessage } from "../utils/common";

export const getSingleLawyer = async (req: Request, res: Response) => {
  try {
    const { lawyerId } = req.params;
    const lawyer = await LawyerModel.findById(lawyerId);

    if (!lawyer) {
      throw new Error("Lawyer not found");
    }

    const { data, statusCode } = buildSuccessMessage(lawyer);
    res.status(statusCode).json(data);
  } catch (error) {
    const { data, statusCode } = buildFailMessage(error);
    res.status(statusCode).json(data);
  }
};

export const filterLawyers = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    const lawyers = await LawyerModel.find(filters);
    const { data, statusCode } = buildSuccessMessage(lawyers);
    res.status(statusCode).json(data);
  } catch (error) {
    const { data, statusCode } = buildFailMessage(error);
    res.status(statusCode).json(data);
  }
};

export const getTopLawyers = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    const textSearchFilter = query ? { $text: { $search: query } } : {};
    let  topLawyers = []
    if(query) {
       topLawyers = await LawyerModel.find(textSearchFilter).limit(20)
          .select({ score: { $meta: 'textScore' } }) 
          .sort({ score: { $meta: 'textScore' } }); 
    } else {
      topLawyers = await LawyerModel.find().limit(20)
    }
        const { data, statusCode } = buildSuccessMessage(topLawyers);
        res.status(statusCode).json(data);

  } catch (error) {
    const { data, statusCode } = buildFailMessage(error);
    res.status(statusCode).json(data);
  }
};
