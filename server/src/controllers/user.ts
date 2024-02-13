import { RequestHandler } from "express"

import User from "@/models/user"
import { UserRequest } from "@/types/user"

export const createUser: RequestHandler = async (req: UserRequest, res) => {
  const { name, email, password } = req.body
  const user = await User.create({
    name,
    email,
    password,
  })
  res.json({ user }).status(201)
}
