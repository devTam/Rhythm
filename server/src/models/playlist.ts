import { Model, ObjectId, Schema, model, models } from "mongoose"

interface IPlaylist {
  title: string
  owner: ObjectId
  items: ObjectId[]
  visibility: "public" | "private" | "auto"
}

const PlaylistSchema = new Schema<IPlaylist>(
  {
    title: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Audio",
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "private", "auto"],
      default: "public",
    },
  },
  {
    timestamps: true,
  }
)

const Playlist = models.Playlist || model("Playlist", PlaylistSchema)

export default Playlist as Model<IPlaylist>
