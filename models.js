const mongoose = require("mongoose");

const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  phone: String,
  role: String,
  password: String
}));

const Udhaar = mongoose.model("Udhaar", new mongoose.Schema({
  ownerId: String,
  customerId: String,
  amount: Number
}));

const Inventory = mongoose.model("Inventory", new mongoose.Schema({
  ownerId: String,
  itemName: String,
  stock: Number,
  price: Number
}));

const Sale = mongoose.model("Sale", new mongoose.Schema({
  ownerId: String,
  item: String,
  price: Number,
  date: { type: Date, default: Date.now }
}));

const Loyalty = mongoose.model("Loyalty", new mongoose.Schema({
  customerId: String,
  points: Number
}));

module.exports = { User, Udhaar, Inventory, Sale, Loyalty };
