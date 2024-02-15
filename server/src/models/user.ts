import { Model, ObjectId, Schema, model } from "mongoose"
import { hash, compare } from "bcrypt"

export interface IUser {
  _id: ObjectId
  name: string
  email: string
  password: string
  verified: boolean
  avatar?: { url: string; publicId: string }
  tokens: string[]
  favorites: ObjectId[]
  followings: ObjectId[]
  followers: ObjectId[]
}

interface IMethods {
  comparePassword(password: string): Promise<boolean>
}

const userSchema = new Schema<IUser, {}, IMethods>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    avatar: { url: { type: String }, publicId: { type: String } },
    tokens: [{ type: String }],
    favorites: [{ type: Schema.Types.ObjectId, ref: "Audio" }],
    followings: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
)

userSchema.pre("save", async function (next) {
  // hash password
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10)
  }
  next()
})

userSchema.methods.comparePassword = async function (password) {
  return await compare(password, this.password)
}

export default model("User", userSchema) as Model<IUser, {}, IMethods>
