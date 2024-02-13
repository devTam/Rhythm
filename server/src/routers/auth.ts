import { createUser } from "@/controllers/user"
import { validate } from "@/middlewares/validator"
import { CreateUserSchema } from "@/utils/validationSchema"
import { Router } from "express"

const router = Router()

router.post(
  "/signup",
  validate(CreateUserSchema),
  createUser
)

export default router
