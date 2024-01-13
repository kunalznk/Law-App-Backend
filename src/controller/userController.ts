import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { buildFailMessage, buildSuccessMessage } from "../utils/common";
import { UserModel } from "../models/userModel";

export const signUp = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        console.log(req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword
        });

        let token = '';
        if (user) {
            token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY!, {
                expiresIn: "1d"
            });
        }
        const { data, statusCode } = buildSuccessMessage(user);
        res.status(statusCode).json(data);
    } catch (error) {
        const { data, statusCode } = buildFailMessage(error);
        res.status(statusCode).json(data);
    }
};

export const signIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new Error("Invalid Credentials");
        }

        const isValidPassword = await bcrypt.compare(password, user?.password);
        if (!isValidPassword) {
            throw new Error("Invalid Credentials");
        }

        let token = '';
        token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY!, {
            expiresIn: "1d"
        });

        const { data, statusCode } = buildSuccessMessage({ user, token });

        res.status(statusCode).json(data);
    } catch (error) {
        const { data, statusCode } = buildFailMessage(error);
        res.status(statusCode).json(data);
    }
};
