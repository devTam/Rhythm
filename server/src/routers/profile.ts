import {
  getUploads,
  updateFollower,
  getPublicUploads,
  getPublicProfile,
  getPublicPlaylist,
} from "@/controllers/profile"
import { isAuth } from "@/middlewares/auth"
import { Router } from "express"

const router = Router()

router.post("/update-follower/:profileId", isAuth, updateFollower)
router.get("/uploads", isAuth, getUploads)
router.get("/uploads/:profileId", getPublicUploads)
router.get("/info/:profileId", getPublicProfile)
router.get("/info/:profileId", getPublicProfile)
router.get("/playlist/:profileId", getPublicPlaylist)

export default router
