import createHttpError, { HttpError } from "http-errors";
import { NextFunction, Request, Response } from "express";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  //Validation
  if (!name || !email || !password) {
    console.log("reqData:", req.body);
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  //Database call
  try {
    const user = await userModel.findOne({ email });

    if (user) {
      const error = createHttpError(
        400,
        "user already exists with this email.Please Login"
      );
      return next(error);
    }
  } catch (err) {
    return next(createHttpError(500, "Error while creating user"));
  }

  //password hash
  const hashedPassword = await bcrypt.hash(password, 10);

  //creating new User
  let newUser: User;
  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    return next(createHttpError(500, "Error while creating user"));
  }

  try {
    const token = sign({ sub: newUser._id }, config.JWT as string, {
      expiresIn: "7d",
    });

    //Response
    //res.json({ id:newUser._id , message: "User Created" });
    res.status(201).json({ accessToken: token });
  } catch (err) {
    return next(createHttpError(500, "Error while signing JWT token"));
  }
  //Token generation from JWT
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const {email,password} = req.body;
  
  if(!email || !password){
    return next(createHttpError(400,"All fields are required"))
  }
 
  let user : User | null;
  try {
    user = await userModel.findOne({email});
    if(!user){
      return next(createHttpError(404,"User not found"))
    }
  } catch (err) {
    return next(createHttpError(404,"User not found"));
  }
  
  const isMatch = await bcrypt.compare(password,user.password);
  
  if(!isMatch){
    return next(createHttpError(400,"Invalid username or password"))
  }
  
  //If user is authenticated so Create access token
  const token = sign({sub :user._id} , config.JWT as string , {
    
    expiresIn: '7d',
    algorithm: 'HS256'
    
  });
  
  res.json({accessToken : token});

  

}

export { createUser , loginUser };
