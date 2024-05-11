const express = require('express');
//import express from 'express'
import { createBook } from './bookController';

const bookRouter = express.Router();

bookRouter.post('/' , createBook);

export default bookRouter;