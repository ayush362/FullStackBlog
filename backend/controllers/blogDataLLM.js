const { OpenAI } = require("openai");
const db = require("../config/db");
const dotenv = require("dotenv");
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY, // Your API key
});

exports.createBlogWithLLM = async (req, res) => {
    const { title, author, contentPrompt } = req.body;
    console.log(req.body)

    if (!contentPrompt) {
        return res.status(400).json({ message: "Content prompt is required" });
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Use the appropriate model
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: contentPrompt },
            ],
            max_tokens: 300,
            temperature: 0.5,
        });

        const generatedContent = response.choices[0].message.content.trim();

        const [result] = await db
            .promise()
            .execute(
                "INSERT INTO blogData (title, author, content) VALUES (?, ?, ?)",
                [title, author, generatedContent]
            );

        res.status(201).json({
            message: "Blog created successfully with LLM content",
            blog: {
                id: result.insertId,
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
