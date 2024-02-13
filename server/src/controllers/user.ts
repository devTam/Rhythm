import { RequestHandler } from "express"

import User from "@/models/user"
import { UserRequest } from "@/types/user"
import { generateToken } from "@/utils/helpers"
import { sendVerificationEmail } from "@/utils/mail"

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
