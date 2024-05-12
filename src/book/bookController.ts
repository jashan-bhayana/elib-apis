import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  // const {} = req.body;
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
     //res.json({});
    
 } catch (err) {
    console.error("Error uploading image to cloudinary:", err);
    res.status(500).json({ message: "Failed to upload image to cloudinary", error: err });
    return next(createHttpError(500 , 'failed to upload image to cloudinary'))
    
 }

 const fileMimeType = files.file[0].mimetype.split('/').pop()
 const bookFilename = files.file[0].filename;
 const bookFilePath = path.resolve(__dirname , '../../public/data/uploads' , bookFilename)

try {
    const uploadResult2 = await cloudinary.uploader.upload(bookFilePath, {
       filename_override: bookFilename,
       folder: "book-pdfs",
       format: fileMimeType,
     });
     console.log("upload result 2" , uploadResult2);
     res.json({ message : "book uploaded successfully"})
    
} catch (error) {
    console.error("Error uploading file to cloudinary:", error);
    res.status(500).json({ message: "Failed to upload file to cloudinary", error: error });
    return next(createHttpError(500 , 'failed to upload file to cloudinary'))
    
}
};

export { createBook };
