import { Model, ObjectId, Schema, model } from "mongoose"

interface IUser {
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

const userSchema = new Schema<IUser>(
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

export default model("User", userSchema) as Model<IUser>
