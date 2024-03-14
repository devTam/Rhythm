import { Model, ObjectId, Schema, model, models } from "mongoose"

interface IAutoPlaylist {
  title: string
  items: ObjectId[]
}

const AutoPlaylistSchema = new Schema<IAutoPlaylist>(
  {
    title: {
      type: String,
      required: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Audio",
      },
    ],
  },
  {
    timestamps: true,
  }
)

const AutoPlaylist =
  models.AutoPlaylist || model("AutoPlaylist", AutoPlaylistSchema)

export default AutoPlaylist as Model<IAutoPlaylist>
