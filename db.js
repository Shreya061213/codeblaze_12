const mongoose = require("mongoose");

module.exports = () => {
  mongoose.connect("mongodb://localhost/kirana360")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
};
   