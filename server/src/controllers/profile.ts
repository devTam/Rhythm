import User from "@/models/User"
import Audio, { IAudio } from "@/models/audio"
import Playlist from "@/models/playlist"
import { IPaginationQuery } from "@/types/misc"
import { RequestHandler } from "express"
import { ObjectId, isValidObjectId } from "mongoose"

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
