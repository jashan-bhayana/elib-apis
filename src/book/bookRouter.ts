const express = require("express");
import path from "node:path";
import multer from "multer";
import { createBook } from "./bookController";
import authenticate from "../middlewares/authenticate";

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"), // .. means 1 folder back,multer will create folder by itself
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const bookRouter = express.Router();

bookRouter.post(
  "/",
  authenticate ,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
); //  () => {} : middleware , here upload is created as middleware with the help of multer

export default bookRouter;
