import crypto from "crypto"
import jwt from "jsonwebtoken"
import { RequestHandler } from "express"
import { isValidObjectId } from "mongoose"

import User from "@/models/User"
import PasswordResetToken from "@/models/PasswordResetToken"
import EmailVerificationToken from "@/models/EmailVerificationToken"

import {
  ReVerifyEmailRequest,
  UserRequest,
  VerifyEmailRequest,
} from "@/types/user"

import { generateToken } from "@/utils/helpers"
import { JWT_SECRET, PASSWORD_RESET_LINK } from "@/utils/variables"
import {
  sendForgotPasswordLink,
  sendVerificationEmail,
  sendResetSuccessEmail,
} from "@/utils/mail"

export const createUser: RequestHandler = async (req: UserRequest, res) => {
  const { name, email, password } = req.body
  const user = await User.create({
    name,
    email,
    password,
  })

  const token = generateToken()
  await EmailVerificationToken.create({
    owner: user._id,
    token,
  })

  sendVerificationEmail(token, { name, email, userId: user._id.toString() })

  res.status(201).json({ user: { id: user._id, name, email } })
}

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body

  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  })

  if (!verificationToken) {
    return res.status(403).json({ message: "Invalid token" })
  }

  const isMatch = await verificationToken.compareToken(token)

  if (!isMatch) return res.status(403).json({ message: "Invalid token" })

  await User.findByIdAndUpdate(userId, { verified: true })
  await EmailVerificationToken.findByIdAndDelete(verificationToken._id)

  res.json({
    message: "Your Email is verified!",
  })
}

export const sendReVerificationToken: RequestHandler = async (
  req: ReVerifyEmailRequest,
  res
) => {
  const { userId } = req.body
  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid Request!" })
  // Delete prev token
  await EmailVerificationToken.findOneAndDelete({ owner: userId })
  const token = generateToken()
  await EmailVerificationToken.create({ token, owner: userId })

  const user = await User.findById(userId)

  if (!user) return res.status(403).json({ error: "User not found!" })
  sendVerificationEmail(token, {
    name: user.name,
    email: user.email,
    userId: user._id.toString(),
  })

  res.json({ message: "Verification email sent!" })
}

export const generateForgotPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })
  if (!user) return res.status(404).json({ error: "User not found!" })

  // generate Link
  await PasswordResetToken.findOneAndDelete({ owner: user._id })
  const token = crypto.randomBytes(36).toString("hex")

  await PasswordResetToken.create({ owner: user._id, token })

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`

  sendForgotPasswordLink({ email: user.email, link: resetLink })
  res.json({ message: "Reset link sent!" })
}

export const tokenValid: RequestHandler = async (req, res) => {
  res.json({ valid: true })
}

export const updatePassword: RequestHandler = async (req, res) => {
  const { userId, password } = req.body

  const user = await User.findById(userId)
  if (!user) return res.status(403).json({ error: "Unauthorized access!" })

  const isMatch = await user.comparePassword(password)
  if (isMatch)
    return res
      .status(422)
      .json({ error: "New password cannot be same as old password!" })

  user.password = password
  await user.save()

  await PasswordResetToken.findOneAndDelete({ owner: user._id })

  sendResetSuccessEmail(user.name, user.email)
  res.json({ message: "Password updated successfully!" })
}

export const signIn: RequestHandler = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user)
    return res.status(403).json({ error: "Email or Password is not correct!" })

  // compare Password
  const isMatch = await user.comparePassword(password)
  if (!isMatch)
    return res.status(403).json({ error: "Email or Password is not correct!" })

  // generate token
  const token = jwt.sign(
    {
      userId: user._id,
    },
    JWT_SECRET
  )

  user.tokens.push(token)
  await user.save()

  res.json({ 
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar,
      followers: user.followers.length,
      followings: user.followings.length,
      favorites: user.favorites,
    },
    token,
  })
}
