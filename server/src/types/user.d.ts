import { Request } from "express";

export interface UserRequest extends Request {
    body: {
        name: string;
        email: string;
        password: string;
    }
}