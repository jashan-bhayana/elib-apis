import express, { NextFunction, Request, Response } from 'express'
import createHttpError, { HttpError } from 'http-errors'
import { config } from './config/config'
import globalErrorHandler from './middlewares/globalErrorHandler'
import userRouter from './user/userRouter'


const app = express()


  app.get('/' , (req,res,next) =>{
    
      // const error = createHttpError(400,"something went wrong")
      // throw error;
      res.json({message: "Welcome to elib apis" })

  })

  app.use(express.json())

  app.use('/api/users',userRouter)


  //Global error handler
  app.use(globalErrorHandler)


export default app

