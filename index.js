const express = require("express");
const admin = require("firebase-admin");

// Load service account

const serviceAccount = require("./servicekey.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

app.use(express.json());

app.use(express.json());

const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.get('/adminhome' , (req , res) => 
{
  res.sendFile("/index.html");
});


app.post("/add-food", async (req, res) => {
  try {
    const { foodName, price, rating , imgUrl} = req.body;

    const docRef = await db.collection("foods").add({
      foodName,
      price,
      rating,
      imgUrl,
    });

    res.json({ message: "Foodadded", id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------
// GET ALL USERS
// -----------------------------
app.get("/getFoods", async (req, res) => {
  try {
    const snapshot = await db.collection("foods").get();
    const foods = [];

     snapshot.forEach((doc) => {
      foods.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------
// GET SINGLE USER
// -----------------------------
app.get("/users/:id", async (req, res) => {
  try {
    const doc = await db.collection("users").doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------
// UPDATE USER
// -----------------------------
app.put("/users/:id", async (req, res) => {
  try {
    await db.collection("users").doc(req.params.id).update(req.body);

    res.json({ message: "User updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------
// DELETE USER
// -----------------------------
app.post("/deleteFood", async (req, res) => {
  const { id } = req.body;
  await db.collection("foods").doc(id).delete();
  res.json({ message: "Deleted" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});