import { Router } from "express"
import {
  createUser,
  verifyEmail,
  sendReVerificationToken,
  generateForgotPasswordLink,
  tokenValid,
  updatePassword,
  signIn,
} from "@/controllers/user"
import { isAuth, verifyResetToken } from "@/middlewares/auth"
import { validate } from "@/middlewares/validator"
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

router.get("/is-auth", isAuth, (req, res) => {
  res.json({
    profile: req.user,
  })
})

export default router
