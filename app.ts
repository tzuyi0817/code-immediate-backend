import express from 'express';
import { urlencoded, json } from 'body-parser';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { userRouter } from './routes/user';

const port = 3000;
const app = express();

dotenv.config();
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(userRouter);

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost/code-immediate')
  .then(() => console.log('connected to database'));

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});

