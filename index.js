const express = require("express");
require("dotenv").config();
const cors = require("cors");
const routes = require("./Routes/routes");
require("./Connection/db");

const server = express();

// Middleware
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true })); 

server.use("/uploads", express.static("./uploads"));



server.use(routes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});
