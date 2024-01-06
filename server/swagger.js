const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    info: {
      title: "Your API",
      version: "1.0.0",
      description: "Your API description",
    },
    servers: [
      { url: "http://localhost:3001", description: "Development server" },
    ],
    securityDefinitions: {
      BasicAuth: {
        type: "basic"
      },
    }
  },
  apis: ["./routes/auth.js", "./routes/protectedRoute.js", "./routes/products.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
