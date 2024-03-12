import { updateHistory, deleteHistory } from "@/controllers/history"
import { isAuth } from "@/middlewares/auth"
import { validate } from "@/middlewares/validator"
import { updateHistoryValidationSchema } from "@/utils/validationSchema"
import { Router } from "express"

const router = Router()

router.post("/", isAuth, validate(updateHistoryValidationSchema), updateHistory)
router.delete("/", isAuth, deleteHistory)

export default router
