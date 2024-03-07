import { isValidObjectId } from "mongoose"
import * as yup from "yup"
import { ICategories } from "./audio_category"

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

export const SignInValidationSchema = yup.object().shape({
  email: yup.string().required("Email is required!").email("Invalid Email!"),
  password: yup.string().trim().required("Password is required!"),
})

export const AudioValidationSchema = yup.object().shape({
  title: yup.string().required("Title is required!"),
  about: yup.string().required("About is required!"),
  category: yup
    .string()
    .oneOf(ICategories, "Invalid category!")
    .required("Category is required!"),
})

export const UpdateAudioValidationSchema = yup.object().shape({
  title: yup.string(),
  about: yup.string(),
  category: yup.string().oneOf(ICategories, "Invalid category!"),
})

export const NewPlaylistValidationSchema = yup.object().shape({
  title: yup.string().required("Title is required!"),
  resId: yup.string().transform(function (value) {
    return this.isType(value) && isValidObjectId(value) ? value : ""
  }),
  visibility: yup
    .string()
    .oneOf(["public", "private"], "Visibility must be public or private!")
    .required("Visibility is required!"),
})

export const PlaylistValidationSchema = yup.object().shape({
  title: yup.string().required("Title is required!"),
  // validates audio Id
  item: yup.string().transform(function (value) {
    return this.isType(value) && isValidObjectId(value) ? value : ""
  }),
  // validates playlist Id
  id: yup.string().transform(function (value) {
    return this.isType(value) && isValidObjectId(value) ? value : ""
  }),
  visibility: yup
    .string()
    .oneOf(["public", "private"], "Visibility must be public or private!")
    //.required("Visibility is required!"),
})
