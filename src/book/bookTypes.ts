import { Date } from "mongoose";
import { User } from "../user/userTypes";

export interface Book {
    _id : string,
    title: string,
    author : User,   //will be recieved as JWT token for security
    genre : string,
    coverImage: string,
    file:string,
    createdAt : Date,
    updatedAt : Date,

}