import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { proxyRequest } from "./proxy.js";
import { db } from "./firebase.js";
import { createCollection, getCollections } from "./collections.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// TEST ROUTE
// app.get("/ping", (req, res) => {
//   res.json({ message: "pong" });
// });

app.get("/", (req, res) => {
  res.send("JsonLab Backend is running ");
});


app.post("/proxy", proxyRequest);

app.get("/history", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json([]);

    const snapshot = await db
      .collection("history")
      .where("user_id", "==", user_id)
      .orderBy("created_at", "desc")
      .limit(20)
      .get();

    const history = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(history);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/collections", createCollection);
app.get("/collections", getCollections);


// Start server
app.listen(5000, () => {
  console.log("Backend running at http://localhost:5000");
});
