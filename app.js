const express = require("express")
const app = express()
require("dotenv/config")
const connectDb=require("./db/connect")
const port = process.env.PORT || 3000
app.use(express.json())
const errorHandler = require("./middleware/errorHandler")
const notFound = require("./middleware/not-found")

const router = require("./routes/Products")
app.use("/products", router)
app.use(notFound)
app.use(errorHandler)

const start = async () => {
    try {
      await connectDb(process.env.MONGO_URI);
      app.listen(port, () => {
        console.log("Server is running on port", port);
      });
    } catch (err) {
      console.log("Failed to connect to the database:", err);
    }
  };
  
  start();
  