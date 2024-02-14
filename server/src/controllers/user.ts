import { RequestHandler } from "express"

import User from "@/models/user"
import { UserRequest, VerifyEmailRequest } from "@/types/user"
import { generateToken } from "@/utils/helpers"
import { sendVerificationEmail } from "@/utils/mail"
import EmailVerificationToken from "@/models/emailVerificationToken"

export const createUser: RequestHandler = async (req: UserRequest, res) => {
  const { name, email, password } = req.body
  const user = await User.create({
    name,
    email,
    password,
  })

  const token = generateToken(6)
  sendVerificationEmail(token, { name, email, userId: user._id.toString() })

  res.json({ user: { id: user._id, name, email } }).status(201)
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
  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.json({
    message: "Your Email is verified!"
  })
}
