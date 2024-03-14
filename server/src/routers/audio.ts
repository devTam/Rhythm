import { createAudio, updateAudio, getLatestUploads } from "@/controllers/audio"
import { isAuth, isVerified } from "@/middlewares/auth"
import fileParser from "@/middlewares/fileParser"
import { validate } from "@/middlewares/validator"
import { AudioValidationSchema, UpdateAudioValidationSchema } from "@/utils/validationSchema"
import { Router } from "express"

const router = Router()

router.post(
  "/create",
  isAuth,
  isVerified,
  fileParser,
  validate(AudioValidationSchema),
  createAudio
)

router.patch(
  "/:audioId",
  isAuth,
  isVerified,
  fileParser,
  validate(UpdateAudioValidationSchema),
  updateAudio
)

router.get("/latest", getLatestUploads)

export default router
