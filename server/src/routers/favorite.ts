import { getFavorites, getIsFavorite, toggleFavorite } from "@/controllers/favorite"
import { isAuth, isVerified } from "@/middlewares/auth"
import { Router } from "express"

const router = Router();

router.post(
  "/",
  isAuth,
  isVerified,
  toggleFavorite
)

router.get(
  "/",
  isAuth,
  getFavorites
)

router.get(
  "/is-fav",
  isAuth,
  getIsFavorite
)

export default router
