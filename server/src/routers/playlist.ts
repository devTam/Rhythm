import {
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getPlaylistByProfile,
  getAudios,
} from "@/controllers/playlist"
import { isAuth, isVerified } from "@/middlewares/auth"
import { validate } from "@/middlewares/validator"
import {
  NewPlaylistValidationSchema,
  PlaylistValidationSchema,
} from "@/utils/validationSchema"
import { Router } from "express"

const router = Router()

router.post(
  "/create",
  isAuth,
  isVerified,
  validate(NewPlaylistValidationSchema),
  createPlaylist
)

router.patch("/", isAuth, validate(PlaylistValidationSchema), updatePlaylist)

router.delete("/", isAuth, deletePlaylist)

router.get("/by-profile", isAuth, getPlaylistByProfile)

router.get("/:playlistId", isAuth, getAudios)

export default router
