const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// uploaded images are served from /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// every API route starts with /api (the front end uses VITE_API_URL=http://localhost:5000/api)
app.use("/api/home", require("./routes/HomeRoutes"));
app.use("/api/uploads", require("./routes/uploadsRoutes"));

app.get("/", (req, res) => res.send("Chhotu Ram Polytechnic API is running!"));

if (process.env.MONGO_URI) connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));