const db = require("../config/db");

exports.signUp = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        } else {
            const [rows] = await db
                .promise()
                .execute("SELECT * FROM users WHERE username = ?", [email]);
            if (rows.length > 0) {
                return res.status(400).json({ message: "User already exists" });
            } else {
                const [result] = await db
                    .promise()
                    .execute(
                        "INSERT INTO users (name, username, password) VALUES (?, ?, ?)",
                        [name, email, password]
                    );
                res.status(201).json({ message: "User created successfully" });
            }
        }
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const [rows] = await db
            .promise()
            .execute(
                "SELECT * FROM users WHERE username = ? AND password = ?",
                [email, password]
            );
        if (rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
