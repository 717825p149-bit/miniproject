const express = require("express");
const admin = require("firebase-admin");
const path = require("path");

const app = express();

app.use(express.json());

// -----------------------------
// 🔥 Firebase Setup (Render Safe)
// -----------------------------

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// -----------------------------
// Static Folder
// -----------------------------
app.use(express.static(path.join(__dirname, "public")));

app.get("/adminhome", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// -----------------------------
// ADD FOOD
// -----------------------------
app.post("/add-food", async (req, res) => {
  try {
    const { foodName, price, rating, imgUrl } = req.body;

    const docRef = await db.collection("foods").add({
      foodName,
      price,
      rating,
      imgUrl,
    });

    res.json({ message: "Food added", id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------
// GET ALL FOODS
// -----------------------------
app.get("/getFoods", async (req, res) => {
  try {
    const snapshot = await db.collection("foods").get();
    const foods = [];

    snapshot.forEach((doc) => {
      foods.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------
// DELETE FOOD
// -----------------------------
app.post("/deleteFood", async (req, res) => {
  try {
    const { id } = req.body;
    await db.collection("foods").doc(id).delete();
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------
// IMPORTANT FOR RENDER
// -----------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});