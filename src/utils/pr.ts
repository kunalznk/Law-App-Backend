import * as yup from "yup";
import { InferType } from 'yup';

const title = yup.string().required().min(5).max(100);
const description = yup.string().required().min(0).max(100);
const feature_bullets = yup.array().of(yup.string().required().min(3).max(255)).min(0);
const category =  yup.string().required().min(0).max(100);
const url = yup.string().url("Please provide url")
const total_reviews = yup.number().min(0);
const rating =  yup.number().min(0);
const answered_questions = yup.number().min(0);
const variants = yup.array().of(yup.string().required().min(3).max(255)).min(0);
const categories =  yup.array().of(yup.object({category, url}));
const reviews = yup.object({total_reviews, rating ,answered_questions}).required("Please Provides Reviews Information");
const item_available = yup.boolean().required();

const symbol=  yup.string().required().min(0).max(100);
const currency=  yup.string().required().min(0).max(100);
const current_price=  yup.number().required().min(1);
const discounted= yup.boolean().required();
const before_price= yup.number().required().min(1);
const savings_amount=  yup.number().required().min(0);
const savings_percent=  yup.number().required().min(0);

const price = yup.object({symbol, currency, current_price, discounted, before_price, savings_amount, savings_percent}).required("Please Provide Valid Price ");
const main_image = url;
const total_images =  yup.number().required().min(0);
const images =  yup.array().of(url).min(1);

const dimensions=  yup.string().required().min(0).max(1000);
const weight=  yup.string().required().min(0).max(1000);
const available_from=  yup.string().required().min(0).max(1000);
const available_from_utc=  yup.string().required().min(0).max(1000);
const available_for_months=  yup.number().required().min(0);
const available_for_days=  yup.number().required().min(0);
const manufacturer=  yup.string().required().min(0).max(1000);
const model_number=  yup.string().required().min(0).max(1000);
const department=  yup.string().required().min(0).max(1000);
const qty_per_order =  yup.number().required().min(0);
const store_id=  yup.string().required().min(0).max(1000);
const brand=  yup.string().required().min(0).max(1000);

const product_information = yup.object(
    {
    dimensions,
    weight,
    available_from,
    available_from_utc,
    available_for_months,
    available_for_days,
    manufacturer,
    model_number,
    department,
    qty_per_order,
    store_id,
    brand
}).optional();

export const ProductSchema = yup.object({
    title,
    description,
    feature_bullets,
    variants,
    categories,
    url,
    reviews,
    item_available,
    price,
    main_image,
    total_images,
    images,
    product_information
}).required("Please Provide Correct Product Information") 

export type productType = InferType<typeof ProductSchema>;