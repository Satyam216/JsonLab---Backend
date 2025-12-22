import { db } from "./firebase.js";

export const createCollection = async (req, res) => {
  const { user_id, name } = req.body;

  const ref = await db.collection("collections").add({
    user_id,
    name,
    created_at: new Date(),
  });

  res.json({ id: ref.id });
};

export const getCollections = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) return res.json([]);

    const snapshot = await db
      .collection("collections")
      .where("user_id", "==", user_id)
      .orderBy("created_at", "desc")
      .get();

    res.json(snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    })));

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
