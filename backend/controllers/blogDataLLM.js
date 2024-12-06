const { GoogleGenerativeAI } = require("@google/generative-ai");
const db = require("../config/db");
const dotenv = require("dotenv");
dotenv.config();

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.createBlogWithLLM = async (req, res) => {
  const { title, author, contentPrompt } = req.body;
  
  if (!contentPrompt) {
    return res.status(400).json({ message: "Content prompt is required" });
  }
  
  try {
    // Initialize the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Generate content
    const result = await model.generateContent(contentPrompt);
    const generatedContent = result.response.text().trim();
    
    // Insert into database
    const [insertResult] = await db
      .promise()
      .execute(
        "INSERT INTO blogData (title, author, content) VALUES (?, ?, ?)",
        [title, author, generatedContent]
      );
    
    res.status(201).json({
      message: "Blog created successfully with LLM content",
      blog: {
        id: insertResult.insertId,
        title,
        author,
        content: generatedContent,
      },
    });
  } catch (error) {
    console.error("Error generating blog content:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};