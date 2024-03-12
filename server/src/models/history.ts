import { Model, ObjectId, Schema, model, models } from "mongoose"

export type IHistoryType = {
  audio: ObjectId
  progress: number
  date: Date
}

interface IHistory {
  owner: ObjectId
  last: IHistoryType
  all: IHistoryType[]
}

const HistorySchema = new Schema<IHistory>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    last: {
      audio: {
        type: Schema.Types.ObjectId,
        ref: "Audio",
      },
      progress: Number,
      date: {
        type: Date,
        required: true,
      },
    },
    all: [
      {
        audio: {
          type: Schema.Types.ObjectId,
          ref: "Audio",
        },
        progress: Number,
        date: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
)

const History = models.History || model("History", HistorySchema)

export default History as Model<IHistory>
