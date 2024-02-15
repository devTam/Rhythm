import {
  createUser,
  verifyEmail,
  sendReVerificationToken,
  generateForgotPasswordLink,
  tokenValid,
  updatePassword
} from "@/controllers/user"
import { verifyResetToken } from "@/middlewares/auth"
import { validate } from "@/middlewares/validator"
import {
  CreateUserSchema,
  TokenAndIdValidationSchema,
  UpdatePasswordSchema,
} from "@/utils/validationSchema"
import { Router } from "express"

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

export default router
