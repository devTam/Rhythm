import { IAudio } from "@/models/audio"
import { Request } from "express"
import { ObjectId } from "mongoose"

export type IPopulatedFavList = IAudio<{ _id: ObjectId; name: string }>

export interface ICreatePlaylistRequest extends Request {
  body: {
    title: string
    resId: string
    visibility: "public" | "private"
  }
}

export interface IUpdatePlaylistRequest extends Request {
  body: {
    title: string
    id: string
    item: string
    visibility: "public" | "private"
  }
}
 