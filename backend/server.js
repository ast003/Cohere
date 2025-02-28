import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

mongoose
  .connect("mongodb://localhost:27017/db", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const UserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
});

const DocumentSchema = new mongoose.Schema({
  _id: String,
  content: String,
});

const User = mongoose.model("User", UserSchema);
const Document = mongoose.model("Document", DocumentSchema);

// **Middleware to authenticate JWT**
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
};

// **User Registration**
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error registering user", error: err.message });
  }
});

// **User Login**
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// **Protected Route Example**
app.get("/profile", authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  res.json(user);
});

// **Socket.io Authentication (Client should send token)**
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(new Error("Authentication error"));
    socket.user = user;
    next();
  });
});

// **Socket.io Events**
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("get-document", async (docId) => {
    let document = await Document.findById(docId);
    if (!document) {
      document = await Document.create({ _id: docId, content: "" });
    }
    socket.join(docId);
    socket.emit("load-document", document.content);
  });

  socket.on("save-document", async ({ docId, content }) => {
    await Document.findByIdAndUpdate(docId, { content });
  });

  socket.on("send-changes", ({ docId, delta }) => {
    socket.to(docId).emit("receive-changes", delta);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
