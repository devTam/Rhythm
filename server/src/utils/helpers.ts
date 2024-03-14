import { IUser } from "@/models/User"
import History from "@/models/history"
import { Request } from "express"
import moment from "moment"

export const generateToken = (length: number = 6) => {
  let otp = ""
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10)
  }
  return otp
}

export const formatProfile = (user: IUser) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    avatar: user.avatar?.url,
    followers: user.followers.length,
    followings: user.followings.length,
  }
}

export const getUsersPreviousHistory = async (req: Request): Promise<string[]> => {
  const [result] = await History.aggregate([
    { $match: { owner: req.user.id } },
    { $unwind: "$all" },
    {
      $match: {
        "all.date": {
          $gte: moment().subtract(30, "days").toDate(),
        },
      },
    },
    { $group: { _id: "$all.audio" } },
    {
      $lookup: {
        from: "audios",
        localField: "_id",
        foreignField: "_id",
        as: "audioData",
      },
    },
    {
      $unwind: "$audioData",
    },
    {
      $group: {
        _id: null,
        category: {
          $addToSet: "$audioData.category",
        },
      },
    },
  ])

  if(result) {
    return result.category;
  }

  return []
}
