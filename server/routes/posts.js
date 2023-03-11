import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getFeedPosts);//gets all posts for the feed
router.get("/:userId/posts", verifyToken, getUserPosts);//get a specific feed
router.patch("/:id/like", verifyToken, likePost);//like the post

export default router;