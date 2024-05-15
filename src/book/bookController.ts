import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from 'node:fs'
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const {title , genre} = req.body;
  console.log("files", req.files);

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const coverImageMimeType = files.coverImage[0].mimetype.split("/").pop();
  const filename = files.coverImage[0].filename;
  //send files to cloudinary
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

   const _req = req as AuthRequest
    
    const newBook = await bookModel.create({
        title ,
        genre  ,
        author : _req.userId,  //author id from MongoDb compass
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

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, genre } = req.body;
        const bookId = req.params.bookId;

        const book = await bookModel.findById(bookId);

        if (!book) {
            return next(createHttpError(404, "Book not found"));
        }

        // Check if the user is authorized to update the book
        const _req = req as AuthRequest;
        if (book.author.toString() !== _req.userId) {
            return next(createHttpError(403, "Unauthorized to update the book"));
        }

        // Check if the image field exists
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        let newCoverImage = book.coverImage;
        if (files.coverImage) {
            const coverFileName = files.coverImage[0].filename;
            const coverMimeType = files.coverImage[0].mimetype.split('/').at(-1);
            // Send files to cloudinary
            const filePath = path.resolve(__dirname, '../../public/data/uploads/', coverFileName);
            const uploadResult = await cloudinary.uploader.upload(filePath, {
                filename_override: `${coverFileName}.${coverMimeType}`,
                folder: 'book-covers',
                format : coverMimeType,
            });
            newCoverImage = uploadResult.secure_url;
            await fs.promises.unlink(filePath);
        }

        // Check if the file field exists
        let newFileName = book.file;
        if (files.file) {
            const bookFileName = files.file[0].filename;
            const fileMimeType = files.file[0].mimetype.split('/').at(-1);
            // Send files to cloudinary
            const bookFilePath = path.resolve(__dirname, '../../public/data/uploads/', bookFileName);
            const uploadResult2 = await cloudinary.uploader.upload(bookFilePath, {
                resource_type: 'raw',
                filename_override: `${bookFileName}.${fileMimeType}`,
                folder: 'book-pdfs',
                format : 'pdf'
            });
            newFileName = uploadResult2.secure_url;
            await fs.promises.unlink(bookFilePath);
        }

        const updatedBook = await bookModel.findByIdAndUpdate(bookId, {
            title: title,
            genre: genre,
            coverImage: newCoverImage,
            file: newFileName,
        }, { new: true });

        res.json(updatedBook);
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: "Failed to update book", error: error });
        next(createHttpError(500, 'Failed to update book'));
    }
};

export { createBook , updateBook };
