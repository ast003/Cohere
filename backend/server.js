import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
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

const DocumentSchema = new mongoose.Schema({
    _id: String,
  content: String,
});

const Document = mongoose.model("Document", DocumentSchema);

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
