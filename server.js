import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Start server
app.listen(5000, () => {
  console.log("Backend running at http://localhost:5000");
});
