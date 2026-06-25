require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

// routes
const userRouter = require("./routes/user-routes");
const blogRouter = require("./routes/blog-routes");

// DB connection
require("./config/db");

const app = express();

// ------------------- MIDDLEWARE -------------------
app.use(cors());
app.use(express.json());

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use("/api/users", userRouter);
// ------------------- ROUTES -------------------

// base route (health check)
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// user routes
app.use("/api/users", userRouter);

// blog routes
app.use("/api/blogs", blogRouter);

// ------------------- SERVER -------------------
app.listen(5001, () => {
  console.log("app started at 5001...");
});