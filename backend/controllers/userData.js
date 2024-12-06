const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup function
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
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);
                const [result] = await db
                    .promise()
                    .execute(
                        "INSERT INTO users (name, username, password) VALUES (?, ?, ?)",
                        [name, email, hashedPassword]
                    );
                res.status(201).json({ message: "User created successfully" });
            }
        }
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Login function

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const [rows] = await db
            .promise()
            .execute("SELECT * FROM users WHERE username = ?", [email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const user = rows[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user.id, email: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send token as an HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true, // Prevent client-side JavaScript access
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
};

exports.verifyToken = (req, res) => {
    const token = req.cookies.token; // Get token from cookies
    if (!token) {
        return res.status(401).json({ valid: false, message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ valid: false, message: "Invalid token" });
        }
        res.status(200).json({ valid: true, user });
    });
};