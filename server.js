const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const routes = require("./routes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.listen(5000, () => console.log("Server running on 5000"));
