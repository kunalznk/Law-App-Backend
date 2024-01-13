import * as yup from "yup";

const firstName = yup.string().required().min(5).max(100);
const lastName = yup.string().required().min(5).max(100);
const emailId = yup
  .string()
  .email("Please enter valid email id")
  .required()
  .min(5)
  .max(100);
const role = yup.string().matches(/(CUSTOMER|SELLER|DELIVERY_PARTNER)/);

const addressLine1 = yup.string().required("Please Enter Valud Address").min(5).max(1000);
const addressLine2 = yup.string().optional().min(5).max(1000);
const city = yup.string().required("Please Enter City").min(5).max(250);
const state = yup.string().required("Please Enter State").min(5).max(250);
const pinCode = yup.string().required("Please Enter Pin Coed").min(5).max(10);
const addressType = yup.string().required("Please Enter Type").min(5).max(250);
const isDefault = yup.boolean().optional()



export const address = yup.object({
    addressLine1,
    addressLine2,
    city,
    state,
    pinCode,
    addressType,
    isDefault

})

export const CreateUserSchema = yup.object({
  firstName,
  lastName,
  emailId,
  role,
  address: yup.array().of(address).min(0)
});

export const updateUserSchema = yup.object({
    firstName: firstName.optional(),
    lastName: lastName.optional(),
    address: address.optional(),
}).required("Please select min one value");



const title = yup.string().required("Please Enter valid product title").min(5).max(100);
const desc = yup.string().required("Please Enter valid product desc").min(5).max(100);
const brand = yup.string().required("Please Enter valid product brand").min(5).max(100);
const category = yup.object().optional()
const qty = yup.number().required("Please Enter valid product Qty").min(1);
const price = yup.number().required("Please Enter valid product Price").min(0);
const images = yup.array().of(yup.string()).min(1);
const avgRating = yup.number().min(1).max(5).optional()
const variant = yup.object().optional();
const isDiscounted = yup.number().required("Please Enter valid product discount").min(0).max(100);
const sellerId = yup.string().required("Please Enter valid product seller");

export const addProductSchema = yup.object({
  title,
  desc,
  brand,
  category,
  qty,
  price,
  images,
  avgRating,
  variant,
  isDiscounted,
  sellerId
})

export const updateProductSchema = yup.object({
  title,
  desc,
  brand,
  category,
  qty,
  price,
  images,
  avgRating,
  variant,
  isDiscounted,
})