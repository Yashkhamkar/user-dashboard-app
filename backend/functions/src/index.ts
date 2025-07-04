import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

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
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ✅ POST create user
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const ref = await db.collection("users").add({ name, email });
    res.status(201).json({ id: ref.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// ✅ PUT update user
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("users").doc(id).update(req.body);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// ✅ DELETE user
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("users").doc(id).delete();
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// 🌐 Expose the Express app as a single Cloud Function
exports.api = functions.https.onRequest(app);
