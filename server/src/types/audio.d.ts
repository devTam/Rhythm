import { IAudio } from "@/models/audio"
import { ObjectId } from "mongoose"

export type IPopulatedFavList = IAudio<{ _id: ObjectId; name: string }>
