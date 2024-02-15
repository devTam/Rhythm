import { Router } from "express"

import {
  createUser,
  verifyEmail,
  sendReVerificationToken,
  generateForgotPasswordLink,
  tokenValid,
  updatePassword,
  signIn,
  updateProfile,
  sendProfile,
  signOut
} from "@/controllers/auth"

import fileParser from "@/middlewares/fileParser"
import { validate } from "@/middlewares/validator"
import { isAuth, verifyResetToken } from "@/middlewares/auth"

import {
  CreateUserSchema,
  SignInValidationSchema,
  TokenAndIdValidationSchema,
  UpdatePasswordSchema,
} from "@/utils/validationSchema"

const router = Router()

router.post("/signup", validate(CreateUserSchema), createUser)

router.post("/verify-email", validate(TokenAndIdValidationSchema), verifyEmail)

router.post("/re-verify-email", sendReVerificationToken)

router.post("/forgot-password", generateForgotPasswordLink)

router.post(
  "/verify-reset-token",
  validate(TokenAndIdValidationSchema),
  verifyResetToken,
  tokenValid
)

router.post(
  "/update-password",
  validate(UpdatePasswordSchema),
  verifyResetToken,
  updatePassword
)

router.post("/sign-in", validate(SignInValidationSchema), signIn)

router.get("/is-auth", isAuth, sendProfile)

router.post("/update-profile", isAuth, fileParser, updateProfile);

router.post("/sign-out", isAuth, signOut)

export default router
