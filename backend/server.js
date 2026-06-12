const express = require("express");
const cors = require("cors");
const requestRoutes = require("./routes/requestRoutes");
require("dotenv").config();

const app = express();
const PORT = 8000;
const db = require("./config/db");

db.query("SELECT 1")
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });
  
app.use(cors());
app.use(express.json());

app.use('/api',requestRoutes);

app.listen(PORT,()=>{console.log(`Server is running on port ${PORT}`)});
