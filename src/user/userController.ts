import createHttpError, { HttpError } from "http-errors";
import { NextFunction, Request, Response } from "express";
import userModel from "./userModel";
import bcrypt from 'bcrypt'
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  //Validation
  if (!name || !email || !password) {
    console.log("reqData:", req.body);
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  //Database call
  const user = await userModel.findOne({email})

  if(user){
    const error = createHttpError(400,"user already exists with this email. please Login");
    return next(error);
  }

  //password hash
  const hashedPassword = await bcrypt.hash(password , 10)

  const newUser = await userModel.create({
    name,
    email,
    password:hashedPassword,
  })

  //Token generation from JWT
  const token = sign({sub:newUser._id }, config.JWT as string , {expiresIn:'7d'}) 


  //Response
 // res.json({ id:newUser._id , message: "User Created" });
 res.json({ accessToken : token });
};

export { createUser };
