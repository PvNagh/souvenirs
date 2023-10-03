import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from "multer";
import helmet from "helmet";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { getImage } from './controllers/image.js';
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import { GridFsStorage } from "multer-gridfs-storage";

dotenv.config();

const app = express();
app.set('view engine', 'ejs');
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(cors());

const Connection = async (url) => {
  const URL = url;
  mongoose.set('strictQuery', false);
  try {
    await mongoose.connect(URL,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true
      });
    console.log('Database Connected Succesfully');
  } catch (error) {
    console.log('Error: ', error.message);
  }
};

Connection(process.env.ATLAS_URL);

const url = process.env.ATLAS_URL;
const storage = new GridFsStorage({
  url: `${url}`,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (request, file) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png')
      return `${file.originalname}`;

    return {
      bucketName: "photos",
      filename: `${file.originalname}`
    }
  }
});

const upload = multer({ storage });

//for signUp
app.post("/auth/register", upload.single("picture"), register);

//getting the image file
app.get("/file/:filename", getImage);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

//routes
app.use("/auth", authRoutes);//for authentication and login
app.use("/users", userRoutes);//users
app.use("/posts", postRoutes);//post routes

app.listen(process.env.PORT, function () {
  console.log("Server started.");
});