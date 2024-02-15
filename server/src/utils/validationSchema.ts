import { isValidObjectId } from "mongoose"
import * as yup from "yup"

export const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is required!")
    .min(3, "Name is too short!"),
  email: yup.string().required("Email is required!").email("Invalid Email!"),
  password: yup
    .string()
    .trim()
    .required("Password is required!")
    .min(8, "Password must be min 8 characters long!")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
})

export const TokenAndIdValidationSchema = yup.object().shape({
  token: yup
    .string()
    .trim()
    .required("Token is required!")
    .min(6, "Token is too short!"),
  userId: yup
    .string()
    .transform(function (value) {
      return this.isType(value) && isValidObjectId(value) ? value : ""
    })
    .required("Invalid UserId!"),
})

export const UpdatePasswordSchema = yup.object().shape({
  token: yup
    .string()
    .trim()
    .required("Token is required!")
    .min(6, "Token is too short!"),
  userId: yup
    .string()
    .transform(function (value) {
      return this.isType(value) && isValidObjectId(value) ? value : ""
    })
    .required("Invalid UserId!"),
  password: yup
    .string()
    .trim()
    .required("Password is required!")
    .min(8, "Password must be min 8 characters long!")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
})
