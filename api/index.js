const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");

const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const messageRoute = require('./routes/messages');
const conversationRoute = require('./routes/conversations');

dotenv.config();

//  Serve static files from public/images
app.use("/images", express.static(path.join(__dirname, "public/images")));


app.use(express.json());
app.use(helmet());
app.use(
  helmet.crossOriginResourcePolicy({ policy: "cross-origin" })
);
app.use(morgan("common"));
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true // if you're using cookies
}));


// 🔧 Routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/messages", messageRoute);
app.use("/api/conversations", conversationRoute);

// 🔧 Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/images")); 
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-"+ file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Upload Route
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    console.log("File uploaded:", req.file);
    return res.status(200).json({ filename: req.file.filename });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json("Upload failed");
  }
});


//  MongoDB Connect
mongoose.connect(process.env.Mongo_Url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error("MongoDB connection error:", err));

// ✅ Server Listening
app.listen(8800, () => {
  console.log("Backend server running on http://localhost:8800");
});
