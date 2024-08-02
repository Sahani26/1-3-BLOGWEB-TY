const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const cors = require('cors');
const multer = require("multer");
const path = require("path");
dotenv.config();
app.use(express.json()); //you can send any json file json object
app.use("/images", express.static(path.join(__dirname, "/images")))
  

const port = process.env.PORT || 3000;

app.use(cors({
  origin: `${process.env.FRONT}`
}));

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify:true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("MongoDB connection failed:", error.message);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});
// app.get("./test", console.log('testdo'))
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});