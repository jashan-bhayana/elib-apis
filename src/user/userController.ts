import createHttpError, { HttpError } from 'http-errors';
import { NextFunction, Request, Response } from "express";

const createUser = async (req:Request,res:Response,next:NextFunction) => {
    
    const {name , email , password} = req.body;
    //Validation
    if(!name || !email || !password) {
        console.log('reqData:' ,req.body)

        const error = createHttpError(400,"All fields are required");
        return next(error);
        
    }

    res.json({message : "User Created"})
}


export {createUser}