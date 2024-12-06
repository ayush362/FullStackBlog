const express = require("express");
const router = express.Router();
const {
    getAllBlog,
    getBlogById,
    createBlog,
} = require("../controllers/blogData");
const { createBlogWithLLM } = require("../controllers/blogDataLLM");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/", getAllBlog);
router.post("/", createBlog);
router.get("/:id", getBlogById);

router.post("/create-with-llm", createBlogWithLLM); // New endpoint for LLM blog creation
module.exports = router;
