const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// ✅ GET all users
app.get("/users", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (error) {
    console.error("GET /users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ✅ POST create user
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email)
      return res.status(400).json({ error: "Missing name or email" });

    const ref = await db.collection("users").add({ name, email });
    res.status(201).json({ id: ref.id });
  } catch (error) {
    console.error("POST /users error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// ✅ PUT update user
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    await db.collection("users").doc(id).update(data);
    res.status(200).json({ message: "User updated" });
  } catch (error) {
    console.error("PUT /users/:id error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// ✅ DELETE user
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("users").doc(id).delete();
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error("DELETE /users/:id error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// ✅ Export the API
exports.api = functions.https.onRequest(app);
