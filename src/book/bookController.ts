import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from 'node:fs'
import createHttpError from "http-errors";
import bookModel from "./bookModel";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const {title , genre} = req.body;
  console.log("files", req.files);

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const coverImageMimeType = files.coverImage[0].mimetype.split("/").pop();
  const filename = files.coverImage[0].filename;
  const filePath = path.resolve(__dirname, "../../public/data/uploads", filename);
  
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: filename,
      folder: "book-covers",
      format: coverImageMimeType,
    });
  
    console.log("upload result" , uploadResult)
    
    const fileMimeType = files.file[0].mimetype.split('/').pop()
    const bookFilename = files.file[0].filename;
    const bookFilePath = path.resolve(__dirname , '../../public/data/uploads' , bookFilename)
    
    const uploadResult2 = await cloudinary.uploader.upload(bookFilePath, {
        resource_type : "raw",
        filename_override: bookFilename,
        folder: "book-pdfs",
        format: fileMimeType,
    });

    console.log("upload result 2" , uploadResult2);
    
    const newBook = await bookModel.create({
        title ,
        genre  ,
        author : "663b206755b827015a192f58",  //author id from MongoDb compass
        coverImage : uploadResult.secure_url,
        file : uploadResult2.secure_url
    });

    //delete temporary files from public
    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);

    res.status(201).json({ id: newBook._id, message: "Book uploaded successfully" });
    
  } catch (error) {
    console.error("Error uploading file to cloudinary:", error);
    res.status(500).json({ message: "Failed to upload file to cloudinary", error: error });
    return next(createHttpError(500 , 'Failed to upload file to cloudinary'));
  }
};

export { createBook };
