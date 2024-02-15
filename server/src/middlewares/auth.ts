import PasswordResetToken from "@/models/PasswordResetToken"
import { RequestHandler } from "express"

export const verifyResetToken: RequestHandler = async (req, res, next) => {
  const { token, userId } = req.body

  const resetToken = await PasswordResetToken.findOne({ owner: userId })
  if (!resetToken) return res.status(403).json({ error: "Invalid token!" })

  const isMatch = await resetToken.compareToken(token)
  if (!isMatch) return res.status(403).json({ error: "Invalid token!" })

  next()
}
