const express = require("express");
const app = express();
const db = require("./config/db");
const dotenv = require("dotenv");
const blogRoutes = require("./routes/blogRoutes");
const userRoutes = require("./routes/userRoutes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(cookieParser()); // Parse cookies
// app.use(bodyParser.json());


dotenv.config();
const port = process.env.PORT || 8000;
app.use(bodyParser.json());
db.connect((err) => {
    if (err) {
        console.error("Could not connect to MySQL:", err);
    } else {
        console.log("Connected to MySQL!");
    }
});

app.use("/api/posts", blogRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
