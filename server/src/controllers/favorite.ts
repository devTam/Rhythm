import Audio from "@/models/audio"
import Favorite from "@/models/favorite"
import { IPopulatedFavList } from "@/types/audio"
import { RequestHandler } from "express"
import { isValidObjectId } from "mongoose"

export const toggleFavorite: RequestHandler = async (req, res) => {
  const audioId = req.query.audioId as string
  let status: "added" | "removed"

  if (!isValidObjectId(audioId))
    return res.status(422).json({
      error: "Audio id is invalid!",
    })

  const audio = await Audio.findById(audioId)
  if (!audio)
    return res.status(404).json({
      error: "Resources not found!",
    })

  const alreadyExists = await Favorite.findOne({
    owner: req.user.id,
    items: audioId,
  })

  if (alreadyExists) {
    // Remove from list
    await Favorite.updateOne(
      {
        owner: req.user.id,
      },
      {
        $pull: { items: audioId },
      }
    )

    status = "removed"
  } else {
    const favorite = await Favorite.findOne({
      owner: req.user.id,
    })
    if (favorite) {
      // List already exists so add new
      await Favorite.updateOne(
        {
          owner: req.user.id,
        },
        {
          $addToSet: { items: audioId },
        }
      )
    } else {
      //  Create list for first time
      await Favorite.create({
        owner: req.user.id,
        items: [audioId],
      })
    }
    status = "added"
  }

  if (status === "added") {
    await Audio.findByIdAndUpdate(audioId, {
      $addToSet: {
        likes: req.user.id,
      },
    })
  }
  if (status === "removed") {
    await Audio.findByIdAndUpdate(audioId, {
      $pull: {
        likes: req.user.id,
      },
    })
  }
  res.json({ status })
}

export const getFavorites: RequestHandler = async (req, res) => {
  const userId = req.user.id
  const favorites = await Favorite.findOne({ owner: userId }).populate<{
    items: IPopulatedFavList[]
  }>({
    path: "items",
    populate: {
      path: "owner",
    },
  })

  if (!favorites) return res.json({ favorites: {} })
  const audios = favorites.items.map((item) => {
    return {
      id: item._id,
      title: item.title,
      category: item.category,
      file: item.file.url,
      poster: item.poster?.url,
      owner: { name: item.owner.name, id: item.owner._id },
    }
  })
  res.json({ audios })
}

export const getIsFavorite: RequestHandler = async (req, res) => {
  const audioId = req.query.audioId as string

  if (!isValidObjectId(audioId))
    return res.status(422).json({ error: "Invalid audioId!" })

  const favorite = await Favorite.findOne({
    owner: req.user.id,
    items: audioId,
  })

  res.json({ result: favorite ? true : false })
}
