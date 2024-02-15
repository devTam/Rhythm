import { Model, ObjectId, Schema, model } from "mongoose"
import { hash, compare } from "bcrypt"

interface IPasswordResetToken {
  owner: ObjectId
  token: string
  createdAt: Date
}

interface IMethods {
  compareToken(token: string): Promise<boolean>
}

const passwordResetTokenSchema = new Schema<
  IPasswordResetToken,
  {},
  IMethods
>({
  owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // expires in 1hr
})

passwordResetTokenSchema.pre("save", async function (next) {
  // hash password
  if (this.isModified("token")) {
    this.token = await hash(this.token, 10)
  }
  next()
})

passwordResetTokenSchema.methods.compareToken = async function (token) {
  return await compare(token, this.token)
}

export default model(
  "PasswordResetToken",
  passwordResetTokenSchema
) as Model<IPasswordResetToken, {}, IMethods>
