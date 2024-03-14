import { RequestHandler } from "express"
import { JwtPayload, verify } from "jsonwebtoken"

import User from "@/models/User"
import PasswordResetToken from "@/models/passwordResetToken"

import { JWT_SECRET } from "@/utils/variables"

export const verifyResetToken: RequestHandler = async (req, res, next) => {
  const { token, userId } = req.body

  const resetToken = await PasswordResetToken.findOne({ owner: userId })
  if (!resetToken) return res.status(403).json({ error: "Invalid token!" })

  const isMatch = await resetToken.compareToken(token)
  if (!isMatch) return res.status(403).json({ error: "Invalid token!" })

  next()
}

export const isAuth: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers
  const token = authorization?.split("Bearer")[1].trim()
  if (!token) return res.status(403).json({ message: "Unauthorized" })

  const payload = verify(token, JWT_SECRET) as JwtPayload
  const { userId } = payload

  const user = await User.findOne({
    _id: userId,
    tokens: token,
  })
  if (!user) return res.status(403).json({ message: "Unauthorized" })

  req.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    avatar: user.avatar?.url,
    followers: user.followers.length,
    followings: user.followings.length,
  }

  req.token = token
  next()
}

export const profileAuth: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers
  const token = authorization?.split("Bearer")[1].trim()

  if (token) {
    const payload = verify(token, JWT_SECRET) as JwtPayload
    const { userId } = payload

    const user = await User.findOne({
      _id: userId,
      tokens: token,
    })
    if (!user) return res.status(403).json({ message: "Unauthorized" })

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers.length,
      followings: user.followings.length,
    }

    req.token = token
  }
  next()
}

export const isVerified: RequestHandler = async (req, res, next) => {
  if (!req.user.verified)
    return res.status(403).json({ error: "Please verify your email account" })

  next()
}
