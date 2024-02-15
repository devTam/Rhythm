import { Request } from "express"

declare global {
  namespace Express {
    interface Request {
      user: {
        id: any
        name: string
        email: string
        verified: boolean
        avatar?: string
        followers: number
        followings: number
      }
    }
  }
}
export interface UserRequest extends Request {
  body: {
    name: string
    email: string
    password: string
  }
}

export interface VerifyEmailRequest extends Request {
  body: {
    token: string
    userId: string
  }
}

export interface ReVerifyEmailRequest extends Request {
  body: {
    userId: string
  }
}
