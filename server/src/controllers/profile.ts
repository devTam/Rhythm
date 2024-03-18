import User from "@/models/User"
import Audio, { IAudio } from "@/models/audio"
import AutoPlaylist from "@/models/autoGeneratedPlayllist"
import History from "@/models/history"
import Playlist from "@/models/playlist"
import { IPaginationQuery } from "@/types/misc"
import { getUsersPreviousHistory } from "@/utils/helpers"
import { RequestHandler } from "express"
import { ObjectId, PipelineStage, Types, isValidObjectId } from "mongoose"

export const updateFollower: RequestHandler = async (req, res) => {
  const { profileId } = req.params
  let status: "added" | "removed"
  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid Profile Id!" })

  const profile = await User.findById(profileId)

  if (!profile) return res.status(404).json({ error: "Profile not found!" })

  const alreadyFollowing = await User.findOne({
    _id: profileId,
    followers: req.user.id,
  })
  if (alreadyFollowing) {
    await User.updateOne(
      { _id: profileId },
      {
        $pull: { followers: req.user.id },
      }
    )
    status = "removed"
  } else {
    await User.updateOne(
      { _id: profileId },
      {
        $addToSet: { followers: req.user.id },
      }
    )
    status = "added"
  }
  if (status === "added") {
    await User.updateOne(
      { _id: req.user.id },
      {
        $addToSet: { followings: profileId },
      }
    )
  }
  if (status === "removed") {
    await User.updateOne(
      { _id: req.user.id },
      {
        $pull: { followings: profileId },
      }
    )
  }

  res.json({ status })
}

export const getUploads: RequestHandler = async (req, res) => {
  const { limit = "20", pageNum = "0" } = req.query as IPaginationQuery
  const data = await Audio.find({ owner: req.user.id })
    .skip(parseInt(limit) * parseInt(pageNum))
    .limit(parseInt(limit))
    .sort("-createdAt")

  const audios = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      about: item.about,
      file: item.file.url,
      poster: item.poster?.url,
      date: item.createdAt,
      owner: { name: req.user.name, id: req.user.id },
    }
  })

  res.json({ audios })
}

export const getPublicUploads: RequestHandler = async (req, res) => {
  const { limit = "20", pageNum = "0" } = req.query as IPaginationQuery
  const { profileId } = req.params
  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid Profile Id!" })

  const data = await Audio.find({ owner: profileId })
    .skip(parseInt(limit) * parseInt(pageNum))
    .limit(parseInt(limit))
    .sort("-createdAt")
    .populate<IAudio<{ name: string; _id: ObjectId }>>("owner")

  const audios = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      about: item.about,
      file: item.file.url,
      poster: item.poster?.url,
      date: item.createdAt,
      owner: { name: item.owner.name, id: item.owner._id },
    }
  })

  res.json({ audios })
}

export const getPublicProfile: RequestHandler = async (req, res) => {
  const { profileId } = req.params
  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid Profile Id!" })

  const user = await User.findById(profileId)

  if (!user) return res.status(404).json({ error: "User not found!" })

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      followers: user.followers.length,
      avatar: user.avatar?.url,
    },
  })
}

export const getPublicPlaylist: RequestHandler = async (req, res) => {
  const { limit = "20", pageNum = "0" } = req.query as IPaginationQuery
  const { profileId } = req.params
  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid Profile Id!" })

  const data = await Playlist.find({
    owner: profileId,
    visibility: "public",
  })
    .skip(parseInt(limit) * parseInt(pageNum))
    .limit(parseInt(limit))
    .sort("-createdAt")

  if (!data) return res.json({ playlist: [] })
  const playlist = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      itemsCount: item.items.length,
      visibility: item.visibility,
    }
  })

  res.json({ playlist })
}

export const getRecommendedByProfile: RequestHandler = async (req, res) => {
  const user = req.user

  let matchOptions: PipelineStage.Match = { $match: { _id: { $exists: true } } }

  if (user) {
    // send rec audios by profile
    const categories = await getUsersPreviousHistory(req)

    if (categories.length) {
      matchOptions = { $match: { category: { $in: categories } } }
    }
  }
  // else send generic audios
  const audios = await Audio.aggregate([
    matchOptions,
    {
      $sort: {
        // Brings the highest liked audio at the top
        "likes.count": -1,
      },
    },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },
    {
      $project: {
        _id: 0,
        id: "$_id",
        title: "$title",
        category: "$category",
        about: "$about",
        file: "$file.url",
        poster: "$poster.url",
        owner: {
          name: "$owner.name",
          id: "$owner._id",
        },
      },
    },
  ])

  res.json({ audios })
}

export const getAutoGeneratedPlaylist: RequestHandler = async (req, res) => {
  // find 5 playlists

  // 1 mix 20 - 20 audios from prev history of user

  const [result] = await History.aggregate([
    { $match: { owner: req.user.id } },
    { $unwind: "$all" },
    { $group: { _id: "$all.audio", items: { $addToSet: "$all.audio" } } },
    { $sample: { size: 20 } },
    { $group: { _id: null, items: { $push: "$_id" } } },
  ])

  const TITLE = "Mix 20"

  if (result) {
    await Playlist.updateOne(
      { owner: req.user.id, title: TITLE },
      {
        $set: { title: TITLE, items: result.items, visibility: "auto" },
      },
      { upsert: true }
    )
  }

  // 4 autogenerated playlist
  const categories = await getUsersPreviousHistory(req)
  let matchOptions: PipelineStage.Match = { $match: { _id: { $exists: true } } }
  if (categories.length) {
    matchOptions = { $match: { title: { $in: categories } } }
  }

  const autoPlaylists = await AutoPlaylist.aggregate([
    matchOptions,
    { $sample: { size: 4 } },
    {
      $project: {
        _id: 0,
        id: "$_id",
        title: "$title",
        itemsCount: { $size: "$items" },
      },
    },
  ])

  const playlist = await Playlist.findOne({ owner: req.user.id, title: TITLE })
  const finalList = autoPlaylists.concat({
    id: playlist?._id,
    title: playlist?.title,
    itemsCount: playlist?.items.length,
  })
  res.json({ playlist: finalList })
}

export const getFollowersProfile: RequestHandler = async (req, res) => {
  const { limit = "20", pageNum = "0" } = req.query as IPaginationQuery

  const [result] = await User.aggregate([
    { $match: { _id: req.user.id } },
    {
      $project: {
        followers: {
          $slice: [
            "$followers",
            parseInt(pageNum) * parseInt(limit),
            parseInt(limit),
          ],
        },
      },
    },
    { $unwind: "$followers" },
    {
      $lookup: {
        from: "users",
        localField: "followers",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    {
      $group: {
        _id: null,
        followers: {
          $push: {
            id: "$userInfo._id",
            name: "$userInfo.name",
            avatar: "$userInfo.avatar.url",
          },
        },
      },
    },
  ])

  if (!result) res.json({ followers: [] })

  res.json({ followers: result.followers })
}

export const getFollowersProfilePublic: RequestHandler = async (req, res) => {
  const { limit = "20", pageNum = "0" } = req.query as IPaginationQuery

  const { profileId } = req.params

  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid Profile Id!" })

  const [result] = await User.aggregate([
    { $match: { _id: new Types.ObjectId(profileId) } },
    {
      $project: {
        followers: {
          $slice: [
            "$followers",
            parseInt(pageNum) * parseInt(limit),
            parseInt(limit),
          ],
        },
      },
    },
    { $unwind: "$followers" },
    {
      $lookup: {
        from: "users",
        localField: "followers",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    {
      $group: {
        _id: null,
        followers: {
          $push: {
            id: "$userInfo._id",
            name: "$userInfo.name",
            avatar: "$userInfo.avatar.url",
          },
        },
      },
    },
  ])

  if (!result) res.json({ followers: [] })

  res.json({ followers: result.followers })
}

export const getFollowingsProfile: RequestHandler = async (req, res) => {
  const { limit = "20", pageNum = "0" } = req.query as IPaginationQuery

  const [result] = await User.aggregate([
    { $match: { _id: req.user.id } },
    {
      $project: {
        followings: {
          $slice: [
            "$followings",
            parseInt(pageNum) * parseInt(limit),
            parseInt(limit),
          ],
        },
      },
    },
    { $unwind: "$followings" },
    {
      $lookup: {
        from: "users",
        localField: "followings",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    {
      $group: {
        _id: null,
        followings: {
          $push: {
            id: "$userInfo._id",
            name: "$userInfo.name",
            avatar: "$userInfo.avatar.url",
          },
        },
      },
    },
  ])

  if (!result) res.json({ followings: [] })

  res.json({ followings: result.followings })
}
