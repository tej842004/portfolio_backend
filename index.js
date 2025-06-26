require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const auth = require("./routes/auth");
const users = require("./routes/users");
const blogs = require("./routes/blogs");
const genres = require("./routes/genres");
const image = require("./routes/image");
const projects = require("./routes/projects");
const mail = require("./routes/mail");
const comments = require("./routes/comments");
const likes = require("./routes/likes");
const visitors = require("./routes/visitors");

const express = require("express");
const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from Render!");
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

app.use(express.json());
app.use("/api/blogs", blogs);
app.use("/api/genres", genres);
app.use("/api/uploadImage", image);
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/projects", projects);
app.use("/api/contact", mail);
app.use("/api/comments", comments);
app.use("/api/likes", likes);
app.use("/api/user-visit", visitors);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
