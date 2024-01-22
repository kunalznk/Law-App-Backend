import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { buildFailMessage, buildSuccessMessage } from "../utils/common";
import { UserModel } from "../models/userModel";
import { sendMail } from "../config/email";
import randomstring from "randomstring";
import { GetOtpMailTemplate } from "../utils/email/otp";

function getHtml(name: string) {
    return ` <table style="max-width: 600px; width: 100%; margin: 0 auto; padding: 20px; border-collapse: collapse;font-family: Arial, sans-serif; background-color: #ffffff; color: #333333; margin: 0; padding: 0
    
    ">
        <tr>
            <td>
                <h1 style="color: #00cc44;">Welcome to My Law</h1>
                <p>Dear ${name},</p>
                <p>We're delighted to have you on board, and we appreciate your trust in our platform for your legal needs.</p>
                <p>Here's what you can expect from My Law:</p>
                <ol>
                    <li><strong>Explore Legal Insights:</strong> Dive into a wealth of legal knowledge and insights. Our platform offers comprehensive resources to help you understand various legal aspects.</li>
                    <li><strong>Connect with Lawyers:</strong> Need legal advice? Connect with experienced lawyers to get personalized assistance. Our network of legal professionals is here to guide you through your legal journey.</li>
                </ol>
                <p>We're committed to making your legal journey seamless and empowering. If you have any questions or need assistance, our support team is ready to help.</p>
                <p>Thank you for choosing My Law! We look forward to being your trusted companion in the legal realm.</p>
                <p style="margin-bottom: 20px;">Best Regards,<br>The My Law Team</p>
                <a href=#} style="display: inline-block; padding: 10px 20px; background-color: #00cc44; color: #ffffff; text-decoration: none; border-radius: 5px;">Get Started</a>
            </td>
        </tr>
    </table>`
}

export const signUp = async (req: Request, res: Response) => {
    try {
        const { name, email, password, imgUrl, mobile } = req.body;

        const expiresAt = (Date.now() + 60000 * 10) as unknown as string;
        const otp = +randomstring.generate({
            charset: "1234567890",
            length: 6
        });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            imgUrl,
            mobile,
            otp,
            expiresAt
        });

        let token = '';
        if (user) {
            token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY!, {
                expiresIn: "1d"
            });
        }
        const { data, statusCode } = buildSuccessMessage(user);

        const html = GetOtpMailTemplate(user?.name!, user?.otp!);

        sendMail(email, html, `${user?.name!}, here's your OTP to verify  your email on My Lawyer
`);

        res.status(statusCode).json(data);
    } catch (error) {
        const { data, statusCode } = buildFailMessage(error);
        res.status(statusCode).json(data);
    }
};

export const signIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

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

export const verifyEmail = async (req: Request, res: Response,) => {

    try {
        const { email, otp } = req.body;
        let user = {};
        if (otp) {

            user = await UserModel.findOne({ email });

            if(!user) {
                throw new Error("User not found");
            }
            const now = Date()
            
            if (now < user?.expiresAt!) {
                throw new Error("OTP Expired")
            }
            if(user?.otp !== otp ) {
                throw new Error("OTP Invalid")

            }

            const updateuser = await UserModel.findByIdAndUpdate(
                user?._id ,
                {
                isVerified: true,
                expiresAt: null,
                otp: null
            })

            const html = getHtml(user?.name!);
            sendMail(email, html, "Welcome to My Law");

        }
        const { data, statusCode } = buildSuccessMessage(user);

        res.status(statusCode).json(data);
    } catch (error) {
        console.log(error);
        const { data, statusCode } = buildFailMessage(error);
        res.status(statusCode).json(data);

    }
}

export const resendVerifyEmail = async (req: Request, res: Response,) => {

    try {
        const { email } = req.body;

        const expiresAt = (Date.now() + 60000 * 10) as unknown as string;
        const otp = +randomstring.generate({
            charset: "1234567890",
            length: 6
        });

        let user = await UserModel.findOne({ email });
        await UserModel.findByIdAndUpdate(user?.id ,{
            expiresAt,
            otp
        })


        const html = GetOtpMailTemplate(user?.name!, otp);

        sendMail(email, html, `${user?.name!}, here's your OTP to verify  your email on My Lawyer
`);


        const { data, statusCode } = buildSuccessMessage(user);

        res.status(statusCode).json(data);
    } catch (error) {

        const { data, statusCode } = buildFailMessage(error);
        res.status(statusCode).json(data);

    }
}
