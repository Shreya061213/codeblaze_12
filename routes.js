const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { User, Udhaar, Inventory, Sale, Loyalty } = require("./models");

/* LOGIN */
router.post("/login", async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });
  if (!user) return res.json({ error: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ error: "Wrong password" });

  const token = jwt.sign({ id: user._id }, "secret");

  res.json({ token, role: user.role, name: user.name, userId: user._id });
});

/* Udhaar */
router.post("/udhaar/add", async (req, res) => {
  res.json(await Udhaar.create(req.body));
});

router.get("/udhaar/:id", async (req, res) => {
  res.json(await Udhaar.find({ ownerId: req.params.id }));
});

/* Inventory */
router.post("/inventory/add", async (req, res) => {
  res.json(await Inventory.create(req.body));
});

router.get("/inventory/:id", async (req, res) => {
  res.json(await Inventory.find({ ownerId: req.params.id }));
});

/* Billing */
router.post("/billing/sale", async (req, res) => {
  const sale = await Sale.create(req.body);
  res.json({ message: "Receipt Generated", sale });
});

router.get("/billing/history/:id", async (req, res) => {
  res.json(await Sale.find({ ownerId: req.params.id }));
});

/* Loyalty */
router.get("/loyalty/:cid", async (req, res) => {
  const record = await Loyalty.findOne({ customerId: req.params.cid });
  res.json(record || { points: 0 });
});

router.post("/loyalty/add", async (req, res) => {
  const { customerId, points } = req.body;

  let record = await Loyalty.findOne({ customerId });
  if (!record)
    record = await Loyalty.create({ customerId, points: 0 });

  record.points += points;
  await record.save();

  res.json(record);
});

module.exports = router;
