import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from "multer";
import helmet from "helmet";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('view engine', 'ejs');
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

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

//for image storing in local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

//for signUp
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

//routes
app.use("/auth", authRoutes);//for authentication and login
app.use("/users", userRoutes);//users
app.use("/posts", postRoutes);//post routes

app.listen(process.env.PORT || 6001, function () {
  console.log("Server started.");
});
