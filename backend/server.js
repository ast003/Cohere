const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const { nanoid } = require("nanoid"); // CommonJS-compatible nanoid@3

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const storagePath = "./storage";
if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath);
}

// Save content and return shareable link
app.post("/save", (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  const fileId = nanoid();
  const filePath = `${storagePath}/${fileId}.txt`;

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to save the file." });
    }

    const shareableLink = `http://localhost:${PORT}/file/${fileId}`;
    res.json({ fileId, shareableLink });
  });
});

// Serve the file by ID
app.get("/file/:fileId", (req, res) => {
  const fileId = req.params.fileId;
  const filePath = `${storagePath}/${fileId}.txt`;

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found.");
  }

  res.download(filePath);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
