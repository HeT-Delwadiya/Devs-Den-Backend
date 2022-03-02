require('dotenv').config()
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//Import Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const groupRoutes = require("./routes/group");
const companyRoutes = require("./routes/company");
const compilerRoutes = require("./routes/compiler");
const conversationRoutes = require("./routes/conversation");
const messageRoutes = require("./routes/message");
const contactRoutes = require("./routes/contact");

const app = express();

//Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Set Routes
app.use("/api",  authRoutes);
app.use("/api",  userRoutes);
app.use("/api",  postRoutes);
app.use("/api",  groupRoutes);
app.use("/api",  companyRoutes);
app.use("/api",  compilerRoutes);
app.use("/api",  conversationRoutes);
app.use("/api",  messageRoutes);
app.use("/api",  contactRoutes);

//DB connection
mongoose.connect(process.env.DB_URL)
.then(() => console.log("DB connected successfully"));





//server starter
app.listen(process.env.PORT || 8000, () => console.log("Server started on port: "+process.env.PORT));