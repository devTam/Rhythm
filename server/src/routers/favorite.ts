import { toggleFavorite } from "@/controllers/favorite"
import { isAuth, isVerified } from "@/middlewares/auth"
import { Router } from "express"

const router = Router();

router.post(
  "/",
  isAuth,
  isVerified,
  toggleFavorite
)

export default router
