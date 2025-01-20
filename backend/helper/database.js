const mongoose = require("mongoose");
const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database Connection Established...!");
    })
    .catch((err) => {
      console.log("Error: Database connection can not be established...!", err);
    });
};

module.exports = {
  connectDB,
};
