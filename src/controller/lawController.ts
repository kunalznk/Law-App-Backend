import { Request, Response } from "express";
import { LawModel as Law, buildLaw } from "../models/lawModel";
import { buildFailMessage, buildSuccessMessage } from "../utils/common";
import { _FilterQuery } from "mongoose";
import { ChapterModel, LawModel, SectionModel } from "../models/newLawModel";

const addLaw = async (req: Request, res: Response) => {
    try {
        const law = buildLaw(req.body);
        const savedLaw = await law.save();
        const { data, statusCode } = buildSuccessMessage(savedLaw);
        res.status(statusCode).json(data);
    } catch (error) {
        const { data, statusCode } = buildFailMessage(error);
        res.status(statusCode).json(data);
    }
};

const updateLaw = async (req: Request, res: Response) => {
    try {
        if (!req?.params?.lawId) throw new Error("Validation Error");
        const { lawId } = req.params;
        const lawSpec = req.body;
        const updatedLaw = await Law.findByIdAndUpdate(
            lawId,
            {
                $set: {
                    ...lawSpec,
                },
            },
            {
                new: true,
            }
        );
        const { data, statusCode } = buildSuccessMessage(updatedLaw);
        res.status(statusCode).json(data);
    } catch (error) {
        const { data, statusCode } = buildFailMessage(error);
        res.status(statusCode).json(data);
    }
};

const deleteLaw = async (req: Request, res: Response) => {
    try {
        if (!req?.params?.lawId) throw new Error("Validation Error");
        const { lawId } = req.params;
        await Law.findByIdAndDelete(lawId);
        const { data, statusCode } = buildSuccessMessage([]);
        res.status(statusCode).json(data);
    } catch (error) {
        const { data, statusCode } = buildFailMessage(error);
        res.status(statusCode).json(data);
    }
};

const getLaw = async (req: Request, res: Response) => {
    try {
        const { lawId } = req.params;
        const law = await Law.findById(lawId);
        const { data, statusCode } = buildSuccessMessage(law);
        res.status(statusCode).json(data);
    } catch (error) {
        const { data, statusCode } = buildFailMessage(error);
        res.status(statusCode).json(data);
    }
};

const getSectionById = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;

    const law = await Law.findOne({ 'chapters.sections._id': sectionId });

    if (law) {
      const section = law.chapters[0]?.sections.find((s) => s._id.toString() === sectionId);

      if (section) {
        const { data, statusCode } = buildSuccessMessage(section);
        res.status(statusCode).json(data);
      } else {
        res.status(404).json({ message: 'Section not found.' });
      }
    } else {
      res.status(404).json({ message: 'Law not found.' });
    }
  } catch (error) {
    const { data, statusCode } = buildFailMessage(error);
    res.status(statusCode).json(data);
  }
};

const getLaws = async (req: Request, res: Response) => {
  try {
      const laws = await Law.find().limit(10);
      const { data, statusCode } = buildSuccessMessage(laws);
      res.status(statusCode).json(data);
  } catch (error) {
      const { data, statusCode } = buildFailMessage(error);
      res.status(statusCode).json(data);
  }
};

const getChaptersAndSectionsByLawId = async (req: Request, res: Response) => {
  try {
    const { lawId } = req.params;

        const law = await LawModel.findById(lawId).limit(20);

        if (!law) {
            const errorMessage = 'No law found for the specified lawId.';
            const { data, statusCode } = buildFailMessage(errorMessage, 404);
            return res.status(statusCode).json(data);
        }

        const chapters = await ChapterModel.find({ law: lawId }).limit(10);

        if (!chapters || chapters.length === 0) {
            const errorMessage = 'No chapters found for the specified lawId.';
            const { data, statusCode } = buildFailMessage(errorMessage, 404);
            return res.status(statusCode).json(data);
        }

        const result = chapters.map(async (chapter) => {
            const sections = await SectionModel.find({ chapter: chapter._id }).limit(10);
            return {
           
                    _id: chapter._id,
                    title: chapter.title,
                    sections: sections.map(section => ({
                        _id: section._id,
                        shortTitle: section.shortTitle,
                    })),
             
            };
        });

        const data = await Promise.all(result);

        const responseData = {
        
                _id: law._id,
                title: law.title,
                description: law.description,
                tags: law.tags,
                summary: law.summary,
                chapters: data,
        };

        const { data: response, statusCode } = buildSuccessMessage(responseData);
        res.status(statusCode).json(response);
  } catch (error) {
      const { data, statusCode } = buildFailMessage(error);
      res.status(statusCode).json(data);
  }
};

const getSectionsBySectionId = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;

    const sections = await SectionModel.findById(sectionId);

      if (!sections ) {
          const errorMessage = 'No sections found for the specified lawId.';
          const { data, statusCode } = buildFailMessage(errorMessage, 404);
          return res.status(statusCode).json(data);
      }

      const { data, statusCode } = buildSuccessMessage(sections);
      res.status(statusCode).json(data);
  } catch (error) {
      const { data, statusCode } = buildFailMessage(error);
      res.status(statusCode).json(data);
  }
};


const getLawsFilter = async (req: Request, res: Response) => {
  try {
      const { query } = req.query;

      const sections = await SectionModel.find({ $text: { $search: query } }).limit(10)
          .select({ score: { $meta: 'textScore' } }) 
          .sort({ score: { $meta: 'textScore' } }); 

      if (!sections || sections.length === 0) {
          const errorMessage = 'No sections found for the specified query.';
          const { data, statusCode } = buildFailMessage(errorMessage);
          return res.status(statusCode).json(data);
      }

      const lawIds = [...new Set(sections.map(section => section.law.toString()))];
      const chapterIds = [...new Set(sections.map(section => section.chapter.toString()))];

      const laws = await LawModel.find({ _id: { $in: lawIds } }).limit(10);

      const chapters = await ChapterModel.find({ _id: { $in: chapterIds } }).limit(10);

      const result = [
          // ...laws.map(law => ({ _id: law._id, title: law.title, desc: law.description })),
          // ...chapters.map(chapter => ({ _id: chapter._id, title: chapter.title.join(",") })),
          ...sections.map(section => ({
              _id: section._id,
              title: section.longTitle,
          })),
        ];

      const { data, statusCode } = buildSuccessMessage(result);
      res.status(statusCode).json(data);
  } catch (error) {
      const { data, statusCode } = buildFailMessage(error);
      res.status(statusCode).json(data);
  }
};


export default {  getLawsFilter ,getSectionsBySectionId,getChaptersAndSectionsByLawId ,getLaws, addLaw, updateLaw, deleteLaw, getLaw, getSectionById };
