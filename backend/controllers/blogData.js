const db = require("../config/db");

exports.getAllBlog = async (req, res) => {
    try {
        const [rows] = await db.promise().execute("select * from blogData");
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createBlog = async (req, res) => {
    const { title, author, content } = req.body;
    console.log("hitting", req.body);
    try {
        const [result] = await db
            .promise()
            .execute(
                "insert into blogData (title,author,content) values(?,?,?)",
                [title, author, content]
            );
        res.status(201).json({message:"data inserted successfullly"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBlogById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db
            .promise()
            .execute("SELECT * FROM blogData WHERE id = ?", [id]);
        if (rows.length === 0) {
            res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Error fetching blog:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
