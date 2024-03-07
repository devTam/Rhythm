import Audio from "@/models/audio"
import Playlist from "@/models/playlist"
import { ICreatePlaylistRequest, IUpdatePlaylistRequest } from "@/types/audio"
import { RequestHandler } from "express"

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
