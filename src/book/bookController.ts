import { NextFunction, Request, Response } from "express";

const createBook = (res:Response,req:Request,next:NextFunction) => {
    
    res.json({message : "Book created"})
}

export {createBook}