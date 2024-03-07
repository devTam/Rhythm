import Audio from "@/models/audio"
import Playlist from "@/models/playlist"
import {
  ICreatePlaylistRequest,
  IPopulatedFavList,
  IUpdatePlaylistRequest,
} from "@/types/audio"
import { RequestHandler } from "express"
import { isValidObjectId } from "mongoose"

export const createPlaylist: RequestHandler = async (
  req: ICreatePlaylistRequest,
  res
) => {
  const { title, resId, visibility } = req.body
  const ownerId = req.user.id

  if (resId) {
    const audio = await Audio.findById(resId)
    if (!audio) return res.status(404).json({ error: "Audio not found!" })
  }

  const newPlaylist = new Playlist({
    title,
    owner: ownerId,
    visibility,
  })

  if (resId) newPlaylist.items = [resId as any]
  await newPlaylist.save()

  res.status(201).json({
    playlist: {
      id: newPlaylist._id,
      title: newPlaylist.title,
      visibility: newPlaylist.visibility,
    },
  })
}

export const updatePlaylist: RequestHandler = async (
  req: IUpdatePlaylistRequest,
  res
) => {
  const { title, id, visibility, item } = req.body
  const ownerId = req.user.id

  const playlist = await Playlist.findOneAndUpdate(
    { _id: id, owner: ownerId },
    {
      title,
      visibility,
    },
    { new: true }
  )

  if (!playlist) return res.status(404).json({ error: "Playlist not found!" })

  if (item) {
    const audio = await Audio.findById(item)

    if (!audio)
      return res.status(404).json({
        error: "Audio not found!",
      })
    await Playlist.findByIdAndUpdate(playlist._id, {
      $addToSet: { items: item },
    })
  }
  res.json({
    playlist: {
      id: playlist._id,
      title: playlist.title,
      visibility: playlist.visibility,
    },
  })
}

export const deletePlaylist: RequestHandler = async (req, res) => {
  const { playlistId, resId, all } = req.query
  const ownerId = req.user.id

  if (!isValidObjectId(playlistId))
    return res.status(422).json({ error: "Invalid playlist Id" })

  if (all === "yes") {
    const playlist = await Playlist.findByIdAndDelete({
      _id: playlistId,
      owner: ownerId,
    })

    if (!playlist)
      return res.status(404).json({
        error: "Playlist not found!",
      })
  }

  if (resId) {
    if (!isValidObjectId(resId))
      return res.status(422).json({ error: "Invalid audio Id" })

    const playlist = await Playlist.findOneAndUpdate(
      {
        _id: playlistId,
        owner: ownerId,
      },
      {
        $pull: { items: resId },
      }
    )
    if (!playlist)
      return res.status(404).json({
        error: "Playlist not found!",
      })
  }
  res.json({ success: true })
}

export const getPlaylistByProfile: RequestHandler = async (req, res) => {
  const { pageNum = "0", limit = "20" } = req.query as {
    pageNum: string
    limit: string
  }
  const data = await Playlist.find({
    owner: req.user.id,
    visibility: { $ne: "auto" },
  })
    .skip(parseInt(pageNum) * parseInt(limit))
    .limit(parseInt(limit))
    .sort("-createdAt")

  const playlist = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      audioCount: item.items.length,
      visibility: item.visibility,
    }
  })

  res.json({ playlist })
}

export const getAudios: RequestHandler = async (req, res) => {
  const { playlistId } = req.params

  if (!isValidObjectId(playlistId))
    return res.status(422).json({ error: "Invalid playlist Id" })

  const playlist = await Playlist.findOne({
    owner: req.user.id,
    _id: playlistId,
  }).populate<{ items: IPopulatedFavList[] }>({
    path: "items",
    populate: {
      path: "owner",
      select: "name",
    },
  })

  if (!playlist) return res.json({ list: [] })

  const audios = playlist?.items.map((item) => {
    return {
      id: item._id,
      title: item.title,
      category: item.category,
      file: item.file.url,
      poster: item.poster?.url,
      owner: {
        name: item.owner.name,
        id: item.owner._id,
      },
    }
  })

  res.json({
    list: {
      id: playlist._id,
      title: playlist.title,
      audios,
    },
  })
}
