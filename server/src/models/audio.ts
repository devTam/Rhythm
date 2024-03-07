import { ICategories, ICategoriesTypes } from "@/utils/audio_category"
import { Model, ObjectId, Schema, model, models } from "mongoose"

export interface IAudio<T = ObjectId> {
  _id: ObjectId
  title: string
  about: string
  owner: T
  file: {
    url: string
    publicId: string
  }
  poster?: {
    url: string
    publicId: string
  }
  likes: ObjectId[]
  category: ICategoriesTypes
}

const AudioSchema = new Schema<IAudio>({
  title: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  file: {
    type: Object,
    url: String,
    publicId: String,
    required: true,
  },
  poster: {
    type: Object,
    url: String,
    publicId: String,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  category: {
    type: String,
    enum: ICategories,
    default: "Others"
  }
}, {
    timestamps: true
});

const Audio = models.Audio || model("Audio", AudioSchema)

 export default Audio as Model<IAudio>
