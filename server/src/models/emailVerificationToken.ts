import { Model, ObjectId, Schema, model } from "mongoose"
import { hash, compare } from "bcrypt"

interface IEmailVerificationToken {
  owner: ObjectId
  token: string
  createdAt: Date
}

interface IMethods {
  compareToken(token: string): Promise<boolean>
}

const emailVerificationTokenSchema = new Schema<
  IEmailVerificationToken,
  {},
  IMethods
>({
  owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // expires in 1hr
})

emailVerificationTokenSchema.pre("save", async function (next) {
  // hash password
  if (this.isModified("token")) {
    this.token = await hash(this.token, 10)
  }
  next()
})

emailVerificationTokenSchema.methods.compareToken = async function (token) {
  return await compare(token, this.token)
}

export default model(
  "EmailVerificationToken",
  emailVerificationTokenSchema
) as Model<IEmailVerificationToken, {}, IMethods>
