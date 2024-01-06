require('dotenv').config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const app = express();
const verifyToken = require('./middleware/authMiddleware');
const authRoutes = require("./routes/auth");
const productsRoutes = require("./routes/products")
const protectedRoute = require("./routes/protectedRoute");
const swaggerSpec = require("./swagger");
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);
app.use("/protected", verifyToken, protectedRoute);
app.use("/products", productsRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the API");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, (error) => {
  if (error) {
    console.error("Error starting the server:", error);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
