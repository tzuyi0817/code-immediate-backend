import express from 'express';
import { urlencoded, json } from 'body-parser';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

import { userRouter } from './routes/user';
import passport from './config/passport';

const port = 3000;
const app = express();

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(userRouter);
app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost/code-immediate')
  .then(() => console.log('connected to database'));

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});

